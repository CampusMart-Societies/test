import React from 'react';
import { Item, Currency } from '../types';
import { Button } from './Button';
import { XMarkIcon, ShoppingCartIcon } from './icons/Icons';
import { formatPrice } from '../constants';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Item[];
  onRemoveFromCart: (itemId: string) => void;
  onCheckout: () => void;
  currency: Currency;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, cartItems, onRemoveFromCart, onCheckout, currency }) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-end animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full flex flex-col border-l border-slate-200 dark:border-slate-800 animate-slide-up" onClick={e => e.stopPropagation()}>
        <header className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center flex-shrink-0">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <ShoppingCartIcon className="h-7 w-7" />
            Your Cart
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </header>

        {cartItems.length > 0 ? (
          <>
            <main className="flex-1 p-6 overflow-y-auto">
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {cartItems.map(item => (
                  <div key={item.id} className="py-4 flex items-center gap-4">
                    <img src={item.imageUrl} alt={item.title} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{item.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">by {item.seller}</p>
                      <p className="text-md font-bold text-primary-500 dark:text-primary-400 mt-1">{formatPrice(item.price, currency)}</p>
                    </div>
                    <button onClick={() => onRemoveFromCart(item.id)} className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors p-1" aria-label={`Remove ${item.title} from cart`}>
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </main>

            <footer className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex-shrink-0 space-y-4">
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold text-slate-600 dark:text-slate-300">Subtotal:</span>
                <span className="font-bold text-slate-900 dark:text-white text-xl">{formatPrice(subtotal, currency)}</span>
              </div>
              <Button onClick={onCheckout} className="w-full !py-3.5 text-base">
                Proceed to Checkout
              </Button>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <ShoppingCartIcon className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Your cart is empty</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Add items from the marketplace to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};