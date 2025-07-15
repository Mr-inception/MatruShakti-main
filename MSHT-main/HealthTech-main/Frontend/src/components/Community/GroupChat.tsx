import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

interface Message {
  _id?: string;
  sender: string;
  content: string;
  timestamp?: string;
}

const GroupChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sender, setSender] = useState('');
  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch chat history
    fetch(`${BACKEND_URL}/chat/history`)
      .then(res => res.json())
      .then(data => setMessages(data));

    // Connect to Socket.IO
    socketRef.current = io(BACKEND_URL);
    socketRef.current.on('chat message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !sender.trim()) return;
    const msg = { sender, content: input };
    socketRef.current.emit('chat message', msg);
    setInput('');
  };

  return (
    <div className="mt-10 w-full max-w-2xl mx-auto bg-white/90 rounded-xl shadow-lg p-4">
      <h3 className="text-lg font-bold mb-2">Group Chat</h3>
      <div className="h-64 overflow-y-auto border rounded p-2 bg-gray-50 mb-2">
        {messages.map((msg, idx) => (
          <div key={msg._id || idx} className="mb-1">
            <span className="font-semibold text-matru-primary">{msg.sender}:</span> <span>{msg.content}</span>
            <span className="text-xs text-gray-400 ml-2">{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="flex gap-2" onSubmit={handleSend}>
        <Input
          placeholder="Your name"
          value={sender}
          onChange={e => setSender(e.target.value)}
          className="w-1/4"
          required
        />
        <Input
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1"
          required
        />
        <Button type="submit" className="bg-matru-primary">Send</Button>
      </form>
    </div>
  );
};

export default GroupChat; 