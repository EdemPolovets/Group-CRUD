import React, { useState, useCallback } from 'react';
import { Todo } from '@core/api/types/todo.types';
import { Modal } from '@/shared/components/Modal';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = useCallback(async () => {
    if (!editedTitle.trim()) return;
    setIsLoading(true);
    try {
      await onUpdate(todo.id, editedTitle.trim());
      setIsEditing(false);
    } finally {
      setIsLoading(false);
    }
  }, [editedTitle, onUpdate, todo.id]);

  const handleDelete = useCallback(async () => {
    setIsLoading(true);
    try {
      await onDelete(todo.id);
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  }, [onDelete, todo.id]);

  const handleToggle = useCallback(() => {
    onToggle(todo.id, !todo.completed);
  }, [onToggle, todo.id, todo.completed]);

  const handleCancel = useCallback(() => {
    setEditedTitle(todo.title);
    setIsEditing(false);
  }, [todo.title]);

  const buttonClasses = 'px-4 py-2 text-sm font-semibold text-white rounded-md transition-all duration-200 focus:ring-2 focus:ring-offset-2 min-w-[80px] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div className="p-4 flex items-center justify-between min-h-[60px] hover:bg-gray-50 transition-colors">
      <div className="flex items-center flex-1 min-w-0">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="w-6 h-6 text-blue-500 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
        />
        {isEditing ? (
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="flex-1 ml-4">
            <input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full text-lg px-4 py-2  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </form>
        ) : (
          <span
            className={`ml-4 text-lg text-gray-800 truncate ${todo.completed ? 'line-through text-gray-500' : ''}`}
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              disabled={isLoading || !editedTitle.trim()}
              className={`${buttonClasses} bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500`}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className={`${buttonClasses} bg-gray-500 hover:bg-gray-600 active:bg-gray-700 focus:ring-gray-500`}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className={`${buttonClasses} bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500`}
            >
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className={`${buttonClasses} bg-red-600 hover:bg-red-700 active:bg-red-800 focus:ring-red-500`}
            >
              Delete
            </button>
          </>
        )}
      </div>

      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
          <p className="text-gray-600 mb-6">Are you sure you want to delete this todo?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className={`${buttonClasses} bg-gray-500 hover:bg-gray-600 active:bg-gray-700 focus:ring-gray-500`}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className={`${buttonClasses} bg-red-600 hover:bg-red-700 active:bg-red-800 focus:ring-red-500`}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}; 