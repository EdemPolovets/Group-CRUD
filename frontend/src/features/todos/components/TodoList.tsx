import { memo } from 'react';
import { TodoItem } from './TodoItem';
import { TodoListProps } from '../types';

const TodoList = memo(({ todos, onToggle, onDelete, onUpdate }: TodoListProps) => {
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

TodoList.displayName = 'TodoList';

export { TodoList }; 