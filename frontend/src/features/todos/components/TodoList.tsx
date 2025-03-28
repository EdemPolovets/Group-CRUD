import React, { memo } from 'react';
import { Todo } from '@core/api/types/todo.types';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string) => void;
}

export const TodoList = memo<TodoListProps>(({ todos, onToggle, onDelete, onUpdate }) => {
  if (!todos?.length) {
    return (
      <div className="bg-white rounded-lg border-2 border-gray-300 p-4">
        <div className="p-8 text-center text-gray-500">
          No todos yet. Add one above!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border-2 border-gray-300">
      <div className="divide-y divide-gray-200">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
}); 