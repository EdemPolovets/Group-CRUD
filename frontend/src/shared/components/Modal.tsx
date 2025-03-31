import React from 'react';
 
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}
 
export const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  if (!isOpen) return null;
 
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-sm w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
        {title && (
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};