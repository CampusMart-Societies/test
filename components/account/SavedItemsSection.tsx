import React, { useState, useMemo } from 'react';
import { Item, Currency } from '../../types';
import { ItemCard } from '../ItemCard';
import { MagnifyingGlassIcon } from '../icons/Icons';

interface SavedItemsSectionProps {
  items: Item[];
  onUnsaveItem: (itemId: string) => void;
  onSelectItem: (item: Item) => void;
  userRatings: { [key: string]: { avg: number; count: number } };
  currency: Currency;
}

export const SavedItemsSection: React.FC<SavedItemsSectionProps> = React.memo(({ items, onUnsaveItem, onSelectItem, userRatings, currency }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    const lowercasedFilter = searchTerm.toLowerCase();
    return items.filter(item => 
      item.title.toLowerCase().includes(lowercasedFilter) || 
      item.category.join(', ').toLowerCase().includes(lowercasedFilter)
    );
  }, [items, searchTerm]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">My Wishlist</h3>
        {items.length > 0 && (
            <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                    type="text"
                    placeholder="Search wishlist..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg leading-5 bg-white dark:bg-slate-800/50 placeholder-slate-400 dark:placeholder-slate-400 text-slate-900 dark:text-slate-100 focus:outline-none focus:placeholder-slate-500 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
            </div>
        )}
      </div>

      {items.length === 0 ? (
         <div className="text-center text-slate-500 dark:text-slate-400 py-16 bg-slate-100 dark:bg-slate-900/50 border-2 border-dashed border-slate-300 dark:border-slate-700/50 rounded-xl">
           <p className="font-medium">Your wishlist is empty.</p>
           <p className="text-sm mt-1">Click the bookmark icon on an item to add it to your wishlist.</p>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          {filteredItems.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              onSelect={onSelectItem}
              sellerRating={userRatings[item.sellerId]}
              isSaved={true} // Always true in this view
              onToggleSave={onUnsaveItem}
              currency={currency}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-slate-500 dark:text-slate-400 py-16">
          <p className="font-medium">No items found</p>
          <p className="text-sm mt-1">Your search for "{searchTerm}" did not match any items in your wishlist.</p>
        </div>
      )}
    </div>
  );
});