import React, { useCallback } from 'react';
import { TodoForm } from './TodoForm';
import { TodoList } from './TodoList';
import { TodoFilter } from './TodoFilter';
import { Navbar } from '@shared/components/Navbar';
import { useTodos } from '../hooks/useTodos';
import { useTodoFilter } from '../hooks/useTodoFilter';

export const TodoApp: React.FC = () => {
  const { 
    todos, 
    addTodo, 
    deleteTodo, 
    toggleTodoStatus, 
    updateTodoTitle,
    isLoading,
    error 
  } = useTodos();

  const {
    filter,
    setFilter,
    filteredTodos,
    completedCount,
  } = useTodoFilter(todos);
  
  const clearCompleted = useCallback(() => {
    todos.filter(todo => todo.completed).forEach(todo => deleteTodo(todo.id));
  }, [todos, deleteTodo]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-xl text-gray-600">Loading todos...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error.message}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mt-8">
          <TodoForm onSubmit={addTodo} isLoading={isLoading} />
          <TodoFilter
            currentFilter={filter}
            onFilterChange={setFilter}
            completedCount={completedCount}
            onClearCompleted={clearCompleted}
          />
          <TodoList
            todos={filteredTodos}
            onToggle={toggleTodoStatus}
            onDelete={deleteTodo}
            onUpdate={updateTodoTitle}
          />
        </div>
      </div>
    </div>
  );
}; 