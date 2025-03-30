import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoForm } from '../TodoForm';

describe('TodoForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders form elements correctly', () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByPlaceholderText(/add a new todo/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('submits form with valid input', () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);
    
    const input = screen.getByPlaceholderText(/add a new todo/i);
    const submitButton = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith('New Todo');
    expect(input).toHaveValue('');
  });

  it('does not submit form with empty input', () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows error message for empty submission', () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/todo title is required/i)).toBeInTheDocument();
  });

  it('clears error message when input is changed', () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);
    
    const input = screen.getByPlaceholderText(/add a new todo/i);
    const submitButton = screen.getByRole('button', { name: /add/i });

    // Trigger error
    fireEvent.click(submitButton);
    expect(screen.getByText(/todo title is required/i)).toBeInTheDocument();

    // Clear error
    fireEvent.change(input, { target: { value: 'New Todo' } });
    expect(screen.queryByText(/todo title is required/i)).not.toBeInTheDocument();
  });
}); 