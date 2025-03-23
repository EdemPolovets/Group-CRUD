import React, { useState } from 'react';
import { AuthForm } from './AuthForm';
 
interface AuthSwitcherProps {
  onSubmit: (email: string, password: string, isSignUp: boolean, username?: string) => Promise<void>;
}
 
export const AuthSwitcher: React.FC<AuthSwitcherProps> = ({ onSubmit }) => {
  const [isSignUp, setIsSignUp] = useState(false);
 
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {isSignUp ? 'Please fill in your details to create an account' : 'Please sign in to your account'}
        </p>
      </div>
 
      <AuthForm
        onSubmit={(email, password, username) => onSubmit(email, password, isSignUp, username)}
        isSignUp={isSignUp}
      />
 
      <button
        type="button"
        onClick={() => setIsSignUp(!isSignUp)}
        className="mt-6 w-full text-sm text-blue-600 hover:text-blue-800"
      >
        {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
      </button>
    </div>
  );
};