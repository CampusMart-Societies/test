import React, { useState } from 'react';
import { ChatBubbleBottomCenterTextIcon } from './icons/Icons';

interface ChatBubbleProps {
  onClick: () => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex items-center group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`
          transition-all duration-300 ease-in-out bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg mr-3
          ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}
        `}
      >
        Need help? Ask MartBot!
      </div>
      <button
        onClick={onClick}
        className="w-14 h-14 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/20 hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950 transition-transform duration-300 transform hover:scale-110 group-hover:scale-110"
        aria-label="Open MartBot Assistant"
      >
        <ChatBubbleBottomCenterTextIcon className="h-7 w-7" />
      </button>
    </div>
  );
};