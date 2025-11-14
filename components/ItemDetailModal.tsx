import React from 'react';
import { Item, ItemType, User, Currency } from '../types';
import { Button } from './Button';
import { XMarkIcon, TagIcon, BookmarkIcon, ShieldCheckIcon } from './icons/Icons';
import { StarRating } from './StarRating';
import { formatPrice } from '../constants';

interface ItemDetailModalProps {
  item: Item | null;
  onClose: () => void;
  currentUser: User | null;
  isGuestMode?: boolean;
  onLoginRequired: () => void;
  onLeaveReview: (item: Item) => void;
  sellerRating?: { avg: number; count: number };
  isSaved: boolean;
  onToggleSave: (itemId: string) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  onAddToCart: (itemId: string) => void;
  onRemoveFromCart: (itemId: string) => void;
  cartItemIds: string[];
  onInitiateRental: (item: Item) => void;
  currency: Currency;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = React.memo(({ item, onClose, currentUser, isGuestMode, onLoginRequired, onLeaveReview, sellerRating, isSaved, onToggleSave, showToast, onAddToCart, onRemoveFromCart, cartItemIds, onInitiateRental, currency }) => {

  if (!item) return null;

  const isMyItem = !isGuestMode && currentUser?.id === item.sellerId;
  const hasPurchased = !isGuestMode && !!currentUser?.purchasedItemIds?.includes(item.id);
  const isInCart = cartItemIds.includes(item.id);

  const handleCartAction = () => {
    if (isGuestMode || !currentUser) {
        onLoginRequired();
        return;
    }
    if (isInCart) {
        onRemoveFromCart(item.id);
    } else {
        onAddToCart(item.id);
    }
  };
  
  const handleRentNow = () => {
    if (isGuestMode) {
      onLoginRequired();
      return;
    }
    onInitiateRental(item);
    onClose();
  };
  
  const handleReviewClick = () => {
    if (isGuestMode) {
        onLoginRequired();
        return;
    }
    if (!hasPurchased) {
        showToast("You can only review items you've purchased.");
        return;
    }
    onLeaveReview(item);
  }

  return (
    <>
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row border border-slate-200 dark:border-slate-800 animate-slide-up" onClick={e => e.stopPropagation()}>
          <div className="w-full md:w-1/2 relative bg-slate-100 dark:bg-slate-950">
              <img src={item.imageUrl} alt={item.title} className="w-full h-72 md:h-full object-cover" />
              <button onClick={onClose} className="absolute top-4 right-4 text-white bg-black/30 hover:bg-black/50 p-2 rounded-full transition-colors md:hidden">
                  <XMarkIcon className="h-6 w-6" />
              </button>
          </div>
          <div className="w-full md:w-1/2 p-8 relative flex flex-col overflow-y-auto">
              <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 transition-colors hidden md:block">
                  <XMarkIcon className="h-7 w-7" />
              </button>
              <div className="flex-grow">
                <span className={`text-sm font-bold tracking-wider uppercase ${item.type === ItemType.SALE ? 'text-green-500 dark:text-green-400' : 'text-sky-500 dark:text-sky-400'}`}>
                    {item.type}
                </span>
                <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">{item.title}</h2>
                <div className="flex items-center flex-wrap text-slate-500 dark:text-slate-400 text-sm mt-3 gap-x-4 gap-y-2">
                    <div className="flex items-center">
                      <TagIcon className="h-4 w-4 mr-1.5" />
                      <span>{item.category.join(', ')}</span>
                    </div>
                     <div className="flex items-center">
                      <ShieldCheckIcon className="h-4 w-4 mr-1.5" />
                      <span>{item.condition}</span>
                    </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 my-6 text-base">{item.description}</p>
              </div>
              
              <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                   <div className="text-sm text-slate-500 dark:text-slate-400">
                      <span>Posted by </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{item.seller}</span>
                      {sellerRating && sellerRating.count > 0 && (
                          <div className="flex items-center gap-1.5 mt-1">
                              <StarRating rating={sellerRating.avg} size="h-4 w-4" />
                              <span className="text-xs">({sellerRating.avg.toFixed(1)} from {sellerRating.count} reviews)</span>
                          </div>
                      )}
                   </div>
                   <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">on {new Date(item.postedDate).toLocaleDateString()}</p>
                  <div className="flex justify-between items-center mt-6">
                      <div className="flex items-baseline gap-3">
                          <p className="text-4xl font-extrabold text-primary-500 dark:text-primary-400">
                              {formatPrice(item.price, currency)}
                          </p>
                           {item.type === ItemType.RENT && <span className="text-lg font-normal text-slate-500 dark:text-slate-400">/hr</span>}
                      </div>
                       {item.isNegotiable && (
                          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                              Negotiable
                          </span>
                      )}
                  </div>
                  <div className="mt-6 flex items-center gap-2">
                      {isMyItem ? (
                          <Button disabled className="w-full">This is your listing</Button>
                      ) : (
                          <>
                              <Button variant="ghost" onClick={() => onToggleSave(item.id)} className="!p-3">
                                  <BookmarkIcon className={`h-6 w-6 ${isSaved ? 'text-primary-500 dark:text-primary-400' : 'text-slate-400'}`} filled={isSaved}/>
                              </Button>
                              <Button variant="secondary" onClick={handleReviewClick} disabled={!hasPurchased} title={!hasPurchased ? "You must purchase this item to leave a review" : ""}>Leave a Review</Button>
                              
                              {item.status === 'available' ? (
                                  item.type === ItemType.SALE ? (
                                      <Button onClick={handleCartAction} className="flex-1">
                                          {isInCart ? 'Remove from Cart' : 'Add to Cart'}
                                      </Button>
                                  ) : (
                                      <Button onClick={handleRentNow} className="flex-1">Rent Now</Button>
                                  )
                              ) : (
                                  <Button disabled className="flex-1">Item Sold</Button>
                              )}
                          </>
                      )}
                  </div>
              </div>
          </div>
        </div>
      </div>
    </>
  );
});