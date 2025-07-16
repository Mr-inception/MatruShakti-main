const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'https://matru-shakti-main-frontend.vercel.app', // replace with your actual frontend URL if different
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.options('*', cors());
app.use(express.json());

// Register health assistant routes
const healthAssistantRoutes = require('./healthAssistant');
app.use(healthAssistantRoutes);

// Register MedicLocker routes
const mediclockerRoutes = require('./mediclocker');
app.use(mediclockerRoutes);

// Connect to MongoDB Atlas (replace <connection_string> with your URI)
mongoose.connect('mongodb+srv://P1:06HF0x2SS0sibpQr@matru.iyx8vnc.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

const postSchema = new mongoose.Schema({
  category: String,
  title: String,
  author: String,
  date: String,
  content: String,
  likes: Number,
  replies: Number,
  verified: Boolean,
  isExpert: Boolean,
});

const Post = mongoose.model('Post', postSchema);

// Use imported User model from './User'
const User = require('./User');

// Message schema and model for chat
const messageSchema = new mongoose.Schema({
  sender: String, // You can use userId or email
  content: String,
  timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

// Get all posts
app.get('/posts', async (req, res) => {
  const posts = await Post.find().sort({ _id: -1 });
  res.json(posts);
});

// Add a new post
app.post('/posts', async (req, res) => {
  const post = new Post(req.body);
  await post.save();
  res.json(post);
});

app.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const token = jwt.sign({ userId: user._id, email: user.email }, 'your_jwt_secret_key', { expiresIn: '7d' });
  res.json({ token, user: { email: user.email, fullName: user.fullName, userType: user.userType, profileDescription: user.profileDescription } });
});

// REST endpoint to get chat history
app.get('/chat/history', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch chat history' });
  }
});

// Import Task and User models
const Task = require('./Task');
// const UserModel = require('./User'); // This line is no longer needed

// --- Streak Tracker Endpoints ---

// Helper: get start of today
function getToday() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

// GET /api/tasks/today - Get today's tasks for a user
app.get('/api/tasks/today', async (req, res) => {
  // TODO: Replace with real user ID from auth
  const userId = req.query.userId || '663b1e1f1f1f1f1f1f1f1f1f'; // placeholder
  const today = getToday();
  try {
    // Find all tasks for today
    const tasks = await Task.find({ userId, date: today });
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch today\'s tasks' });
  }
});

// POST /api/tasks/:id/complete - Mark a task as complete and update streaks
app.post('/api/tasks/:id/complete', async (req, res) => {
  const taskId = req.params.id;
  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.completed) return res.json(task); // Already completed

    // Mark as complete
    task.completed = true;

    // Streak logic
    // Find yesterday's task of same type
    const yesterday = new Date(task.date);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const prevTask = await Task.findOne({
      userId: task.userId,
      type: task.type,
      date: yesterday
    });
    if (prevTask && prevTask.completed) {
      task.currentStreak = (prevTask.currentStreak || 0) + 1;
    } else {
      task.currentStreak = 1;
    }
    if (task.currentStreak > (task.highestStreak || 0)) {
      task.highestStreak = task.currentStreak;
    }
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to complete task' });
  }
});

// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  // Listen for new chat messages
  socket.on('chat message', async (msg) => {
    const message = new Message({ sender: msg.sender, content: msg.content });
    await message.save();
    io.emit('chat message', message); // Broadcast to all clients
  });
});

const PORT = 4000;
server.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT}`));