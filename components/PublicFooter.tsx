import React from 'react';
import { Page } from '../types';
import { InstagramIcon } from './icons/Icons';

interface PublicFooterProps {
  onNavigate: (page: Page) => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
                <button onClick={() => onNavigate('landing')} className="text-2xl font-bold text-slate-900 dark:text-white tracking-tighter">Campusmart</button>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Your Campus, Your Marketplace.</p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4 text-sm">
                 <button onClick={() => onNavigate('privacy-policy')} className="text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Privacy Policy</button>
                 <button onClick={() => onNavigate('terms-of-service')} className="text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Terms of Service</button>
                 <button onClick={() => onNavigate('contact')} className="text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Contact</button>
                 <a href="https://www.instagram.com/campus.mart.offical" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors" aria-label="Campusmart on Instagram">
                    <InstagramIcon className="h-6 w-6" />
                 </a>
            </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800/50 text-center text-xs text-slate-400 dark:text-slate-500">
             <p>&copy; {new Date().getFullYear()} Campusmart. All rights reserved. A student-focused project.</p>
        </div>
      </div>
    </footer>
  );
};