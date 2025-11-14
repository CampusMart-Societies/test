import React, { useState, useMemo, useCallback } from 'react';
import { User, Item, Review, Currency, Theme, ActiveTab } from '../types';
import { Header } from './Header';
import { Button } from './Button';
import { ItemCard } from './ItemCard';
import { ItemDetailModal } from './ItemDetailModal';
import { ListItemModal } from './ListItemModal';
import { ReviewModal } from './ReviewModal';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ListBulletIcon, BookmarkIcon, ChatBubbleLeftEllipsisIcon, PlusCircleIcon, MagnifyingGlassIcon, CodeBracketIcon, LightBulbIcon, Cog6ToothIcon, CubeIcon, CubeTransparentIcon, MusicalNoteIcon, PaintBrushIcon, SwatchIcon } from './icons/Icons';
import { CATEGORIES } from '../constants';
import { StarRating } from './StarRating';

interface HomePageProps {
  user: User;
  users: User[];
  items: Item[];
  onLogout: () => void;
  onAddItem: (item: Omit<Item, 'id' | 'postedDate' | 'seller' | 'sellerId'>) => void;
  onAddReview: (reviewData: Omit<Review, 'id' | 'postedDate' | 'reviewerId' | 'reviewerName' | 'reviewerProfilePictureUrl'> & { revieweeId: string }) => void;
  onToggleSaveItem: (itemId: string) => void;
  onAddToCart: (itemId: string) => void;
  onRemoveFromCart: (itemId: string) => void;
  cartItemIds: string[];
  onOpenCart: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  onNavigateToAccount: (tab: ActiveTab) => void;
  onNavigateToMarketplace: () => void;
  onNavigateToHome: () => void;
  onInstallClick: () => void;
  showInstallButton: boolean;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onInitiateRental: (item: Item) => void;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

const CATEGORY_ICONS: { [key: string]: React.FC<{className?: string}> } = {
    'Digital Art': PaintBrushIcon,
    'VR/AR Assets': CubeTransparentIcon,
    'UI Kits': SwatchIcon,
    'Code Scripts': CodeBracketIcon,
    '3D Models': CubeIcon,
    'Synthwave Tracks': MusicalNoteIcon,
};

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};


const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; onClick?: () => void }> = ({ icon, title, value, onClick }) => (
    <div
        className={`bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex flex-col justify-between transition-all duration-300 ${onClick ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-primary-500/50 hover:-translate-y-1' : ''}`}
        onClick={onClick}
    >
        <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">{title}</h3>
            <div className="text-slate-400 dark:text-slate-500">{icon}</div>
        </div>
        <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">{value}</p>
    </div>
);


