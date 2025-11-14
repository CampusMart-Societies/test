import React, { useEffect, useState } from 'react';
import { XMarkIcon } from './icons/Icons';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
  type?: 'error' | 'success';
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3000, type = 'error' }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const handleClose = () => {
    setVisible(false);
    // Allow time for fade-out animation before calling onClose
    setTimeout(onClose, 300); 
  };
  
  const baseClasses = "fixed bottom-5 right-5 text-white py-3 px-5 rounded-lg shadow-lg flex items-center justify-between z-[100] border transition-all duration-300 transform backdrop-blur-sm";
  
  const typeClasses = {
    error: 'bg-red-600/50 border-red-500/50',
    success: 'bg-primary-600/50 border-primary-500/50'
  };

  const visibilityClasses = visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2';

  return (
    <div 
      className={`${baseClasses} ${typeClasses[type]} ${visibilityClasses}`}
      role="alert"
      aria-live="assertive"
    >
      <span>{message}</span>
      <button onClick={handleClose} className="ml-4 -mr-1 p-1 rounded-full hover:bg-white/20 transition-colors">
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};