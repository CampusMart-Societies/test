import React, { useState } from 'react';
import { Item, Currency } from '../types';
import { Button } from './Button';
import { XMarkIcon } from './icons/Icons';
import { formatPrice } from '../constants';

interface RentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
  currency: Currency;
  onConfirmRental: (item: Item, durationHours: number) => void;
}

export const RentalModal: React.FC<RentalModalProps> = ({ isOpen, onClose, item, currency, onConfirmRental }) => {
  const [duration, setDuration] = useState(1);

  if (!isOpen || !item) return null;

  const handleConfirm = () => {
    if (duration > 0) {
      onConfirmRental(item, duration);
    }
  };
  
  const totalPrice = item.price * duration;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Rent Item</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{item.title}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 space-y-6">
            <div>
                <label htmlFor="duration" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Rental Duration (hours)</label>
                <input 
                    type="number" 
                    id="duration" 
                    value={duration} 
                    onChange={e => setDuration(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="mt-1 block w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 shadow-sm placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    min="1"
                />
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2">
                 <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                    <span>Price per hour:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">{formatPrice(item.price, currency)}</span>
                </div>
                 <div className="flex justify-between items-center text-xl">
                    <span className="font-semibold text-slate-900 dark:text-white">Total Price:</span>
                    <span className="font-bold text-primary-500 dark:text-primary-400">{formatPrice(totalPrice, currency)}</span>
                </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="button" onClick={handleConfirm} disabled={duration <= 0}>Confirm Rental</Button>
            </div>
        </div>
      </div>
    </div>
  );
};