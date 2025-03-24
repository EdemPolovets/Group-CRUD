import React from 'react';
import { useAuth } from '@core/hooks/useAuth';
import { AuthService } from '@core/services/auth.service';
 
export const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const username = AuthService.getUsername();
 
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="text-xl font-semibold text-gray-800">
            Todo App
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Welcome, <span className="text-amber-500 font-semibold">{username || 'User'}</span>
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};