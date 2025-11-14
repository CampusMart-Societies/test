import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { UserCircleIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon, SparklesIcon } from './icons/Icons';

interface ProfileDropdownProps {
  user: User;
  onLogout: () => void;
  onNavigateToAccount: () => void;
  onNavigateToSettings: () => void;
}

const getInitials = (name: string) => {
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

export const ProfileDropdown: React.FC<ProfileDropdownProps> = React.memo(({ user, onLogout, onNavigateToAccount, onNavigateToSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleAccountClick = () => {
    setIsOpen(false);
    onNavigateToAccount();
  };

  const handleSettingsClick = () => {
    setIsOpen(false);
    onNavigateToSettings();
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    onLogout();
  };
  
  const menuItems = [
    { label: 'My Account', icon: <UserCircleIcon className="h-5 w-5 mr-3 text-slate-400 dark:text-slate-500" />, action: handleAccountClick },
    { label: 'Settings', icon: <Cog6ToothIcon className="h-5 w-5 mr-3 text-slate-400 dark:text-slate-500" />, action: handleSettingsClick },
    { label: 'Logout', icon: <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3 text-slate-400 dark:text-slate-500" />, action: handleLogoutClick },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-200 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950 focus:ring-primary-500 overflow-hidden"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {user.profilePictureUrl ? (
          <img src={user.profilePictureUrl} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          getInitials(user.name)
        )}
      </button>

      {isOpen && (
        <div 
          className="origin-top-right absolute right-0 mt-2 w-60 rounded-xl shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg ring-1 ring-slate-200 dark:ring-slate-700 focus:outline-none z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-900 dark:text-slate-100 font-semibold truncate" role="none">
                    {user.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate" role="none">
                    {user.email}
                </p>
                 <p className="text-xs text-secondary-500 dark:text-secondary-400 font-semibold mt-1.5 flex items-center gap-1.5" role="none">
                    <SparklesIcon className="h-4 w-4" /> {user.martcoinBalance?.toLocaleString() || 0} Martcoins
                </p>
            </div>
            <div className="py-1">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href="#"
                  onClick={(e) => { e.preventDefault(); item.action(); }}
                  className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                  role="menuitem"
                >
                  {item.icon}
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});