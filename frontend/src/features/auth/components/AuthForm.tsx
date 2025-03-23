import React, { useState } from 'react';
 
interface AuthFormProps {
  onSubmit: (email: string, password: string, username?: string) => Promise<void>;
  isSignUp?: boolean;
}
 
type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
};
 
interface InputConfig {
  id: keyof FormData;
  label: string;
  type: string;
  placeholder: string;
}
 
export const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, isSignUp = false }) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });
  const [isLoading, setIsLoading] = useState(false);
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp && formData.password !== formData.confirmPassword) return;
   
    setIsLoading(true);
    try {
      await onSubmit(formData.email, formData.password, isSignUp ? formData.username : undefined);
    } finally {
      setIsLoading(false);
    }
  };
 
  const inputs: InputConfig[] = [
    ...(isSignUp ? [{
      id: 'username' as const,
      label: 'Username',
      type: 'text',
      placeholder: 'Choose a username',
    }] : []),
    {
      id: 'email' as const,
      label: 'Email',
      type: 'email',
      placeholder: 'Enter your email',
    },
    {
      id: 'password' as const,
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
    },
    ...(isSignUp ? [{
      id: 'confirmPassword' as const,
      label: 'Confirm Password',
      type: 'password',
      placeholder: 'Confirm your password',
    }] : []),
  ];
 
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {inputs.map(({ id, label, type, placeholder }) => (
        <div key={id} className="space-y-1">
          <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            value={formData[id]}
            onChange={e => setFormData(prev => ({ ...prev, [id]: e.target.value }))}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      ))}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
      </button>
    </form>
  );
};