import { useState, useMemo } from 'react';
import { Todo } from '@core/api/types/todo.types';
 
export type TodoFilter = 'all' | 'active' | 'completed';
 
export const useTodoFilter = (todos: Todo[]) => {
  const [filter, setFilter] = useState<TodoFilter>('all');
 
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);
 
  const completedCount = todos.filter(todo => todo.completed).length;
 
  return {
    filter,
    setFilter,
    filteredTodos,
    completedCount,
  };
};