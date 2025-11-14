import React from 'react';
import { Item, ItemType, Currency } from '../types';
import { StarRating } from './StarRating';
import { BookmarkIcon } from './icons/Icons';
import { formatPrice } from '../constants';

interface ItemCardProps {
  item: Item;
  onSelect: (item: Item) => void;
  sellerRating?: { avg: number; count: number };
  isSaved: boolean;
  onToggleSave: (itemId: string) => void;
  currency: Currency;
}

const TypeBadge: React.FC<{ type: ItemType }> = ({ type }) => {
  const isSale = type === ItemType.SALE;
  const styleClasses = isSale 
    ? 'bg-green-500/10 text-green-500 dark:text-green-400 border border-green-500/20' 
    : 'bg-sky-500/10 text-sky-500 dark:text-sky-400 border border-sky-500/20';
  return (
    <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${styleClasses}`}>
      {type.replace('For ', '')}
    </span>
  );
};


export const ItemCard: React.FC<ItemCardProps> = React.memo(({ item, onSelect, sellerRating, isSaved, onToggleSave, currency }) => {
  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening
    onToggleSave(item.id);
  };
  
  const isSold = item.status === 'sold';

  return (
    <div 
      className={`relative bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden transition-all duration-300 group flex flex-col ${isSold ? 'cursor-default' : 'cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-500/10 dark:hover:shadow-primary-500/20 hover:border-primary-500/20 dark:hover:border-primary-500/50'}`}
      onClick={() => onSelect(item)}
    >
      <div className={`relative w-full overflow-hidden ${isSold ? 'grayscale' : ''}`}>
        <img 
          src={item.imageUrl} 
          alt={item.title}
          loading="lazy" 
          className={`w-full h-auto object-cover transition-transform duration-500 ease-in-out ${isSold ? '' : 'group-hover:scale-105'}`}
        />
        <TypeBadge type={item.type} />
        <button
          onClick={handleSaveClick}
          disabled={isSold}
          className={`absolute top-3 left-3 p-2 rounded-full transition-all duration-200 backdrop-blur-sm disabled:cursor-not-allowed ${
            isSaved 
              ? 'bg-primary-500/40 hover:bg-primary-500/60' 
              : 'bg-black/20 hover:bg-black/40'
          }`}
          aria-label={isSaved ? 'Unsave item' : 'Save item'}
        >
          <BookmarkIcon className={`h-5 w-5 ${isSaved ? 'text-primary-300' : 'text-white'}`} filled={isSaved} />
        </button>
        {isSold && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="border-2 border-white text-white text-lg font-bold px-6 py-2 rounded-lg transform -rotate-12 uppercase tracking-widest">
                    Sold
                </span>
            </div>
        )}
      </div>
      <div className={`p-5 flex flex-col flex-grow ${isSold ? 'opacity-60' : ''}`}>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 truncate">{item.category.join(', ')}</p>
        <h3 className={`text-lg font-bold text-slate-900 dark:text-white transition-colors ${isSold ? '' : 'group-hover:text-primary-500 dark:group-hover:text-primary-400'}`}>{item.title}</h3>
        
        <div className="flex-grow" />

        <div className="mt-4 flex items-baseline gap-2">
            <p className="text-2xl font-extrabold text-primary-500 dark:text-primary-400">
                {formatPrice(item.price, currency)}
            </p>
            {item.type === ItemType.RENT && <span className="text-sm font-normal text-slate-500 dark:text-slate-400">/hr</span>}
            {item.isNegotiable && (
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                    Negotiable
                </span>
            )}
        </div>
        
        <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
          <p className="text-sm text-slate-700 dark:text-slate-300 truncate">
            <span className="text-slate-500 dark:text-slate-400">by </span> 
            {item.seller}
          </p>
          {sellerRating && sellerRating.count > 0 ? (
            <div className="flex items-center gap-1 mt-1">
              <StarRating rating={sellerRating.avg} size="h-4 w-4" />
              <span className="text-xs text-slate-400 dark:text-slate-500">({sellerRating.count})</span>
            </div>
          ) : (
             <div className="h-5 mt-1 text-xs text-slate-400 dark:text-slate-500">No reviews yet</div>
          )}
        </div>
      </div>
    </div>
  );
});