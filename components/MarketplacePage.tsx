import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Header } from './Header';
import { FilterSidebar } from './FilterSidebar';
import { ItemListings } from './ItemListings';
import { ItemDetailModal } from './ItemDetailModal';
import { ListItemModal } from './ListItemModal';
import { Item, Filters, User, Review, ItemType, Currency, Notification, ItemCondition, Theme, ActiveTab } from '../types';
import { ReviewModal } from './ReviewModal';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Button } from './Button';
import { SearchBar } from './SearchBar';
import { SpinnerIcon, ArrowUturnLeftIcon, ArrowUturnRightIcon } from './icons/Icons';
import { ITEM_CONDITIONS } from '../constants';

interface MarketplacePageProps {
  user: User | null;
  users: User[];
  items: Item[];
  notifications: Notification[];
  isGuestMode?: boolean;
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
  onNavigateToHome: () => void;
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
  onInstallClick: () => void;
  showInstallButton: boolean;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onInitiateRental: (item: Item) => void;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  onMarkNotificationRead: (id: string) => void;
}

const ITEMS_PER_PAGE = 12;
type SortOption = 'date-desc' | 'date-asc' | 'price-asc' | 'price-desc' | 'title-asc' | 'rating-desc';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'date-desc', label: 'Newest First' },
  { value: 'rating-desc', label: 'Seller Rating' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'title-asc', label: 'Title: A-Z' },
];

const ShimmerDiv: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`bg-slate-200 dark:bg-slate-700/50 rounded ${className}`}></div>
);

const ItemCardSkeleton: React.FC = () => (
    <div className="relative bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden flex flex-col p-5 space-y-4">
        <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] dark:bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:200%_100%] animate-shimmer" />
        <div className="relative w-full h-40 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
        <ShimmerDiv className="h-4 w-1/3" />
        <ShimmerDiv className="h-6 w-3/4" />
        <div className="flex-grow" />
        <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700/50 flex justify-between items-center">
            <ShimmerDiv className="h-8 w-1/2" />
            <ShimmerDiv className="h-8 w-8 rounded-full" />
        </div>
    </div>
);

const MarketplaceSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <ItemCardSkeleton key={index} />
        ))}
    </div>
);


