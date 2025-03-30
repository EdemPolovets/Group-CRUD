import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoFilter } from '../TodoFilter';

describe('TodoFilter', () => {
  const mockOnFilterChange = vi.fn();
  const mockOnClearCompleted = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all filter buttons', () => {
    render(
      <TodoFilter
        currentFilter="all"
        onFilterChange={mockOnFilterChange}
        onClearCompleted={mockOnClearCompleted}
        completedCount={2}
      />
    );

    expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /active/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /completed/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear completed/i })).toBeInTheDocument();
  });

  it('calls onFilterChange when filter buttons are clicked', () => {
    render(
      <TodoFilter
        currentFilter="all"
        onFilterChange={mockOnFilterChange}
        onClearCompleted={mockOnClearCompleted}
        completedCount={2}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /active/i }));
    expect(mockOnFilterChange).toHaveBeenCalledWith('active');

    fireEvent.click(screen.getByRole('button', { name: /completed/i }));
    expect(mockOnFilterChange).toHaveBeenCalledWith('completed');

    fireEvent.click(screen.getByRole('button', { name: /all/i }));
    expect(mockOnFilterChange).toHaveBeenCalledWith('all');
  });

  it('calls onClearCompleted when clear completed button is clicked', () => {
    render(
      <TodoFilter
        currentFilter="all"
        onFilterChange={mockOnFilterChange}
        onClearCompleted={mockOnClearCompleted}
        completedCount={2}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /clear completed/i }));
    expect(mockOnClearCompleted).toHaveBeenCalled();
  });

  it('applies correct active styles to the current filter button', () => {
    render(
      <TodoFilter
        currentFilter="active"
        onFilterChange={mockOnFilterChange}
        onClearCompleted={mockOnClearCompleted}
        completedCount={2}
      />
    );

    const activeButton = screen.getByRole('button', { name: /active/i });
    expect(activeButton).toHaveClass('bg-green-600');
    expect(activeButton).toHaveClass('text-white');

    const allButton = screen.getByRole('button', { name: /all/i });
    expect(allButton).toHaveClass('bg-blue-400');
    expect(allButton).toHaveClass('text-white');

    const completedButton = screen.getByRole('button', { name: /completed/i });
    expect(completedButton).toHaveClass('bg-purple-400');
    expect(completedButton).toHaveClass('text-white');
  });

  it('maintains correct button styles when switching filters', () => {
    const { rerender } = render(
      <TodoFilter
        currentFilter="all"
        onFilterChange={mockOnFilterChange}
        onClearCompleted={mockOnClearCompleted}
        completedCount={2}
      />
    );

    // Check initial state
    expect(screen.getByRole('button', { name: /all/i })).toHaveClass('bg-blue-600');
    expect(screen.getByRole('button', { name: /active/i })).toHaveClass('bg-green-400');
    expect(screen.getByRole('button', { name: /completed/i })).toHaveClass('bg-purple-400');

    // Switch to active filter
    rerender(
      <TodoFilter
        currentFilter="active"
        onFilterChange={mockOnFilterChange}
        onClearCompleted={mockOnClearCompleted}
        completedCount={2}
      />
    );

    // Check updated state
    expect(screen.getByRole('button', { name: /all/i })).toHaveClass('bg-blue-400');
    expect(screen.getByRole('button', { name: /active/i })).toHaveClass('bg-green-600');
    expect(screen.getByRole('button', { name: /completed/i })).toHaveClass('bg-purple-400');
  });
}); 