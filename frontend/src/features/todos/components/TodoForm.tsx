import { useState } from 'react';
import { TodoFormProps } from '../types';

export const TodoForm = ({ onSubmit, isLoading = false }: TodoFormProps) => {
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
      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new todo..."
          disabled={isLoading}
          className="flex-1 text-lg px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed h-[42px]"
        />
        <button
          type="submit"
          disabled={isLoading || !title.trim()}
          className="px-4 h-[42px] text-base font-semibold bg-blue-500 text-white rounded-md transition-all duration-200 hover:bg-yellow-600 active:bg-yellow-700 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 min-w-[100px] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-yellow-500"
        >
          {isLoading ? 'Adding...' : 'Add Todo'}
        </button>
      </div>
    </form>
  );
}; 