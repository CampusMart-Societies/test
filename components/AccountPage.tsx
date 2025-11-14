import React, { useState, useMemo } from 'react';
import { User, Item, Currency, Notification, PaymentMethod, Theme, ActiveTab } from '../types';
import { Button } from './Button';
import { ArrowUturnLeftIcon, UserCircleIcon, ShieldCheckIcon, ListBulletIcon, BellIcon, Cog6ToothIcon, ChatBubbleLeftEllipsisIcon, BookmarkIcon, CreditCardIcon, SparklesIcon, TrashIcon } from './icons/Icons';
import { ProfileSection } from './account/ProfileSection';
import { PasswordSection } from './account/PasswordSection';
import { MyListingsSection } from './account/MyListingsSection';
import { SettingsSection } from './account/SettingsSection';
import { ListItemModal } from './ListItemModal';
import { ReviewsSection } from './account/ReviewsSection';
import { SavedItemsSection } from './account/SavedItemsSection';
import { ItemDetailModal } from './ItemDetailModal';
import { ReviewModal } from './ReviewModal';
import { NotificationsSection } from './account/NotificationsSection';
import { PaymentsSection } from './account/PaymentsSection';
import { ConfirmationModal } from './ConfirmationModal';



interface AccountPageProps {
  user: User;
  users: User[];
  userItems: Item[];
  allItems: Item[];
  notifications: Notification[];
  onNavigateBack: () => void;
  onUpdateUser: (updatedProfile: Partial<User>) => boolean;
  onChangePassword: (passwords: { current: string; new: string }) => boolean;
  onUpdateItem: (item: Item) => void;
  onDeleteItem: (itemId: string) => void;
  onToggleSaveItem: (itemId: string) => void;
  onAddToCart: (itemId: string) => void;
  onRemoveFromCart: (itemId: string) => void;
  cartItemIds: string[];
  onAddReview: (reviewData: any) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  initialTab: ActiveTab;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onInitiateRental: (item: Item) => void;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  onMarkNotificationRead: (notificationId: string) => void;
  onMarkAllNotificationsRead: (userId: string) => void;
  onClearAllNotifications: (userId: string) => void;
  onDeletePaymentMethod: (paymentMethodId: string) => void;
  onAddPaymentMethod: (newMethod: Omit<PaymentMethod, 'id'>) => PaymentMethod | undefined;
  onSetDefaultPaymentMethod: (paymentMethodId: string) => void;
}

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

