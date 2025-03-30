import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoItem } from '../TodoItem';

describe('TodoItem', () => {
  const mockTodo = {
    id: '1',
    title: 'Test Todo',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const mockOnToggle = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnUpdate = vi.fn();

  it('renders todo item correctly', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('calls onToggle when checkbox is clicked', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    fireEvent.click(screen.getByRole('checkbox'));
    expect(mockOnToggle).toHaveBeenCalledWith(mockTodo.id, true);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(mockOnDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('calls onUpdate when edit button is clicked and form is submitted', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Updated Todo' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(mockOnUpdate).toHaveBeenCalledWith(mockTodo.id, 'Updated Todo');
  });

  it('displays completed todo with correct styling', () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(
      <TodoItem
        todo={completedTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(screen.getByText('Test Todo')).toHaveClass('line-through');
  });
}); 