export const MarketplacePage: React.FC<MarketplacePageProps> = (props) => {
  const {
    user,
    users,
    items,
    notifications,
    isGuestMode,
    onLogout,
    onAddItem,
    onAddReview,
    onToggleSaveItem,
    onAddToCart,
    onRemoveFromCart,
    cartItemIds,
    onOpenCart,
    showToast,
    onNavigateToAccount,
    onNavigateToHome,
    onNavigateToLogin,
    onNavigateToRegister,
    onInstallClick,
    showInstallButton,
    theme,
    onThemeChange,
    onInitiateRental,
    currency,
    onCurrencyChange,
    onMarkNotificationRead
  } = props;

  // State
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const maxPrice = useMemo(() => items.length > 0 ? Math.ceil(Math.max(...items.map(item => item.price))) : 5000, [items]);
  
  const [history, setHistory] = useState(() => {
    const initialFilters: Filters = {
      category: 'All',
      type: [ItemType.SALE, ItemType.RENT],
      priceRange: { min: 0, max: maxPrice },
      condition: [...ITEM_CONDITIONS],
    };
    return [{ filters: initialFilters, sortOption: 'date-desc' as SortOption }];
  });
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);

  const { filters, sortOption } = history[currentHistoryIndex];

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isListItemModalOpen, setListItemModalOpen] = useState(false);
  const [reviewItem, setReviewItem] = useState<Item | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  
  // Memos
  const userRatings = useMemo(() => {
    const ratings: { [key: string]: { avg: number; count: number } } = {};
    users.forEach(u => {
      if (u.reviewsReceived && u.reviewsReceived.length > 0) {
        const total = u.reviewsReceived.reduce((sum, review) => sum + review.rating, 0);
        ratings[u.id] = {
          avg: total / u.reviewsReceived.length,
          count: u.reviewsReceived.length,
        };
      } else {
        ratings[u.id] = { avg: 0, count: 0 };
      }
    });
    return ratings;
  }, [users]);
  
  const filteredAndSortedItems = useMemo(() => {
    let filtered = items.filter(item => {
      const searchTermMatch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const categorySearch = filters.category.toLowerCase();
      const categoryMatch = categorySearch === 'all' || !categorySearch.trim() || item.category.some(cat => cat.toLowerCase().includes(categorySearch));
      const typeMatch = filters.type.includes(item.type);
      const priceMatch = item.price >= filters.priceRange.min && item.price <= filters.priceRange.max;
      const conditionMatch = filters.condition.includes(item.condition);
      return searchTermMatch && categoryMatch && typeMatch && priceMatch && conditionMatch;
    });

    return filtered.sort((a, b) => {
      if (a.status === 'sold' && b.status !== 'sold') return 1;
      if (a.status !== 'sold' && b.status === 'sold') return -1;

      switch (sortOption) {
        case 'rating-desc':
          const ratingA = userRatings[a.sellerId]?.avg || 0;
          const ratingB = userRatings[b.sellerId]?.avg || 0;
          return ratingB - ratingA;
        case 'date-asc':
          return new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime();
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'date-desc':
        default:
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      }
    });
  }, [items, searchTerm, filters, sortOption, userRatings]);
  
  const paginatedItems = useMemo(() => {
    return filteredAndSortedItems.slice(0, currentPage * ITEMS_PER_PAGE);
  }, [filteredAndSortedItems, currentPage]);

  const hasMoreItems = paginatedItems.length < filteredAndSortedItems.length;
  
  const savedItemIdsSet = useMemo(() => new Set(user?.savedItemIds), [user?.savedItemIds]);

  // Undo/Redo Logic
  const updateState = (newFilters: Filters, newSortOption: SortOption) => {
    const newHistoryEntry = { filters: newFilters, sortOption: newSortOption };
    if (JSON.stringify(newHistoryEntry) === JSON.stringify(history[currentHistoryIndex])) {
        return;
    }

    const newHistory = history.slice(0, currentHistoryIndex + 1);
    newHistory.push(newHistoryEntry);
    setHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  };

  const handleFilterChange = useCallback(<K extends keyof Filters>(filter: K, value: Filters[K]) => {
    const currentState = history[currentHistoryIndex];
    const newFilters = { ...currentState.filters, [filter]: value };
    updateState(newFilters, currentState.sortOption);
  }, [history, currentHistoryIndex]);

  const handleSortChange = (newSortOption: SortOption) => {
    const currentState = history[currentHistoryIndex];
    updateState(currentState.filters, newSortOption);
  };

  const handleUndo = () => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(prev => prev - 1);
    }
  };

  const handleRedo = () => {
    if (currentHistoryIndex < history.length - 1) {
      setCurrentHistoryIndex(prev => prev + 1);
    }
  };

  const canUndo = currentHistoryIndex > 0;
  const canRedo = currentHistoryIndex < history.length - 1;

  // Effects and other Callbacks
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, currentHistoryIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
        setIsInitialLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectItem = useCallback((item: Item) => {
    setSelectedItem(item);
  }, []);

  const handleLeaveReview = useCallback((item: Item) => {
    if (isGuestMode || !user) {
        showToast('You must be logged in to leave a review.');
        onNavigateToLogin();
        return;
    }
    setReviewItem(item);
    setSelectedItem(null);
  }, [isGuestMode, user, showToast, onNavigateToLogin]);
  
  const handleCloseDetailModal = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const handleLoadMore = () => {
    setIsMoreLoading(true);
    setTimeout(() => { // Simulate network delay
        setCurrentPage(prev => prev + 1);
        setIsMoreLoading(false);
    }, 500);
  };

  return (
    <>
      <div className="min-h-screen">
        <Header
          searchTerm={searchInput}
          setSearchTerm={setSearchInput}
          onListClick={() => setListItemModalOpen(true)}
          user={user}
          notifications={notifications}
          isGuestMode={isGuestMode}
          onLogout={onLogout}
          onNavigateToAccount={onNavigateToAccount}
          onNavigateToSettings={() => onNavigateToAccount('settings')}
          onNavigateHome={onNavigateToHome}
          onNavigateToLogin={onNavigateToLogin}
          onNavigateToRegister={onNavigateToRegister}
          onInstallClick={onInstallClick}
          showInstallButton={showInstallButton}
          showSearchBar={false}
          currency={currency}
          onCurrencyChange={onCurrencyChange}
          onMarkNotificationRead={onMarkNotificationRead}
          cartItemCount={cartItemIds.length}
          onCartClick={onOpenCart}
        />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Marketplace</h1>
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} maxPrice={maxPrice} />
          
           <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <div className="flex-1 min-w-0">
                  <SearchBar searchTerm={searchInput} setSearchTerm={setSearchInput} />
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <label htmlFor="sort-by" className="text-sm font-medium text-slate-500 dark:text-slate-400 hidden sm:block">Sort by:</label>
                    <select
                        id="sort-by"
                        value={sortOption}
                        onChange={(e) => handleSortChange(e.target.value as SortOption)}
                        className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 py-1.5 pl-3 pr-8 w-full sm:w-auto"
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    <div className="flex items-center gap-1 ml-2">
                      <Button variant="ghost" onClick={handleUndo} disabled={!canUndo} className="!p-2" aria-label="Undo filter/sort change">
                          <ArrowUturnLeftIcon className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" onClick={handleRedo} disabled={!canRedo} className="!p-2" aria-label="Redo filter/sort change">
                          <ArrowUturnRightIcon className="h-5 w-5" />
                      </Button>
                  </div>
                </div>
            </div>
            
            {isInitialLoading ? (
                <MarketplaceSkeleton />
            ) : (
                <ItemListings
                    items={paginatedItems}
                    onSelectItem={handleSelectItem}
                    userRatings={userRatings}
                    savedItemIds={savedItemIdsSet}
                    onToggleSave={onToggleSaveItem}
                    currency={currency}
                />
            )}
          
          <div className="h-16 flex justify-center items-center">
            {hasMoreItems && (
                <Button onClick={handleLoadMore} disabled={isMoreLoading} variant="secondary">
                    {isMoreLoading ? (
                        <>
                            <SpinnerIcon className="h-5 w-5 mr-2" />
                            Loading...
                        </>
                    ) : 'Load More'}
                </Button>
            )}
            {!hasMoreItems && paginatedItems.length > 0 && !isInitialLoading && (
              <p className="text-sm text-slate-400 dark:text-slate-500">You've reached the end of the forge.</p>
            )}
          </div>
          
        </main>
      </div>

      <ItemDetailModal
        item={selectedItem}
        onClose={handleCloseDetailModal}
        currentUser={user}
        isGuestMode={isGuestMode}
        onLoginRequired={onNavigateToLogin}
        onLeaveReview={handleLeaveReview}
        sellerRating={selectedItem ? userRatings[selectedItem.sellerId] : undefined}
        isSaved={selectedItem ? savedItemIdsSet.has(selectedItem.id) : false}
        onToggleSave={onToggleSaveItem}
        showToast={showToast}
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
    </>
  );
};