export const AccountPage: React.FC<AccountPageProps> = (props) => {
  const { user, users, userItems, allItems, notifications, onNavigateBack, onUpdateUser, onChangePassword, onUpdateItem, onDeleteItem, onToggleSaveItem, onAddToCart, onRemoveFromCart, cartItemIds, onAddReview, showToast, initialTab, theme, onThemeChange, onInitiateRental, currency, onMarkAllNotificationsRead, onMarkNotificationRead, onClearAllNotifications, onDeletePaymentMethod, onAddPaymentMethod, onSetDefaultPaymentMethod } = props;
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [reviewItem, setReviewItem] = useState<Item | null>(null);
  const [confirmation, setConfirmation] = useState<{
    title: string;
    message: React.ReactNode;
    confirmText?: string;
    icon?: React.ReactNode;
    onConfirm: () => void;
  } | null>(null);

  const savedItems = useMemo(() => {
      const savedIds = new Set(user.savedItemIds);
      return allItems.filter(item => savedIds.has(item.id));
  }, [allItems, user.savedItemIds]);

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
  
  const unreadNotificationsCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);

  const sidebarItems = [
    { id: 'profile', label: 'Profile', icon: UserCircleIcon },
    { id: 'password', label: 'Password', icon: ShieldCheckIcon },
    { id: 'listings', label: 'My Forgings', icon: ListBulletIcon },
    { id: 'wishlist', label: 'My Wishlist', icon: BookmarkIcon },
    { id: 'reviews', label: 'Reviews', icon: ChatBubbleLeftEllipsisIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon, badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : 0 },
    { id: 'payments', label: 'Payments', icon: CreditCardIcon },
    { id: 'settings', label: 'Settings', icon: Cog6ToothIcon },
  ];
  
  const handleDeleteListingRequest = (item: Item) => {
    setConfirmation({
        title: 'Delete Forging',
        message: <>Are you sure you want to permanently delete <strong>"{item.title}"</strong>? This action cannot be undone.</>,
        confirmText: 'Delete Item',
        onConfirm: () => onDeleteItem(item.id),
        icon: <TrashIcon className="h-8 w-8 text-red-500" />
    });
  };

  const handleUnsaveItemRequest = (itemId: string) => {
      const item = allItems.find(i => i.id === itemId);
      if (!item) return;

      setConfirmation({
          title: 'Remove from Wishlist',
          message: <>Are you sure you want to remove <strong>"{item.title}"</strong> from your wishlist?</>,
          confirmText: 'Remove',
          onConfirm: () => onToggleSaveItem(itemId),
          icon: <TrashIcon className="h-8 w-8 text-red-500" />
      });
  };

  const handleDeletePaymentMethodRequest = (pm: PaymentMethod) => {
    const confirmationMessage = pm.brand === 'google-pay'
        ? <>Are you sure you want to remove your Google Pay account (<strong>{pm.email}</strong>)?</>
        : <>Are you sure you want to remove the card ending in <strong>{pm.last4}</strong>?</>;

    setConfirmation({
        title: 'Delete Payment Method',
        message: confirmationMessage,
        confirmText: 'Delete',
        onConfirm: () => onDeletePaymentMethod(pm.id),
        icon: <TrashIcon className="h-8 w-8 text-red-500" />
    });
  };
  
  const handleClearNotificationsRequest = () => {
    if (notifications.length === 0) return;
    setConfirmation({
        title: 'Clear All Notifications',
        message: 'Are you sure you want to clear all your notifications? This action cannot be undone.',
        confirmText: 'Clear All',
        onConfirm: () => onClearAllNotifications(user.id),
        icon: <TrashIcon className="h-8 w-8 text-red-500" />
    });
  };

  const renderContent = () => {
    switch (activeTab) {
        case 'profile':
            return <ProfileSection user={user} onUpdateUser={onUpdateUser} showToast={showToast} />;
        case 'password':
            return <PasswordSection onChangePassword={onChangePassword} showToast={showToast} />;
        case 'listings':
            return <MyListingsSection items={userItems} onEditItem={setItemToEdit} currency={currency} onDeleteItem={handleDeleteListingRequest} />;
        case 'wishlist':
            return <SavedItemsSection items={savedItems} onUnsaveItem={handleUnsaveItemRequest} onSelectItem={setSelectedItem} userRatings={userRatings} currency={currency} />;
        case 'reviews':
            return <ReviewsSection user={user} />;
        case 'settings':
            return <SettingsSection currentTheme={theme} onThemeChange={onThemeChange} />;
        case 'notifications':
            return <NotificationsSection 
                        user={user}
                        notifications={notifications}
                        onMarkAsRead={onMarkNotificationRead}
                        onMarkAllAsRead={() => onMarkAllNotificationsRead(user.id)}
                        onClearAll={handleClearNotificationsRequest}
                        onUpdateSettings={(settings) => onUpdateUser({ notificationSettings: settings })}
                        showToast={showToast}
                    />;
        case 'payments':
             return <PaymentsSection 
                        user={user} 
                        currency={currency} 
                        onDeletePaymentMethod={handleDeletePaymentMethodRequest}
                        onAddPaymentMethod={onAddPaymentMethod}
                        onSetDefaultPaymentMethod={onSetDefaultPaymentMethod}
                        showToast={showToast}
                    />;
        default:
            return null;
    }
  }

  return (
    <>
      <div className="min-h-screen font-sans">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Button variant="ghost" onClick={onNavigateBack} className="!px-3">
              <ArrowUturnLeftIcon className="h-5 w-5 mr-2" />
              Back to Marketplace
            </Button>
          </div>
          

          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            {/* Sidebar */}
            <aside className="w-full md:w-64 flex-shrink-0">
              <div className="p-4 bg-white dark:bg-slate-900/50 amoled:bg-black/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800/50 rounded-2xl">
                  <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-2xl overflow-hidden ring-4 ring-gray-50 dark:ring-slate-900 amoled:ring-black">
                          {user.profilePictureUrl ? (
                              <img src={user.profilePictureUrl} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                              getInitials(user.name)
                          )}
                      </div>
                      <div className="min-w-0">
                          <h2 className="font-bold text-xl text-slate-900 dark:text-white truncate">{user.name}</h2>
                          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                           <div className="mt-2 flex items-center gap-2 text-secondary-500 dark:text-secondary-400 font-bold">
                                <SparklesIcon className="h-5 w-5" />
                                <span>{user.martcoinBalance?.toLocaleString() || 0} Martcoins</span>
                            </div>
                      </div>
                  </div>
                  <nav className="space-y-1">
                  {sidebarItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as ActiveTab)}
                      className={`w-full flex items-center px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors relative ${
                        activeTab === item.id
                          ? 'text-primary-500 dark:text-primary-400 bg-primary-500/10'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      {activeTab === item.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary-500 dark:bg-primary-400 rounded-r-full"></div>}
                      <item.icon className={`h-5 w-5 mr-3 ${activeTab === item.id ? 'text-primary-500 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500'}`} />
                      <span className="flex-1 text-left">{item.label}</span>
                       {item.badge && item.badge > 0 ? (
                           <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                               {item.badge > 9 ? '9+' : item.badge}
                           </span>
                       ) : null}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-white dark:bg-slate-900/50 amoled:bg-black/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800/50">
              {renderContent()}
            </main>
          </div>
        </div>
      </div>
      <ListItemModal
        isOpen={!!itemToEdit}
        onClose={() => setItemToEdit(null)}
        itemToEdit={itemToEdit}
        onUpdateItem={onUpdateItem}
        showToast={showToast}
      />
      <ItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        currentUser={user}
        onLeaveReview={setReviewItem}
        sellerRating={selectedItem ? userRatings[selectedItem.sellerId] : undefined}
        isSaved={selectedItem ? user.savedItemIds.includes(selectedItem.id) : false}
        onToggleSave={onToggleSaveItem}
        showToast={showToast}
        onLoginRequired={() => {}}
        onAddToCart={onAddToCart}
        onRemoveFromCart={onRemoveFromCart}
        cartItemIds={cartItemIds}
        onInitiateRental={onInitiateRental}
        currency={currency}
      />
       <ReviewModal
        isOpen={!!reviewItem}
        onClose={() => setReviewItem(null)}
        item={reviewItem}
        onAddReview={onAddReview}
        showToast={showToast}
      />
      <ConfirmationModal
        isOpen={!!confirmation}
        onClose={() => setConfirmation(null)}
        onConfirm={() => {
          if(confirmation) {
            confirmation.onConfirm();
            setConfirmation(null);
          }
        }}
        title={confirmation?.title || ''}
        message={confirmation?.message || ''}
        confirmText={confirmation?.confirmText}
        icon={confirmation?.icon}
      />
    </>
  );
};