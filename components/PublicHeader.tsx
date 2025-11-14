import React, { useState } from 'react';
import { Button } from './Button';
import { Bars3Icon, XMarkIcon, LogoIcon } from './icons/Icons';
import { Page, ActiveTab } from '../types';

interface PublicHeaderProps {
  onNavigate: (page: Page) => void;
  onGetStarted: () => void;
  currentPage: Page;
  isLoggedIn: boolean;
  onNavigateToAccount?: (tab: ActiveTab) => void;
}

const navLinks: { page: Page, label: string }[] = [
    { page: 'landing', label: 'Home' },
    { page: 'features', label: 'Features' },
    { page: 'how-it-works', label: 'How It Works' },
    { page: 'testimonials', label: 'Testimonials' },
    { page: 'pricing', label: 'Pricing' },
    { page: 'contact', label: 'Contact Us' }
];

export const PublicHeader: React.FC<PublicHeaderProps> = ({ onNavigate, onGetStarted, currentPage, isLoggedIn, onNavigateToAccount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (page: Page) => {
    onNavigate(page);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/50 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex justify-between items-center">
          <button onClick={() => handleNavigation('landing')} className="flex items-center gap-2">
            <LogoIcon className="h-7 w-7 text-primary-500 dark:text-primary-400" />
            <span className="text-2xl font-bold tracking-tighter text-slate-900 dark:text-white">Campusmart</span>
          </button>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <button key={link.page} onClick={() => handleNavigation(link.page)} className={`text-sm font-semibold transition-colors ${currentPage === link.page ? 'text-primary-500 dark:text-primary-400' : 'text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400'}`}>
                {link.label}
              </button>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
                <>
                    {onNavigateToAccount && <Button onClick={() => onNavigateToAccount('settings')} variant="secondary">Settings</Button>}
                    <Button onClick={onGetStarted} variant="primary">Go to Dashboard</Button>
                </>
            ) : (
                <Button onClick={onGetStarted} variant="primary">Launch App</Button>
            )}
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Open menu">
              {isMenuOpen ? <XMarkIcon className="h-6 w-6 text-slate-800 dark:text-slate-200" /> : <Bars3Icon className="h-6 w-6 text-slate-800 dark:text-slate-200" />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 p-4 border-y border-slate-200 dark:border-slate-800">
            <nav className="flex flex-col gap-4">
              {navLinks.map(link => (
                <button key={link.page} onClick={() => handleNavigation(link.page)} className={`text-base font-semibold text-left transition-colors ${currentPage === link.page ? 'text-primary-500 dark:text-primary-400' : 'text-slate-800 dark:text-slate-200 hover:text-primary-500 dark:hover:text-primary-400'}`}>
                  {link.label}
                </button>
              ))}
              {isLoggedIn ? (
                <div className="flex flex-col gap-2 mt-2">
                    <Button onClick={() => {onGetStarted(); setIsMenuOpen(false);}} variant="primary" className="w-full">Go to Dashboard</Button>
                    {onNavigateToAccount && <Button onClick={() => { onNavigateToAccount('settings'); setIsMenuOpen(false); }} variant="secondary" className="w-full">Settings</Button>}
                </div>
              ) : (
                <Button onClick={onGetStarted} variant="primary" className="w-full mt-2">Launch App</Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};