import React, { useState } from 'react';
import { Theme } from '../types';
import { SunIcon, MoonIcon, SwatchIcon, SparklesIcon } from './icons/Icons';

interface ThemeSwitcherProps {
    currentTheme: Theme;
    onThemeChange: (theme: Theme) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = React.memo(({ currentTheme, onThemeChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const themes: { name: Theme; icon: React.ReactNode; label: string }[] = [
        { name: 'light', icon: <SunIcon className="h-5 w-5" />, label: 'Light' },
        { name: 'dark', icon: <MoonIcon className="h-5 w-5" />, label: 'Dark' },
        { name: 'amoled', icon: <SparklesIcon className="h-5 w-5" />, label: 'Amoled' },
    ];

    const handleThemeSelect = (theme: Theme) => {
        onThemeChange(theme);
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-6 right-24 z-50">
            <div className="relative flex flex-col items-center gap-2">
                {/* Theme options */}
                <div 
                    className={`transition-all duration-300 ease-in-out flex flex-col items-center gap-2 ${
                        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
                    }`}
                >
                    {themes.map((theme) => (
                        <button
                            key={theme.name}
                            onClick={() => handleThemeSelect(theme.name)}
                            className={`
                                w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-md
                                ${currentTheme === theme.name 
                                    ? 'bg-primary-500 text-white' 
                                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600'
                                }
                            `}
                            aria-label={`Switch to ${theme.label} theme`}
                        >
                            {theme.icon}
                        </button>
                    ))}
                </div>

                {/* Main toggle button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-14 h-14 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/20 hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950 transition-transform duration-300 transform hover:scale-110"
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    aria-label="Toggle theme switcher"
                >
                    <SwatchIcon className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
});