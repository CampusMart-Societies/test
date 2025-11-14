import React from 'react';
import { Item, Currency } from '../types';
import { ItemCard } from './ItemCard';

interface ItemListingsProps {
  items: Item[];
  onSelectItem: (item: Item) => void;
  userRatings: { [key: string]: { avg: number; count: number } };
  savedItemIds: Set<string>;
  onToggleSave: (itemId: string) => void;
  currency: Currency;
}

export const ItemListings: React.FC<ItemListingsProps> = React.memo(({ items, onSelectItem, userRatings, savedItemIds, onToggleSave, currency }) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center bg-gray-100 dark:bg-gray-800/50 [.amoled_&]:dark:bg-gray-950/50 rounded-lg p-12 h-full border-2 border-dashed border-gray-300 dark:border-gray-700 [.amoled_&]:dark:border-gray-800">
        <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-700 dark:text-gray-200">No items found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            onSelect={onSelectItem}
            sellerRating={userRatings[item.sellerId]}
            isSaved={savedItemIds.has(item.id)}
            onToggleSave={onToggleSave}
            currency={currency}
          />
      ))}
    </div>
  );
});