export const HomePage: React.FC<HomePageProps> = (props) => {
    const { user, users, items, onLogout, onAddItem, onAddReview, onToggleSaveItem, onAddToCart, onRemoveFromCart, cartItemIds, onOpenCart, showToast, onNavigateToAccount, onNavigateToMarketplace, onNavigateToHome, onInstallClick, showInstallButton, theme, onThemeChange, onInitiateRental, currency, onCurrencyChange } = props;

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [isListItemModalOpen, setListItemModalOpen] = useState(false);
    const [reviewItem, setReviewItem] = useState<Item | null>(null);

    const userItems = useMemo(() => items.filter(item => item.sellerId === user.id), [items, user.id]);
    const savedItems = useMemo(() => {
        const savedIds = new Set(user.savedItemIds);
        return items.filter(item => savedIds.has(item.id));
    }, [items, user.savedItemIds]);

    const userRatings = useMemo(() => {
        const ratings: { [key: string]: { avg: number; count: number } } = {};
        users.forEach(u => {
            if (u.reviewsReceived && u.reviewsReceived.length > 0) {
                const total = u.reviewsReceived.reduce((sum, review) => sum + review.rating, 0);
                ratings[u.id] = { avg: total / u.reviewsReceived.length, count: u.reviewsReceived.length };
            } else {
                ratings[u.id] = { avg: 0, count: 0 };
            }
        });
        return ratings;
    }, [users]);
    
    const sellerSpotlightUser = useMemo(() => {
        const potentialSellers = users.filter(u => u.id !== user.id && items.some(i => i.sellerId === u.id));
        if (potentialSellers.length > 0) {
            return potentialSellers[0];
        }
        return users.find(u => u.id !== user.id) || null;
    }, [users, items, user.id]);

    const sellerSpotlightRating = useMemo(() => {
        return sellerSpotlightUser ? userRatings[sellerSpotlightUser.id] : null;
    }, [sellerSpotlightUser, userRatings]);

    const savedItemIdsSet = useMemo(() => new Set(user.savedItemIds), [user.savedItemIds]);
    
    const recentActivityItems = useMemo(() => {
        return items
            .filter(item => item.sellerId !== user.id && item.status === 'available') // Exclude user's own items & sold items
            .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()) // Sort by newest
            .slice(0, 4); // Take the top 4
    }, [items, user.id]);
    
    const recentUserItems = useMemo(() => userItems.slice(0, 4), [userItems]);
    const recentSavedItems = useMemo(() => savedItems.slice(0, 4), [savedItems]);

    return (
        <div className="min-h-screen">
            <Header
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onListClick={() => setListItemModalOpen(true)}
                user={user}
                onLogout={onLogout}
                onNavigateToAccount={() => onNavigateToAccount('profile')}
                onNavigateToSettings={() => onNavigateToAccount('settings')}
                onNavigateHome={onNavigateToHome}
                notifications={[]}
                onMarkNotificationRead={() => {}}
                onInstallClick={onInstallClick}
                showInstallButton={showInstallButton}
                currency={currency}
                onCurrencyChange={onCurrencyChange}
                cartItemCount={cartItemIds.length}
                onCartClick={onOpenCart}
            />
            
            {/* Hero Dashboard Section */}
             <div className="relative border-b border-slate-200 dark:border-slate-800/50 bg-white dark:bg-slate-950 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20 dark:opacity-20">
                    <div className="absolute inset-0 bg-white dark:bg-slate-950 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"></div>
                    <div
                        className="animate-aurora absolute -top-1/2 left-1/2 h-[200%] w-[200%] -translate-x-1/2 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(14,165,233,0.1)_0%,rgba(0,0,255,0)_100%),radial-gradient(50%_50%_at_50%_50%,rgba(245,158,11,0.05)_0%,rgba(255,255,0,0)_100%)] dark:bg-[radial-gradient(50%_50%_at_50%_50%,rgba(14,165,233,0.25)_0%,rgba(0,0,255,0)_100%),radial-gradient(50%_50%_at_50%_50%,rgba(245,158,11,0.1)_0%,rgba(255,255,0,0)_100%)]"
                    ></div>
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center relative z-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
                        Welcome back, {user.name.split(' ')[0]}!
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-2xl mx-auto">Here's a snapshot of your Campusmart activity.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <StatCard icon={<ListBulletIcon className="h-6 w-6"/>} title="My Forgings" value={userItems.length} onClick={() => onNavigateToAccount('listings')} />
                        <StatCard icon={<BookmarkIcon className="h-6 w-6"/>} title="My Wishlist" value={savedItems.length} onClick={() => onNavigateToAccount('wishlist')} />
                        <StatCard icon={<ChatBubbleLeftEllipsisIcon className="h-6 w-6"/>} title="Reviews Received" value={user.reviewsReceived.length} onClick={() => onNavigateToAccount('reviews')} />
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Button onClick={() => setListItemModalOpen(true)} variant="primary" className="!h-24 !text-xl !font-bold">
                        <PlusCircleIcon className="h-8 w-8 mr-3" /> Forge a New Item
                    </Button>
                    <Button onClick={onNavigateToMarketplace} variant="secondary" className="!h-24 !text-xl !font-bold">
                        <MagnifyingGlassIcon className="h-8 w-8 mr-3" /> Explore Marketplace
                    </Button>
                    <Button onClick={() => onNavigateToAccount('settings')} variant="secondary" className="!h-24 !text-xl !font-bold">
                        <Cog6ToothIcon className="h-8 w-8 mr-3" /> Account Settings
                    </Button>
                </div>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Explore by Category</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {CATEGORIES.filter(c => c !== 'All').map(category => {
                            const Icon = CATEGORY_ICONS[category] || CodeBracketIcon;
                            return (
                                <div key={category} onClick={onNavigateToMarketplace} className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 text-center flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-primary-500/50 transition-all duration-300 transform hover:-translate-y-1">
                                    <Icon className="h-8 w-8 text-primary-500 dark:text-primary-400" />
                                    <span className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">{category}</span>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        {recentActivityItems.length > 0 && (
                            <section>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Fresh on the Forge</h2>
                                    <Button variant="ghost" onClick={onNavigateToMarketplace}>View All</Button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {recentActivityItems.map(item => (
                                        <ItemCard 
                                            key={item.id}
                                            item={item} 
                                            onSelect={setSelectedItem} 
                                            isSaved={savedItemIdsSet.has(item.id)} 
                                            onToggleSave={onToggleSaveItem}
                                            sellerRating={userRatings[item.sellerId]}
                                            currency={currency}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {recentUserItems.length > 0 && (
                            <section>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Recent Forgings</h2>
                                    <Button variant="ghost" onClick={() => onNavigateToAccount('listings')}>View All</Button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {recentUserItems.map(item => (
                                        <ItemCard 
                                            key={item.id}
                                            item={item} 
                                            onSelect={setSelectedItem} 
                                            isSaved={savedItemIdsSet.has(item.id)} 
                                            onToggleSave={onToggleSaveItem}
                                            sellerRating={userRatings[item.sellerId]}
                                            currency={currency}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                         {recentSavedItems.length > 0 && (
                            <section>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Wishlist</h2>
                                    <Button variant="ghost" onClick={() => onNavigateToAccount('wishlist')}>View All</Button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {recentSavedItems.map(item => (
                                        <ItemCard 
                                            key={item.id}
                                            item={item} 
                                            onSelect={setSelectedItem} 
                                            isSaved={true} 
                                            onToggleSave={onToggleSaveItem}
                                            sellerRating={userRatings[item.sellerId]}
                                            currency={currency}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <aside className="space-y-8 lg:sticky lg:top-24 self-start">
                        {sellerSpotlightUser && (
                            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Seller Spotlight</h3>
                                <div className="flex items-center gap-4">
                                     <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 dark:text-primary-400 font-bold text-2xl overflow-hidden flex-shrink-0">
                                          {sellerSpotlightUser.profilePictureUrl ? (
                                              <img src={sellerSpotlightUser.profilePictureUrl} alt={sellerSpotlightUser.name} className="w-full h-full object-cover" />
                                          ) : (
                                              getInitials(sellerSpotlightUser.name)
                                          )}
                                      </div>
                                      <div className="min-w-0">
                                          <h4 className="font-bold text-lg text-slate-900 dark:text-white truncate">{sellerSpotlightUser.name}</h4>
                                          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{sellerSpotlightUser.grade}, {sellerSpotlightUser.schoolLevel}</p>
                                          {sellerSpotlightRating && sellerSpotlightRating.count > 0 && (
                                              <div className="flex items-center gap-1 mt-1">
                                                <StarRating rating={sellerSpotlightRating.avg} size="h-4 w-4" />
                                                <span className="text-xs text-slate-400 dark:text-slate-500">({sellerSpotlightRating.count})</span>
                                              </div>
                                          )}
                                      </div>
                                </div>
                                {sellerSpotlightUser.bio && <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 line-clamp-3">{sellerSpotlightUser.bio}</p>}
                            </div>
                        )}
                        <div className="bg-secondary-500/10 p-6 rounded-2xl border border-secondary-500/20">
                            <div className="flex items-start gap-4">
                                <div className="text-secondary-500 dark:text-secondary-400 flex-shrink-0 pt-0.5">
                                    <LightBulbIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-secondary-800 dark:text-secondary-300">Pro-Tip</h3>
                                    <p className="text-sm text-secondary-700/80 dark:text-secondary-400/80 mt-1">A detailed description can increase your item's visibility by up to 50%. Mention the condition, features, and why you're selling it!</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

            </main>

            <ItemDetailModal
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
                currentUser={user}
                onLeaveReview={setReviewItem}
                sellerRating={selectedItem ? userRatings[selectedItem.sellerId] : undefined}
                isSaved={selectedItem ? savedItemIdsSet.has(selectedItem.id) : false}
                onToggleSave={onToggleSaveItem}
                showToast={showToast}
                onLoginRequired={() => {}}
                onAddToCart={onAddToCart}
                onRemoveFromCart={onRemoveFromCart}
                cartItemIds={cartItemIds}
                onInitiateRental={onInitiateRental}
                currency={currency}
            />
            
            <ListItemModal 
                isOpen={isListItemModalOpen}
                onClose={() => setListItemModalOpen(false)}
                onAddItem={onAddItem}
                showToast={showToast}
            />

            <ReviewModal
                isOpen={!!reviewItem}
                onClose={() => setReviewItem(null)}
                item={reviewItem}
                onAddReview={onAddReview}
                showToast={showToast}
            />
            
            <ThemeSwitcher currentTheme={theme} onThemeChange={onThemeChange} />
        </div>
    );
};