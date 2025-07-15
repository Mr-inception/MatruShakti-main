import React, { useEffect, useState } from 'react';

// Define the Task type
interface Task {
  _id: string;
  type: string;
  completed: boolean;
  currentStreak: number;
  highestStreak: number;
}

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/tasks/today')
      .then(res => res.json())
      .then(data => {
        setTasks(data.tasks);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load tasks.');
        setLoading(false);
      });
  }, []);

  const handleComplete = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/complete`, { method: 'POST' });
      const updatedTask = await res.json();
      setTasks(tasks =>
        tasks.map(t => (t._id === updatedTask._id ? updatedTask : t))
      );
    } catch {
      setError('Failed to update task.');
    }
  };

  if (loading) return <div className="text-center mt-8 text-lg">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 rounded-lg shadow-lg bg-pink-50 font-sans">
      <h2 className="text-2xl font-semibold mb-6 text-pink-700 text-center">Today's Wellness Tasks</h2>
      <ul className="space-y-4">
        {tasks.length === 0 && <li className="text-center text-gray-500">No tasks for today.</li>}
        {tasks.map(task => (
          <li key={task._id} className="flex items-center justify-between bg-white rounded-md p-4 shadow-sm border border-pink-100">
            <label className="flex items-center space-x-3 w-full cursor-pointer">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleComplete(task._id)}
                disabled={task.completed}
                className="accent-pink-400 w-5 h-5"
              />
              <span className={`text-lg ${task.completed ? 'line-through text-gray-400' : 'text-pink-900'}`}>{task.type.charAt(0).toUpperCase() + task.type.slice(1)}</span>
            </label>
            <div className="text-right ml-4">
              <div className="text-pink-600 text-sm">Streak: <span className="font-bold">{task.currentStreak}</span></div>
              <div className="text-pink-400 text-xs">Best: {task.highestStreak}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
