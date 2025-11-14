import React from 'react';
import { Button } from '../Button';
import { Theme } from '../../types';

interface SettingsSectionProps {
    currentTheme: Theme;
    onThemeChange: (theme: Theme) => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = React.memo(({ currentTheme, onThemeChange }) => {

    const SettingRow: React.FC<{ title: string; description: string; children: React.ReactNode }> = React.memo(({ title, description, children }) => (
        <div className="py-5 sm:flex sm:items-center sm:justify-between">
            <div>
                <h4 className="text-md font-semibold text-slate-800 dark:text-slate-100">{title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
            </div>
            <div className="mt-3 sm:mt-0">{children}</div>
        </div>
    ));

    const themes: { name: Theme, label: string }[] = [
        { name: 'light', label: 'Light' },
        { name: 'dark', label: 'Dark' },
        { name: 'amoled', label: 'Amoled' },
    ];
    
    return (
        <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Settings</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Manage your application and account settings.</p>

            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                <SettingRow title="Theme" description="Choose your preferred visual theme.">
                    <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800/50 p-1 space-x-1 w-full sm:w-auto border border-slate-200 dark:border-slate-700">
                        {themes.map(themeOption => (
                            <button
                                key={themeOption.name}
                                onClick={() => onThemeChange(themeOption.name)}
                                className={`w-full capitalize px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
                                    currentTheme === themeOption.name
                                        ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/50'
                                }`}
                            >
                                {themeOption.label}
                            </button>
                        ))}
                    </div>
                </SettingRow>

                <SettingRow title="Language" description="Select your preferred language.">
                     <select disabled className="mt-1 block w-full pl-3 pr-10 py-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:opacity-50 cursor-not-allowed">
                        <option>English</option>
                        <option>Spanish</option>
                    </select>
                </SettingRow>

                <SettingRow title="Data & Privacy" description="Manage your personal data.">
                    <Button variant='secondary' disabled>Manage Data</Button>
                </SettingRow>
            </div>
        </div>
    );
});