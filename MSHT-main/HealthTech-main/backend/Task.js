const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  type: { type: String, required: true }, // e.g., medication, hydration, etc.
  completed: { type: Boolean, default: false },
  currentStreak: { type: Number, default: 0 },
  highestStreak: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema); 