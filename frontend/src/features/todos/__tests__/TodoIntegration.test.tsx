import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TodoApp } from '../components/TodoApp';
import { TodosProvider } from '@core/contexts/TodosContext';

// Mock the API calls
vi.mock('@core/api', () => ({
  getTodos: vi.fn().mockResolvedValue([]),
  createTodo: vi.fn().mockImplementation((todo) => Promise.resolve({ ...todo, id: '1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })),
  updateTodo: vi.fn().mockImplementation((todo) => Promise.resolve(todo)),
  deleteTodo: vi.fn().mockResolvedValue(true),
  toggleTodo: vi.fn().mockImplementation((todo) => Promise.resolve({ ...todo, completed: !todo.completed })),
}));

describe('Todo Application Integration', {
  timeout: 10000
}, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('completes the full todo lifecycle', async () => {
    render(
      <TodosProvider>
        <TodoApp />
      </TodosProvider>
    );

    // 1. Add a new todo
    const input = screen.getByRole('textbox', { name: /what needs to be done/i });
    fireEvent.change(input, { target: { value: 'New Integration Test Todo' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Wait for the todo to appear
    await waitFor(() => {
      expect(screen.getByText('New Integration Test Todo')).toBeInTheDocument();
    });

    // 2. Toggle the todo
    const checkbox = screen.getByRole('checkbox', { name: /New Integration Test Todo/i });
    fireEvent.click(checkbox);

    // Wait for the todo to be marked as completed
    await waitFor(() => {
      expect(checkbox).toBeChecked();
    });

    // 3. Edit the todo
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    const editInput = screen.getByRole('textbox');
    fireEvent.change(editInput, { target: { value: 'Updated Integration Test Todo' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // Wait for the todo to be updated
    await waitFor(() => {
      expect(screen.getByText('Updated Integration Test Todo')).toBeInTheDocument();
    });

    // 4. Filter todos
    const activeFilter = screen.getByRole('button', { name: /active/i });
    fireEvent.click(activeFilter);

    // Wait for the todo to be filtered out (since it's completed)
    await waitFor(() => {
      expect(screen.queryByText('Updated Integration Test Todo')).not.toBeInTheDocument();
    });

    // 5. Show completed todos
    const completedFilter = screen.getByRole('button', { name: /completed/i });
    fireEvent.click(completedFilter);

    // Wait for the todo to appear in completed filter
    await waitFor(() => {
      expect(screen.getByText('Updated Integration Test Todo')).toBeInTheDocument();
    });

    // 6. Delete the todo
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    // Wait for the todo to be removed
    await waitFor(() => {
      expect(screen.queryByText('Updated Integration Test Todo')).not.toBeInTheDocument();
    });
  });

  it('handles multiple todos with filtering and clearing', async () => {
    render(
      <TodosProvider>
        <TodoApp />
      </TodosProvider>
    );

    // Add multiple todos
    const input = screen.getByRole('textbox', { name: /what needs to be done/i });
    
    // Add first todo
    fireEvent.change(input, { target: { value: 'Active Todo 1' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    // Add second todo
    fireEvent.change(input, { target: { value: 'Active Todo 2' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    // Add third todo
    fireEvent.change(input, { target: { value: 'Active Todo 3' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Wait for all todos to appear
    await waitFor(() => {
      expect(screen.getByText('Active Todo 1')).toBeInTheDocument();
      expect(screen.getByText('Active Todo 2')).toBeInTheDocument();
      expect(screen.getByText('Active Todo 3')).toBeInTheDocument();
    });

    // Complete two todos
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);

    // Wait for todos to be marked as completed
    await waitFor(() => {
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).toBeChecked();
    });

    // Filter to show only active todos
    const activeFilter = screen.getByRole('button', { name: /active/i });
    fireEvent.click(activeFilter);

    // Wait for only one todo to be visible
    await waitFor(() => {
      expect(screen.getByText('Active Todo 3')).toBeInTheDocument();
      expect(screen.queryByText('Active Todo 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Active Todo 2')).not.toBeInTheDocument();
    });

    // Clear completed todos
    const clearButton = screen.getByRole('button', { name: /clear completed/i });
    fireEvent.click(clearButton);

    // Wait for completed todos to be removed
    await waitFor(() => {
      expect(screen.queryByText('Active Todo 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Active Todo 2')).not.toBeInTheDocument();
      expect(screen.getByText('Active Todo 3')).toBeInTheDocument();
    });
  });

  it('handles error states and loading states', async () => {
    // Mock API error
    vi.mock('@core/api', () => ({
      getTodos: vi.fn().mockRejectedValue(new Error('Failed to fetch todos')),
      createTodo: vi.fn().mockRejectedValue(new Error('Failed to create todo')),
      updateTodo: vi.fn().mockRejectedValue(new Error('Failed to update todo')),
      deleteTodo: vi.fn().mockRejectedValue(new Error('Failed to delete todo')),
      toggleTodo: vi.fn().mockRejectedValue(new Error('Failed to toggle todo')),
    }));

    render(
      <TodosProvider>
        <TodoApp />
      </TodosProvider>
    );

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });

    // Try to add a todo
    const input = screen.getByRole('textbox', { name: /what needs to be done/i });
    fireEvent.change(input, { target: { value: 'Error Test Todo' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/failed to create todo/i)).toBeInTheDocument();
    });
  });
}); 