import React, { useState } from 'react';
import { FilterType } from '../types';
import { Modal } from '@/shared/components/Modal';

interface TodoFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  completedCount: number;
  onClearCompleted: () => void;
}

export const TodoFilter: React.FC<TodoFilterProps> = ({
  currentFilter,
  onFilterChange,
  completedCount,
  onClearCompleted,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearCompleted = () => {
    onClearCompleted();
    setShowClearConfirm(false);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 min-w-[80px] shadow-sm focus:ring-2 focus:ring-offset-2 text-white ${
              currentFilter === 'all'
                ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500'
                : 'bg-blue-400 hover:bg-blue-500 active:bg-blue-600 focus:ring-blue-500'
            }`}
          >
            All
          </button>
          <button
            onClick={() => onFilterChange('active')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 min-w-[80px] shadow-sm focus:ring-2 focus:ring-offset-2 text-white ${
              currentFilter === 'active'
                ? 'bg-green-600 hover:bg-green-700 active:bg-green-800 focus:ring-green-500'
                : 'bg-green-400 hover:bg-green-500 active:bg-green-600 focus:ring-green-500'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => onFilterChange('completed')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 min-w-[80px] shadow-sm focus:ring-2 focus:ring-offset-2 text-white ${
              currentFilter === 'completed'
                ? 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800 focus:ring-purple-500'
                : 'bg-purple-400 hover:bg-purple-500 active:bg-purple-600 focus:ring-purple-500'
            }`}
          >
            Completed
          </button>
        </div>
        {completedCount > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-md transition-all duration-200 hover:bg-red-700 active:bg-red-800 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm min-w-[80px]"
          >
            Clear Completed ({completedCount})
          </button>
        )}
      </div>

      <Modal isOpen={showClearConfirm} onClose={() => setShowClearConfirm(false)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Clear Completed Todos</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to clear {completedCount} completed {completedCount === 1 ? 'todo' : 'todos'}? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-4 py-2 text-sm font-semibold bg-gray-500 text-white rounded-md transition-all duration-200 hover:bg-gray-600 active:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 min-w-[80px] shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleClearCompleted}
              className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-md transition-all duration-200 hover:bg-red-700 active:bg-red-800 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 min-w-[80px] shadow-sm"
            >
              Clear
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}; 