import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@core/config/query';

interface TodosProviderProps {
  children: React.ReactNode;
}

export const TodosProvider: React.FC<TodosProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}; 