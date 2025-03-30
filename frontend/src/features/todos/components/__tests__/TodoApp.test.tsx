import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoApp } from '../TodoApp';

// Mock the TodosContext
vi.mock('@core/contexts/TodosContext', () => ({
  useTodos: () => ({
    todos: [
      { id: '1', title: 'Test Todo', completed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ],
    isLoading: false,
    error: null,
    addTodo: vi.fn(),
    updateTodo: vi.fn(),
    deleteTodo: vi.fn(),
    toggleTodo: vi.fn(),
    clearCompleted: vi.fn()
  })
}));

describe('TodoApp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the todo application', () => {
    render(<TodoApp />);
    
    // Check for main components
    expect(screen.getByRole('heading', { name: /todos/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /what needs to be done/i })).toBeInTheDocument();
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  it('allows adding a new todo', () => {
    render(<TodoApp />);
    
    const input = screen.getByRole('textbox', { name: /what needs to be done/i });
    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // The form should be cleared after submission
    expect(input).toHaveValue('');
  });

  it('allows toggling a todo', () => {
    render(<TodoApp />);
    
    const checkbox = screen.getByRole('checkbox', { name: /Test Todo/i });
    fireEvent.click(checkbox);
    
    // The checkbox should be checked
    expect(checkbox).toBeChecked();
  });

  it('allows deleting a todo', () => {
    render(<TodoApp />);
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    
    // The todo should be removed from the list
    expect(screen.queryByText('Test Todo')).not.toBeInTheDocument();
  });

  it('allows filtering todos', () => {
    render(<TodoApp />);
    
    // Click the Active filter
    const activeFilter = screen.getByRole('button', { name: /active/i });
    fireEvent.click(activeFilter);
    
    // The active filter should be selected
    expect(activeFilter).toHaveClass('selected');
  });

  it('allows clearing completed todos', () => {
    render(<TodoApp />);
    
    // First complete a todo
    const checkbox = screen.getByRole('checkbox', { name: /Test Todo/i });
    fireEvent.click(checkbox);
    
    // Then click clear completed
    const clearButton = screen.getByRole('button', { name: /clear completed/i });
    fireEvent.click(clearButton);
    
    // The completed todo should be removed
    expect(screen.queryByText('Test Todo')).not.toBeInTheDocument();
  });
}); 