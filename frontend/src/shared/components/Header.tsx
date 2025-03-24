import React from 'react';
import { useAuth } from '@core/hooks/useAuth';
 
export const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
 
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Todo App</h1>
        {isAuthenticated && (
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
};