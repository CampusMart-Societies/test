import React, { useState } from 'react';
import { ITEM_CONDITIONS } from '../constants';
import { Filters, ItemType, ItemCondition } from '../types';
import { Button } from './Button';
import { AdjustmentsHorizontalIcon, XMarkIcon } from './icons/Icons';

interface FilterSidebarProps {
  filters: Filters;
  onFilterChange: <K extends keyof Filters>(filter: K, value: Filters[K]) => void;
  maxPrice: number;
}

const FilterSection: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={className}>
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">{title}</h4>
        {children}
    </div>
);


export const FilterSidebar: React.FC<FilterSidebarProps> = React.memo(({ filters, onFilterChange, maxPrice }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleConditionChange = (condition: ItemCondition) => {
        const newConditions = filters.condition.includes(condition)
            ? filters.condition.filter(c => c !== condition)
            : [...filters.condition, condition];
        
        onFilterChange('condition', newConditions.length === 0 ? [...ITEM_CONDITIONS] : newConditions);
    };

    const handleTypeChange = (type: ItemType) => {
        const newTypes = filters.type.includes(type)
            ? filters.type.filter(t => t !== type)
            : [...filters.type, type];
        
        if (newTypes.length === 0) {
            onFilterChange('type', [ItemType.SALE, ItemType.RENT]);
        } else {
            onFilterChange('type', newTypes);
        }
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMax = parseInt(e.target.value, 10);
        onFilterChange('priceRange', { ...filters.priceRange, max: newMax });
    };

    const renderFilters = (isMobile: boolean) => (
        <div className={isMobile ? "space-y-8" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-start"}>
            <FilterSection title="Category" className={isMobile ? "" : "lg:col-span-2"}>
                 <input
                    type="text"
                    placeholder="Search any category..."
                    value={filters.category === 'All' ? '' : filters.category}
                    onChange={(e) => onFilterChange('category', e.target.value || 'All')}
                    className="block w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 shadow-sm placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
            </FilterSection>

            <FilterSection title="Condition" className={isMobile ? "" : "lg:col-span-2"}>
                 <div className="flex items-center gap-2 flex-wrap">
                    {ITEM_CONDITIONS.map(condition => {
                        const isActive = filters.condition.includes(condition);
                        return (
                            <button
                                key={condition}
                                onClick={() => handleConditionChange(condition)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 ${
                                    isActive 
                                    ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/10' 
                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                                }`}
                            >
                                {condition}
                            </button>
                        )
                    })}
                </div>
            </FilterSection>
            
            <div className={isMobile ? "space-y-8" : "lg:col-span-1 space-y-6"}>
              <FilterSection title="Max Price">
                 <div className="flex flex-col">
                    <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-slate-500 dark:text-slate-400">₹0</span>
                        <span className="font-bold text-primary-500 dark:text-primary-400">
                            ₹{filters.priceRange.max.toLocaleString()}
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max={maxPrice > 0 ? maxPrice : 5000}
                        step={Math.ceil((maxPrice > 0 ? maxPrice : 5000) / 100)}
                        value={filters.priceRange.max}
                        onChange={handlePriceChange}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary-500 [&::-webkit-slider-thumb]:rounded-full"
                        aria-label="Maximum price"
                    />
                </div>
              </FilterSection>
              <FilterSection title="Listing Type">
                <div className="bg-slate-200 dark:bg-slate-800 p-1 rounded-full flex items-center border border-slate-300 dark:border-slate-700">
                    {[ItemType.SALE, ItemType.RENT].map(type => {
                         const isActive = filters.type.includes(type);
                         return (
                            <button
                                key={type}
                                onClick={() => handleTypeChange(type)}
                                className={`capitalize px-4 py-1.5 rounded-full text-sm font-semibold flex-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 focus:ring-offset-slate-200 dark:focus:ring-offset-slate-800 ${
                                    isActive
                                    ? 'bg-slate-500 text-white shadow-sm dark:bg-slate-600'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-700/50'
                                }`}
                            >
                                {type.replace("For ", "")}
                            </button>
                         )
                    })}
                </div>
              </FilterSection>
            </div>
        </div>
    );
    
  return (
    <>
        {/* Mobile: Button to open drawer */}
        <div className="lg:hidden mb-6">
            <Button 
                onClick={() => setIsOpen(true)} 
                variant="secondary" 
                className="w-full"
                aria-controls="filter-drawer"
                aria-expanded={isOpen}
            >
                <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
                Filters
            </Button>
        </div>

        {/* Desktop: Static filters */}
        <div className="hidden lg:block bg-white dark:bg-slate-900/50 backdrop-blur-lg p-6 rounded-xl border border-slate-200 dark:border-slate-800/50 mb-8">
            {renderFilters(false)}
        </div>

        {/* Mobile: Slide-out Drawer */}
        <div 
            className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            role="dialog"
            aria-modal="true"
            aria-hidden={!isOpen}
            aria-labelledby="filter-drawer-title"
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} tabIndex={-1}></div>
            
            {/* Drawer Content */}
            <div 
                id="filter-drawer"
                className={`absolute right-0 top-0 h-full bg-white dark:bg-slate-900 w-full max-w-sm flex flex-col border-l border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center flex-shrink-0">
                    <h3 id="filter-drawer-title" className="text-xl font-bold text-slate-900 dark:text-white">Filters</h3>
                    <button onClick={() => setIsOpen(false)} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200" aria-label="Close filters">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="flex-1 p-6 overflow-y-auto">
                    {renderFilters(true)}
                </div>
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex-shrink-0 bg-white dark:bg-slate-900">
                    <Button onClick={() => setIsOpen(false)} className="w-full">
                        View Results
                    </Button>
                </div>
            </div>
        </div>
    </>
  );
});
