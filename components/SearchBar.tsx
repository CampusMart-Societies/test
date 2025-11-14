import React from 'react';
import { MagnifyingGlassIcon } from './icons/Icons';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = React.memo(({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative w-full max-w-lg">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 dark:text-slate-400" />
      </div>
      <input
        type="text"
        placeholder="Search for anything..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="block w-full pl-11 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-full leading-5 bg-white dark:bg-slate-800/50 placeholder-slate-400 dark:placeholder-slate-400 text-slate-900 dark:text-slate-100 focus:outline-none focus:placeholder-slate-500 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all"
      />
    </div>
  );
});