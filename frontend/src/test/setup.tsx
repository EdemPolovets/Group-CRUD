import React from 'react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
}));

vi.mock('@core/config/query', () => ({
  default: {
    queryClient: {
      setQueryData: vi.fn(),
      getQueryData: vi.fn(),
    },
  },
}));

vi.mock('@core/contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => ({
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

vi.mock('@core/contexts/TodosContext', () => ({
  TodosProvider: ({ children }: { children: React.ReactNode }) => children,
  useTodos: () => ({
    todos: [],
    addTodo: vi.fn(),
    toggleTodo: vi.fn(),
    deleteTodo: vi.fn(),
    setFilter: vi.fn(),
  }),
}));

vi.mock('@shared/components/Navbar', () => ({
  default: () => <div>Navbar Mock</div>,
}));