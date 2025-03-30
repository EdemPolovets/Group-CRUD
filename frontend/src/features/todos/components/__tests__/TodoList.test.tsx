import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoList } from '../TodoList';

describe('TodoList', () => {
  const mockTodos = [
    { id: '1', title: 'Active Todo 1', completed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', title: 'Active Todo 2', completed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '3', title: 'Completed Todo 1', completed: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '4', title: 'Completed Todo 2', completed: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ];

  const mockOnToggle = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all todos', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Active Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Active Todo 2')).toBeInTheDocument();
    expect(screen.getByText('Completed Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Completed Todo 2')).toBeInTheDocument();
  });

  it('displays empty state message when no todos', () => {
    render(
      <TodoList
        todos={[]}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
  });

  it('handles todo toggle correctly', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    const checkbox = screen.getByRole('checkbox', { name: /Active Todo 1/i });
    fireEvent.click(checkbox);
    expect(mockOnToggle).toHaveBeenCalledWith('1', true);
  });

  it('handles todo deletion correctly', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('handles todo update correctly', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Updated Todo' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(mockOnUpdate).toHaveBeenCalledWith('1', 'Updated Todo');
  });
}); 