import React from 'react';
 
interface ErrorMessageProps {
  message: string;
}
 
export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg text-center">
    {message}
  </div>
);