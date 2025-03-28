import React, { useState } from 'react';

interface TodoFormProps {
  onSubmit: (title: string) => void;
  isLoading?: boolean;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, isLoading = false }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    
    onSubmit(trimmedTitle);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new todo..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isLoading || !title.trim()}
            className="px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-md transition-all duration-200 hover:bg-green-700 active:bg-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 min-w-[100px] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600"
          >
            {isLoading ? 'Adding...' : 'Add Todo'}
          </button>
        </div>
      </div>
    </form>
  );
}; 