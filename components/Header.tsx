import React from 'react';
import { SearchBar } from './SearchBar';
import { Button } from './Button';
import { ArrowDownTrayIcon, PlusCircleIcon, ShoppingCartIcon, LogoIcon } from './icons/Icons';
import { User, Currency, Notification } from '../types';
import { ProfileDropdown } from './ProfileDropdown';
import { NotificationDropdown } from './NotificationDropdown';
import { ActiveTab } from '../types';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onListClick: () => void;
  onLogout: () => void;
  onNavigateToAccount: (tab: ActiveTab) => void;
  onNavigateToSettings: () => void;
  onNavigateHome: () => void;
  user: User | null;
  notifications: Notification[];
  onMarkNotificationRead: (id: string) => void;
  isGuestMode?: boolean;
  onNavigateToLogin?: () => void;
  onNavigateToRegister?: () => void;
  onInstallClick: () => void;
  showInstallButton: boolean;
  showSearchBar?: boolean;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  cartItemCount: number;
  onCartClick: () => void;
}

export const Header: React.FC<HeaderProps> = React.memo(({ searchTerm, setSearchTerm, onListClick, onLogout, onNavigateToAccount, onNavigateToSettings, onNavigateHome, user, notifications, onMarkNotificationRead, isGuestMode, onNavigateToLogin, onNavigateToRegister, onInstallClick, showInstallButton, showSearchBar = true, currency, onCurrencyChange, cartItemCount, onCartClick }) => {
  return (
    <header className="bg-white/80 dark:bg-slate-950/90 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800/50 sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <button onClick={onNavigateHome} className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white tracking-tighter focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md">
                <LogoIcon className="h-7 w-7 text-primary-500 dark:text-primary-400" />
                <span>Campusmart</span>
            </button>
          </div>
          <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-center">
            {showSearchBar && <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            {isGuestMode ? (
              <>
                 <Button onClick={onNavigateToLogin} variant="secondary">Login</Button>
                 <Button onClick={onNavigateToRegister}>Sign Up</Button>
              </>
            ) : user ? (
              <>
                {showInstallButton && (
                  <Button onClick={onInstallClick} variant="ghost" className="hidden sm:inline-flex !px-3">
                    <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                    <span>Install</span>
                  </Button>
                )}
                
                <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full p-1 text-sm">
                    <button onClick={() => onCurrencyChange('INR')} className={`px-3 py-1 rounded-full font-semibold transition-colors ${currency === 'INR' ? 'bg-slate-300 text-slate-800 dark:bg-slate-600 dark:text-white' : 'text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/50'}`}>₹ INR</button>
                    <button onClick={() => onCurrencyChange('USD')} className={`px-3 py-1 rounded-full font-semibold transition-colors ${currency === 'USD' ? 'bg-slate-300 text-slate-800 dark:bg-slate-600 dark:text-white' : 'text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/50'}`}>$ USD</button>
                </div>
                
                <div className="hidden md:block">
                  <Button onClick={onListClick}>Forge Item</Button>
                </div>
                
                <button
                  onClick={onListClick}
                  className="md:hidden text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950 focus:ring-primary-500 rounded-full p-1"
                  aria-label="Forge an Item"
                >
                  <PlusCircleIcon className="h-8 w-8" />
                </button>
                
                <NotificationDropdown 
                    user={user}
                    notifications={notifications}
                    onMarkAsRead={onMarkNotificationRead}
                    onNavigateToNotifications={() => onNavigateToAccount('notifications')}
                />
                 <button
                    onClick={onCartClick}
                    className="relative w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950 focus:ring-primary-500"
                    aria-label={`Shopping Cart (${cartItemCount} items)`}
                >
                    <ShoppingCartIcon className="h-6 w-6" />
                    {cartItemCount > 0 && (
                        <span className="absolute -top-1 -right-1 block h-5 w-5 text-xs rounded-full bg-red-500 text-white flex items-center justify-center ring-2 ring-white dark:ring-slate-950">
                            {cartItemCount > 9 ? '9+' : cartItemCount}
                        </span>
                    )}
                </button>
                <ProfileDropdown user={user} onLogout={onLogout} onNavigateToAccount={() => onNavigateToAccount('profile')} onNavigateToSettings={() => onNavigateToAccount('settings')} />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
});