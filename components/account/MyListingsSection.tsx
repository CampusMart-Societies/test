import React from 'react';
import { Item, ItemType, Currency } from '../../types';
import { Button } from '../Button';
import { PencilIcon, TrashIcon } from '../icons/Icons';
import { formatPrice } from '../../constants';

interface MyListingsSectionProps {
    items: Item[];
    onEditItem: (item: Item) => void;
    onDeleteItem: (item: Item) => void;
    currency: Currency;
}

const ListingItem: React.FC<{item: Item; onEdit: (item: Item) => void; onDelete: (item: Item) => void; currency: Currency;}> = React.memo(({ item, onEdit, onDelete, currency }) => (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700/50">
        <img src={item.imageUrl} alt={item.title} className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
        <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{item.category.join(', ')}</p>
            <h4 className="font-semibold text-slate-800 dark:text-slate-100 truncate">{item.title}</h4>
             <div className="flex items-center gap-4 mt-2">
                <p className="text-lg font-bold text-primary-500 dark:text-primary-400">{formatPrice(item.price, currency)}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.type === ItemType.SALE ? 'bg-green-500/10 text-green-500 dark:text-green-400' : 'bg-sky-500/10 text-sky-500 dark:text-sky-400'}`}>
                    {item.type}
                </span>
            </div>
        </div>
        <div className="flex-shrink-0 flex items-center gap-1">
            <Button variant="ghost" onClick={() => onEdit(item)} className="!p-2.5" aria-label={`Edit ${item.title}`}>
                <PencilIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" onClick={() => onDelete(item)} className="!p-2.5 text-red-500/70 hover:bg-red-500/10 hover:text-red-500" aria-label={`Delete ${item.title}`}>
                <TrashIcon className="h-5 w-5" />
            </Button>
        </div>
    </div>
));


export const MyListingsSection: React.FC<MyListingsSectionProps> = React.memo(({ items, onEditItem, onDeleteItem, currency }) => {
    return (
        <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">My Forgings</h3>
            {items.length > 0 ? (
                <div className="space-y-4">
                    {items.map(item => <ListingItem key={item.id} item={item} onEdit={onEditItem} onDelete={onDeleteItem} currency={currency} />)}
                </div>
            ) : (
                <div className="text-center text-slate-500 dark:text-slate-400 py-16 bg-slate-100 dark:bg-slate-900/50 border-2 border-dashed border-slate-300 dark:border-slate-700/50 rounded-xl">
                    <p className="font-medium">You haven't forged any items yet.</p>
                    <p className="text-sm mt-1">Click "Forge an Item" to get started!</p>
                </div>
            )}
        </div>
    );
});