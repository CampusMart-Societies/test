import React, { useState, useEffect, useCallback } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { MarketplacePage } from './components/MarketplacePage';
import { AccountPage } from './components/AccountPage';
import { Toast } from './components/Toast';
import { User, Item, Review, Currency, Notification, PaymentMethod, Transaction, Theme, ActiveTab, Page, PurchaseContext, PlanPurchaseContext } from './types';
import { USERS, ITEMS, NOTIFICATIONS } from './data';
import { ChatBubble } from './components/ChatBubble';
import { MartBotModal } from './components/MartBotModal';
import { PublicHeader } from './components/PublicHeader';
import { PublicFooter } from './components/PublicFooter';
import { FeaturesPage } from './components/pages/FeaturesPage';
import { HowItWorksPage } from './components/pages/HowItWorksPage';
import { TestimonialsPage } from './components/pages/TestimonialsPage';
import { PricingPage } from './components/pages/PricingPage';
import { ContactPage } from './components/pages/ContactPage';
import { HomePage } from './components/HomePage';
import { PrivacyPolicyPage } from './components/pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './components/pages/TermsOfServicePage';
import { PaymentPage } from './components/PaymentPage';
import { RentalModal } from './components/RentalModal';
import { CartModal } from './components/CartModal';


const App: React.FC = () => {
    // State management
    const [users, setUsers] = useState<User[]>(() => {
        const savedUsers = localStorage.getItem('campusmart_users');
        const initialUsers = savedUsers ? JSON.parse(savedUsers) : USERS;
        // Hydrate users with default values for new properties to ensure backward compatibility
        return initialUsers.map((user: User) => ({
            ...user,
            reviewsReceived: user.reviewsReceived || [],
            savedItemIds: user.savedItemIds || [],
            purchasedItemIds: user.purchasedItemIds || [],
            notificationSettings: user.notificationSettings || {
                inApp: { newMessages: true, itemSold: true, newReviews: true, priceDrops: true, itemSaved: true },
                email: { newMessages: true, itemSold: true, newReviews: false, priceDrops: false, itemSaved: false, weeklyDigest: true },
            },
            paymentMethods: user.paymentMethods || [],
            transactionHistory: user.transactionHistory || [],
            plan: user.plan || 'Free',
            martcoinBalance: user.martcoinBalance || 0,
            cart: user.cart || [],
        }));
    });
    const [items, setItems] = useState<Item[]>(() => {
        const savedItems = localStorage.getItem('campusmart_items');
        return savedItems ? JSON.parse(savedItems) : ITEMS;
    });
     const [notifications, setNotifications] = useState<Notification[]>(() => {
        const savedNotifs = localStorage.getItem('campusmart_notifications');
        return savedNotifs ? JSON.parse(savedNotifs) : NOTIFICATIONS;
    });
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('campusmart_currentUser');
        if (savedUser) {
            const user = JSON.parse(savedUser);
             // Hydrate currentUser with default values for new properties
            return {
                ...user,
                reviewsReceived: user.reviewsReceived || [],
                savedItemIds: user.savedItemIds || [],
                purchasedItemIds: user.purchasedItemIds || [],
                notificationSettings: user.notificationSettings || {
                    inApp: { newMessages: true, itemSold: true, newReviews: true, priceDrops: true, itemSaved: true },
                    email: { newMessages: true, itemSold: true, newReviews: false, priceDrops: false, itemSaved: false, weeklyDigest: true },
                },
                paymentMethods: user.paymentMethods || [],
                transactionHistory: user.transactionHistory || [],
                plan: user.plan || 'Free',
                martcoinBalance: user.martcoinBalance || 0,
                cart: user.cart || [],
            };
        }
        return null;
    });
    const [isGuestMode, setIsGuestMode] = useState<boolean>(() => {
        const savedGuestMode = localStorage.getItem('campusmart_isGuestMode');
        return savedGuestMode ? JSON.parse(savedGuestMode) : false;
    });
    const [currentPage, setCurrentPage] = useState<Page>('landing');
    const [accountPageTab, setAccountPageTab] = useState<ActiveTab>('profile');
    
    // UI State
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('campusmart_theme') as Theme) || 'dark');
    const [currency, setCurrency] = useState<Currency>(() => (localStorage.getItem('campusmart_currency') as Currency) || 'INR');
    const [isMartBotOpen, setIsMartBotOpen] = useState(false);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [postLoginRedirect, setPostLoginRedirect] = useState<{ page: Page; tab?: ActiveTab } | null>(null);
    const [purchaseContext, setPurchaseContext] = useState<PurchaseContext>(null);
    const [rentalContext, setRentalContext] = useState<Item | null>(null);
    
    // PWA Install prompt state
    const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
    const [showInstallButton, setShowInstallButton] = useState(false);

    // Effects
    useEffect(() => {
        localStorage.setItem('campusmart_users', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem('campusmart_items', JSON.stringify(items));
    }, [items]);

    useEffect(() => {
        localStorage.setItem('campusmart_notifications', JSON.stringify(notifications));
    }, [notifications]);

     useEffect(() => {
        if (currentUser) {
            const updatedCurrentUser = users.find(u => u.id === currentUser.id) || null;
            setCurrentUser(updatedCurrentUser);
            localStorage.setItem('campusmart_currentUser', JSON.stringify(updatedCurrentUser));
        } else {
            localStorage.removeItem('campusmart_currentUser');
        }
    }, [currentUser?.id, users]);
    
    useEffect(() => {
        localStorage.setItem('campusmart_isGuestMode', JSON.stringify(isGuestMode));
    }, [isGuestMode]);

    useEffect(() => {
        localStorage.setItem('campusmart_theme', theme);
        const html = document.documentElement;
        html.classList.remove('dark', 'light', 'amoled');
        html.classList.add(theme);
        if (theme === 'amoled') {
            html.classList.add('dark');
        }
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('campusmart_currency', currency);
    }, [currency]);
    
    useEffect(() => {
        const beforeInstallPromptHandler = (e: Event) => {
            e.preventDefault();
            setDeferredInstallPrompt(e);
            setShowInstallButton(true);
        };
        window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);
        return () => window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler);
    }, []);

    // Helper functions
    const showToast = (message: string, type: 'success' | 'error' = 'error') => {
        setToast({ message, type });
    };

    // Event Handlers
    const handleInstallClick = async () => {
        if (!deferredInstallPrompt) return;
        deferredInstallPrompt.prompt();
        const { outcome } = await deferredInstallPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
        } else {
            console.log('User dismissed the A2HS prompt');
        }
        setDeferredInstallPrompt(null);
        setShowInstallButton(false);
    };

    const handleEnterGuestMode = useCallback(() => {
        setIsGuestMode(true);
        setCurrentUser(null);
        setCurrentPage('marketplace');
        showToast('You are now browsing as a guest.', 'success');
    }, []);
    
    const handleLogin = useCallback((email: string, password: string, rememberMe: boolean) => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            setIsGuestMode(false);
            setCurrentUser(user);
            showToast(`Welcome back, ${user.name}!`, 'success');
            if (rememberMe) {
                localStorage.setItem('campusmart_remembered_email', email);
            } else {
                localStorage.removeItem('campusmart_remembered_email');
            }
            if (postLoginRedirect) {
                setCurrentPage(postLoginRedirect.page);
                if (postLoginRedirect.tab) {
                    setAccountPageTab(postLoginRedirect.tab);
                }
                setPostLoginRedirect(null);
            } else {
                setCurrentPage('home');
            }
        } else {
            showToast('Invalid email or password.');
        }
    }, [users, postLoginRedirect]);

    const handleRegister = useCallback((userData: Omit<User, 'id' | 'reviewsReceived' | 'savedItemIds' | 'purchasedItemIds' | 'notificationSettings' | 'paymentMethods' | 'transactionHistory' | 'cart'>) => {
        if (users.some(u => u.email === userData.email)) {
            showToast('An account with this email already exists.');
            return;
        }
        const newUser: User = { 
            ...userData,
            id: `user${users.length + 1}`,
            reviewsReceived: [],
            savedItemIds: [],
            purchasedItemIds: [],
            bio: '',
            twitterUrl: '',
            linkedinUrl: '',
            githubUrl: '',
            notificationSettings: { // Default settings
                inApp: { newMessages: true, itemSold: true, newReviews: true, priceDrops: true, itemSaved: true },
                email: { newMessages: true, itemSold: true, newReviews: false, priceDrops: false, itemSaved: false, weeklyDigest: true },
            },
            paymentMethods: [],
            transactionHistory: [],
            plan: 'Free',
            martcoinBalance: 0,
            cart: [],
        };
        setUsers(prevUsers => [...prevUsers, newUser]);
        setIsGuestMode(false);
        setCurrentUser(newUser);
        showToast('Account created successfully!', 'success');
        if (postLoginRedirect) {
            setCurrentPage(postLoginRedirect.page);
            if (postLoginRedirect.tab) {
                setAccountPageTab(postLoginRedirect.tab);
            }
            setPostLoginRedirect(null);
        } else {
            setCurrentPage('home');
        }
    }, [users, postLoginRedirect]);

    const handleLogout = useCallback(() => {
        setIsGuestMode(false);
        setCurrentUser(null);
        setCurrentPage('landing');
        showToast('You have been logged out.', 'success');
    }, []);
    
    const handleAddItem = useCallback((itemData: Omit<Item, 'id' | 'postedDate' | 'seller' | 'sellerId' | 'status'>) => {
        if (isGuestMode || !currentUser) {
            showToast('Please log in or create an account to list an item.');
            setPostLoginRedirect({ page: 'marketplace' });
            setCurrentPage('login');
            return;
        }
        const newItem: Item = {
            ...itemData,
            id: `item${items.length + 1}`,
            postedDate: new Date().toISOString(),
            seller: currentUser.name,
            sellerId: currentUser.id,
            status: 'available',
        };
        setItems(prevItems => [newItem, ...prevItems]);
        showToast('Item forged successfully!', 'success');
    }, [currentUser, items, isGuestMode]);
    
    const handleUpdateItem = useCallback((updatedItem: Item) => {
        setItems(prevItems => prevItems.map(item => item.id === updatedItem.id ? updatedItem : item));
        showToast('Item updated successfully!', 'success');
    }, []);

    const handleDeleteItem = useCallback((itemId: string) => {
        setItems(prevItems => prevItems.filter(item => item.id !== itemId));
        setUsers(prevUsers => prevUsers.map(user => ({
            ...user,
            savedItemIds: user.savedItemIds.filter(id => id !== itemId),
            cart: user.cart.filter(id => id !== itemId)
        })));
        showToast('Item deleted successfully!', 'success');
    }, []);

    const handleToggleSaveItem = useCallback((itemId: string) => {
        if (isGuestMode || !currentUser) {
            showToast('Please log in or create an account to save items.');
            setPostLoginRedirect({ page: 'marketplace' });
            setCurrentPage('login');
            return;
        }

        const isSaved = (currentUser.savedItemIds || []).includes(itemId);
        const updatedSavedIds = isSaved
            ? (currentUser.savedItemIds || []).filter(id => id !== itemId)
            : [...(currentUser.savedItemIds || []), itemId];
        
        const updatedUser = { ...currentUser, savedItemIds: updatedSavedIds };
        
        setCurrentUser(updatedUser); // Immediately update currentUser state for UI responsiveness
        setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
        
        showToast(isSaved ? 'Item removed from wishlist!' : 'Item added to wishlist!', 'success');
    }, [currentUser, isGuestMode]);

    const handleAddReview = useCallback((reviewData: Omit<Review, 'id' | 'postedDate' | 'reviewerId' | 'reviewerName' | 'reviewerProfilePictureUrl'> & { revieweeId: string }) => {
        if (isGuestMode || !currentUser) {
            showToast('Please log in or create an account to leave a review.');
            setPostLoginRedirect({ page: 'marketplace' });
            setCurrentPage('login');
            return;
        }

        const newReview: Review = {
            ...reviewData,
            id: `review-${Date.now()}`,
            postedDate: new Date().toISOString(),
            reviewerId: currentUser.id,
            reviewerName: currentUser.name,
            reviewerProfilePictureUrl: currentUser.profilePictureUrl,
        };

        const updatedUsers = users.map(user => {
            if (user.id === reviewData.revieweeId) {
                const updatedReviews = [newReview, ...(user.reviewsReceived || [])];
                return { ...user, reviewsReceived: updatedReviews };
            }
            return user;
        });

        setUsers(updatedUsers);
        showToast('Review submitted successfully!', 'success');
    }, [currentUser, users, isGuestMode]);

    const handleUpdateUser = useCallback((updates: Partial<User>): boolean => {
        if (!currentUser) return false;

        if (updates.email) {
            const emailExists = users.some(u => u.email === updates.email && u.id !== currentUser.id);
            if (emailExists) {
                showToast('This email is already in use by another account.');
                return false;
            }
        }

        const updatedUser = { ...currentUser, ...updates };
        setCurrentUser(updatedUser);
        setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
        showToast('Profile updated successfully!', 'success');
        return true;
    }, [currentUser, users]);
    
    const handleChangePassword = useCallback((passwords: { current: string, new: string }): boolean => {
        if (!currentUser) return false;
        if(currentUser.password !== passwords.current) {
            showToast('Incorrect current password.');
            return false;
        }
        const updatedUser = { ...currentUser, password: passwords.new };
        setCurrentUser(updatedUser);
        setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
        showToast('Password changed successfully!', 'success');
        return true;
    }, [currentUser]);

    const handleMarkNotificationRead = useCallback((notificationId: string) => {
        setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
    }, []);

    const handleMarkAllNotificationsRead = useCallback((userId: string) => {
        setNotifications(prev => prev.map(n => n.userId === userId ? { ...n, isRead: true } : n));
        showToast('All notifications marked as read.', 'success');
    }, []);

    const handleClearAllNotifications = useCallback((userId: string) => {
        setNotifications(prev => prev.filter(n => n.userId !== userId));
        showToast('Notifications cleared.', 'success');
    }, []);
    
    const handleNavigateToAccount = useCallback((tab: ActiveTab) => {
        if (isGuestMode || !currentUser) {
            showToast('Please log in or create an account to view your profile.');
            setPostLoginRedirect({ page: 'account', tab });
            setCurrentPage('login');
            return;
        }
        setAccountPageTab(tab);
        setCurrentPage('account');
    }, [isGuestMode, currentUser]);

    const handleChatBubbleClick = useCallback(() => {
        setIsMartBotOpen(prev => !prev);
    }, []);
    
    const handleNavigateBackToLanding = useCallback(() => setCurrentPage('landing'), []);

    const handleAddToCart = useCallback((itemId: string) => {
        if (!currentUser) {
            showToast('Please log in to add items to your cart.');
            setCurrentPage('login');
            return;
        }
        const updatedUser = { ...currentUser, cart: [...currentUser.cart, itemId] };
        setCurrentUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
        showToast('Item added to cart!', 'success');
    }, [currentUser]);

    const handleRemoveFromCart = useCallback((itemId: string) => {
        if (!currentUser) return;
        const updatedUser = { ...currentUser, cart: currentUser.cart.filter(id => id !== itemId) };
        setCurrentUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
        showToast('Item removed from cart.', 'success');
    }, [currentUser]);
    
    const handleInitiatePurchase = useCallback((context: Item | Item[]) => {
        setPurchaseContext(context);
        if (currentUser) {
            setCurrentPage('payment');
        } else {
            setPostLoginRedirect({ page: 'payment' });
            setCurrentPage('login');
        }
    }, [currentUser]);
    
    const handleInitiateRental = useCallback((itemToRent: Item) => {
        if (isGuestMode || !currentUser) {
            showToast('Please log in or create an account to rent items.');
            setPostLoginRedirect({ page: 'marketplace' });
            setCurrentPage('login');
            return;
        }
        setRentalContext(itemToRent);
    }, [currentUser, isGuestMode]);

    const handleConfirmRental = useCallback((item: Item, durationHours: number) => {
        if (!currentUser) return;

        const totalPrice = item.price * durationHours;

        const newTransaction: Transaction = {
            id: `txn-${Date.now()}`,
            date: new Date().toISOString(),
            itemTitle: item.title,
            amount: totalPrice,
            currency: 'INR',
            status: 'completed',
            transactionType: 'rental',
            rentalDurationHours: durationHours,
        };
        
        const updatedUser = {
            ...currentUser,
            transactionHistory: [newTransaction, ...(currentUser.transactionHistory || [])]
        };
        
        setCurrentUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

        showToast(`Successfully rented "${item.title}" for ${durationHours} hour(s)!`, 'success');
        setRentalContext(null);
    }, [currentUser]);

    const handlePlanSelect = useCallback((plan: { name: 'Free' | 'Pro' | 'Premier', price: number }) => {
        setPurchaseContext({
            type: 'plan',
            name: plan.name,
            price: plan.price
        });
        if (currentUser) {
            setCurrentPage('payment');
        } else {
            setPostLoginRedirect({ page: 'payment' });
            setCurrentPage('login');
        }
    }, [currentUser]);

    const handleConfirmPurchase = useCallback((context: PurchaseContext, paymentMethod: PaymentMethod) => {
        if (!currentUser || !context) {
            showToast('An error occurred. Please try again.');
            setCurrentPage('marketplace');
            return;
        }

        if (Array.isArray(context)) { // Cart purchase
            const cartItems = context;
            const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);
            const soldItemIds = new Set(cartItems.map(item => item.id));

            setItems(prevItems => prevItems.map(i => soldItemIds.has(i.id) ? { ...i, status: 'sold' } : i));

            let updatedUser = {
                ...currentUser,
                purchasedItemIds: [...new Set([...(currentUser.purchasedItemIds || []), ...soldItemIds])],
                cart: [], // Clear cart
            };

            const martcoinsEarned = Math.floor(totalAmount / 10);
            if (martcoinsEarned > 0) {
                updatedUser.martcoinBalance = (updatedUser.martcoinBalance || 0) + martcoinsEarned;
            }

            const newTransaction: Transaction = {
                id: `txn-${Date.now()}`,
                date: new Date().toISOString(),
                itemTitle: `${cartItems.length} items purchased`,
                amount: totalAmount,
                currency: 'INR',
                status: 'completed',
                transactionType: 'purchase',
            };
            const userWithTxn = { ...updatedUser, transactionHistory: [newTransaction, ...(updatedUser.transactionHistory || [])] };
            setCurrentUser(userWithTxn);
            setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? userWithTxn : u));
            
            let successMessage = `Successfully purchased ${cartItems.length} items!`;
            if (martcoinsEarned > 0) {
                successMessage += ` You earned ${martcoinsEarned} Martcoins.`;
            }
            showToast(successMessage, 'success');
            setCurrentPage('marketplace');

        } else if ('type' in context && context.type === 'plan') { // Plan purchase
            const updatedUser = { ...currentUser, plan: context.name };
            const newTransaction: Transaction = {
                id: `txn-${Date.now()}`,
                date: new Date().toISOString(),
                itemTitle: `${context.name} Plan Subscription`,
                amount: context.price,
                currency: 'INR',
                status: 'completed',
                transactionType: 'purchase',
            };
            const userWithTxn = { ...updatedUser, transactionHistory: [newTransaction, ...(updatedUser.transactionHistory || [])] };
            setCurrentUser(userWithTxn);
            setUsers(prev => prev.map(u => u.id === currentUser.id ? userWithTxn : u));
            showToast(`Successfully subscribed to the ${context.name} plan!`, 'success');
            setCurrentPage('account');
            setAccountPageTab('payments');

        } else { // Single Item
            const item = context as Item;
            setItems(prevItems => prevItems.map(i => i.id === item.id ? { ...i, status: 'sold' } : i));
            
            let updatedUser = {
                ...currentUser,
                purchasedItemIds: [...(currentUser.purchasedItemIds || []), item.id]
            };

            const martcoinsEarned = Math.floor(item.price / 10);
            if (martcoinsEarned > 0) {
                updatedUser.martcoinBalance = (updatedUser.martcoinBalance || 0) + martcoinsEarned;
            }

            const newTransaction: Transaction = {
                id: `txn-${Date.now()}`,
                date: new Date().toISOString(),
                itemTitle: item.title,
                amount: item.price,
                currency: 'INR',
                status: 'completed',
                transactionType: 'purchase',
            };
            const userWithTxn = { ...updatedUser, transactionHistory: [newTransaction, ...(updatedUser.transactionHistory || [])] };
            setCurrentUser(userWithTxn);
            setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? userWithTxn : u));
            
            let successMessage = 'Purchase successful! The seller will be notified.';
            if (martcoinsEarned > 0) {
                successMessage = `Purchase successful! You earned ${martcoinsEarned} Martcoins.`;
            }
            showToast(successMessage, 'success');
            setCurrentPage('marketplace');
        }

        setPurchaseContext(null);
    }, [currentUser, users]);

    
    const handleCurrencyChange = useCallback((newCurrency: Currency) => {
        setCurrency(newCurrency);
    }, []);
    
    const handleDeletePaymentMethod = useCallback((paymentMethodId: string) => {
        if (!currentUser) return;
        
        const updatedPaymentMethods = (currentUser.paymentMethods || []).filter(pm => pm.id !== paymentMethodId);

        if (updatedPaymentMethods.length > 0) {
            const wasDefaultDeleted = !updatedPaymentMethods.some(pm => pm.isDefault);
            if (wasDefaultDeleted) {
                updatedPaymentMethods[0].isDefault = true;
            }
        }

        const updatedUser = { ...currentUser, paymentMethods: updatedPaymentMethods };
        setCurrentUser(updatedUser);
        setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
        showToast('Payment method removed.', 'success');

    }, [currentUser]);

    const handleAddPaymentMethod = useCallback((newMethodData: Omit<PaymentMethod, 'id'>): PaymentMethod | undefined => {
        if (!currentUser) return undefined;

        let currentMethods = [...(currentUser.paymentMethods || [])];
        
        if (newMethodData.isDefault) {
            currentMethods = currentMethods.map(pm => ({ ...pm, isDefault: false }));
        }

        const newMethod: PaymentMethod = {
            ...newMethodData,
            id: `pm-${Date.now()}`,
            isDefault: currentMethods.length === 0 ? true : newMethodData.isDefault,
        };

        const updatedPaymentMethods = [...currentMethods, newMethod];
        const updatedUser = { ...currentUser, paymentMethods: updatedPaymentMethods };

        setCurrentUser(updatedUser);
        setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
        showToast('Payment method added successfully!', 'success');
        return newMethod;
    }, [currentUser]);
    
    const handleSetDefaultPaymentMethod = useCallback((paymentMethodId: string) => {
        if (!currentUser) return;

        const updatedPaymentMethods = (currentUser.paymentMethods || []).map(pm => ({
            ...pm,
            isDefault: pm.id === paymentMethodId,
        }));

        const updatedUser = { ...currentUser, paymentMethods: updatedPaymentMethods };
        setCurrentUser(updatedUser);
        setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
        showToast('Default payment method updated.', 'success');
    }, [currentUser]);

    // Render logic
    const renderPage = () => {
         if (currentPage === 'payment') {
            if ((!currentUser && !isGuestMode) || !purchaseContext) {
                 showToast('Your session has expired. Please log in again.');
                 setCurrentPage('login');
                 setPurchaseContext(null);
                 return null;
            }
            return <PaymentPage 
                        user={currentUser!}
                        purchaseContext={purchaseContext}
                        currency={currency}
                        onConfirmPurchase={handleConfirmPurchase}
                        onCancel={() => {
                            setPurchaseContext(null);
                            const contextIsPlan = purchaseContext && 'type' in purchaseContext && purchaseContext.type === 'plan';
                            setCurrentPage(contextIsPlan ? 'pricing' : 'marketplace');
                        }}
                        onAddPaymentMethod={handleAddPaymentMethod}
                        showToast={showToast}
                    />;
        }
        // --- Authenticated User Flow ---
        if (currentUser) {
            const userNotifications = notifications.filter(n => n.userId === currentUser.id);

            const publicPages: Page[] = ['landing', 'features', 'how-it-works', 'testimonials', 'pricing', 'contact', 'privacy-policy', 'terms-of-service'];
            
            if (publicPages.includes(currentPage)) {
                let pageContent;
                switch (currentPage) {
                    case 'features': pageContent = <FeaturesPage />; break;
                    case 'how-it-works': pageContent = <HowItWorksPage />; break;
                    case 'testimonials': pageContent = <TestimonialsPage onNavigate={setCurrentPage} />; break;
                    case 'pricing': pageContent = <PricingPage onNavigate={setCurrentPage} onPlanSelect={handlePlanSelect} />; break;
                    case 'contact': pageContent = <ContactPage onNavigate={setCurrentPage} />; break;
                    case 'privacy-policy': pageContent = <PrivacyPolicyPage />; break;
                    case 'terms-of-service': pageContent = <TermsOfServicePage />; break;
                    case 'landing':
                    default:
                        pageContent = <LandingPage onGetStarted={() => setCurrentPage('home')} onNavigate={setCurrentPage} isLoggedIn={true} />;
                        break;
                }
                return (
                    <div className="min-h-screen font-sans">
                        <PublicHeader onNavigate={setCurrentPage} onGetStarted={() => setCurrentPage('home')} currentPage={currentPage} isLoggedIn={true} onNavigateToAccount={handleNavigateToAccount} />
                        <main className="overflow-hidden pt-20">{pageContent}</main>
                        <PublicFooter onNavigate={setCurrentPage} />
                    </div>
                );
            }
            
            switch (currentPage) {
                case 'home':
                    return (
                        <HomePage
                            user={currentUser}
                            users={users}
                            items={items}
                            onLogout={handleLogout}
                            onAddItem={handleAddItem}
                            onAddReview={handleAddReview}
                            onToggleSaveItem={handleToggleSaveItem}
                            onAddToCart={handleAddToCart}
                            onRemoveFromCart={handleRemoveFromCart}
                            cartItemIds={currentUser.cart}
                            onOpenCart={() => setIsCartModalOpen(true)}
                            onInitiateRental={handleInitiateRental}
                            showToast={showToast}
                            onNavigateToAccount={handleNavigateToAccount}
                            onNavigateToMarketplace={() => setCurrentPage('marketplace')}
                            onNavigateToHome={() => setCurrentPage('landing')}
                            onInstallClick={handleInstallClick}
                            showInstallButton={showInstallButton}
                            theme={theme}
                            onThemeChange={setTheme}
                            currency={currency}
                            onCurrencyChange={handleCurrencyChange}
                        />
                    );
                case 'marketplace':
                    return (
                        <MarketplacePage 
                            user={currentUser}
                            users={users}
                            items={items}
                            notifications={userNotifications}
                            onLogout={handleLogout}
                            onAddItem={handleAddItem}
                            onAddReview={handleAddReview}
                            onToggleSaveItem={handleToggleSaveItem}
                            onAddToCart={handleAddToCart}
                            onRemoveFromCart={handleRemoveFromCart}
                            cartItemIds={currentUser.cart}
                            onOpenCart={() => setIsCartModalOpen(true)}
                            onInitiateRental={handleInitiateRental}
                            showToast={showToast}
                            onNavigateToAccount={handleNavigateToAccount}
                            onNavigateToHome={() => setCurrentPage('landing')}
                            onNavigateToLogin={() => setCurrentPage('login')}
                            onNavigateToRegister={() => setCurrentPage('register')}
                            onInstallClick={handleInstallClick}
                            showInstallButton={showInstallButton}
                            theme={theme}
                            onThemeChange={setTheme}
                            currency={currency}
                            onCurrencyChange={handleCurrencyChange}
                            onMarkNotificationRead={handleMarkNotificationRead}
                        />
                    );
                case 'account':
                    return (
                        <AccountPage 
                            user={currentUser}
                            users={users}
                            userItems={items.filter(item => item.sellerId === currentUser.id)}
                            allItems={items}
                            notifications={userNotifications}
                            onNavigateBack={() => setCurrentPage('marketplace')}
                            onUpdateUser={handleUpdateUser}
                            onChangePassword={handleChangePassword}
                            onUpdateItem={handleUpdateItem}
                            onDeleteItem={handleDeleteItem}
                            onToggleSaveItem={handleToggleSaveItem}
                            onAddReview={handleAddReview}
                            showToast={showToast}
                            initialTab={accountPageTab}
                            theme={theme}
                            onThemeChange={setTheme}
                            onAddToCart={handleAddToCart}
                            onRemoveFromCart={handleRemoveFromCart}
                            cartItemIds={currentUser.cart}
                            onInitiateRental={handleInitiateRental}
                            currency={currency}
                            onCurrencyChange={handleCurrencyChange}
                            onMarkNotificationRead={handleMarkNotificationRead}
                            onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
                            onClearAllNotifications={handleClearAllNotifications}
                            onDeletePaymentMethod={handleDeletePaymentMethod}
                            onAddPaymentMethod={handleAddPaymentMethod}
                            onSetDefaultPaymentMethod={handleSetDefaultPaymentMethod}
                        />
                    );
                default:
                    setCurrentPage('home');
                    return null;
            }
        }
        // --- Logged-Out (Guest or Initial) User Flow ---
        else {
            if (currentPage === 'login' || currentPage === 'register') {
                return currentPage === 'login' ? (
                     <LoginPage 
                        onLogin={handleLogin} 
                        onNavigateToRegister={() => setCurrentPage('register')} 
                        showToast={showToast} 
                        onNavigateBack={() => setCurrentPage(isGuestMode ? 'marketplace' : 'landing')} 
                        onContinueAsGuest={handleEnterGuestMode} 
                    />
                ) : (
                     <RegisterPage 
                        onRegister={handleRegister} 
                        onNavigateToLogin={() => setCurrentPage('login')} 
                        showToast={showToast} 
                        onNavigateBack={() => setCurrentPage(isGuestMode ? 'marketplace' : 'landing')}
                    />
                )
            }
            
            if (isGuestMode) { // User explicitly chose guest mode
                 return (
                    <MarketplacePage 
                        user={null}
                        isGuestMode={true}
                        users={users}
                        items={items}
                        notifications={[]}
                        onLogout={() => {}} // No-op
                        onAddItem={handleAddItem}
                        onAddReview={handleAddReview}
                        onToggleSaveItem={handleToggleSaveItem}
                        onAddToCart={handleAddToCart}
                        onRemoveFromCart={handleRemoveFromCart}
                        cartItemIds={[]}
                        onOpenCart={() => setIsCartModalOpen(true)}
                        onInitiateRental={handleInitiateRental}
                        showToast={showToast}
                        onNavigateToAccount={handleNavigateToAccount}
                        onNavigateToHome={handleNavigateBackToLanding}
                        onNavigateToLogin={() => setCurrentPage('login')}
                        onNavigateToRegister={() => setCurrentPage('register')}
                        onInstallClick={handleInstallClick}
                        showInstallButton={showInstallButton}
                        theme={theme}
                        onThemeChange={setTheme}
                        currency={currency}
                        onCurrencyChange={handleCurrencyChange}
                        onMarkNotificationRead={handleMarkNotificationRead}
                    />
                );
            }

            // Default logged-out flow is public pages
            const publicPages: Page[] = ['landing', 'features', 'how-it-works', 'testimonials', 'pricing', 'contact', 'privacy-policy', 'terms-of-service'];
            let pageContent;
            switch (currentPage) {
                case 'features': pageContent = <FeaturesPage />; break;
                case 'how-it-works': pageContent = <HowItWorksPage />; break;
                case 'testimonials': pageContent = <TestimonialsPage onNavigate={setCurrentPage} />; break;
                case 'pricing': pageContent = <PricingPage onNavigate={setCurrentPage} onPlanSelect={handlePlanSelect} />; break;
                case 'contact': pageContent = <ContactPage onNavigate={setCurrentPage} />; break;
                case 'privacy-policy': pageContent = <PrivacyPolicyPage />; break;
                case 'terms-of-service': pageContent = <TermsOfServicePage />; break;
                case 'landing':
                default:
                    pageContent = <LandingPage onGetStarted={() => setCurrentPage('login')} onNavigate={setCurrentPage} />;
                    break;
            }
            return (
                <div className="min-h-screen font-sans">
                    <PublicHeader onNavigate={setCurrentPage} onGetStarted={() => setCurrentPage('login')} currentPage={currentPage} isLoggedIn={false} />
                    <main className="overflow-hidden pt-20">{pageContent}</main>
                    <PublicFooter onNavigate={setCurrentPage} />
                </div>
            );
        }
    };
    
    const publicPages = ['landing', 'features', 'how-it-works', 'testimonials', 'pricing', 'contact', 'privacy-policy', 'terms-of-service'];
    const showChatBubble = isGuestMode || currentUser || (!currentUser && publicPages.includes(currentPage));

    return (
        <>
            {renderPage()}
            {showChatBubble && <ChatBubble onClick={handleChatBubbleClick} />}
            {showChatBubble && <MartBotModal isOpen={isMartBotOpen} onClose={() => setIsMartBotOpen(false)} />}
            <RentalModal
                isOpen={!!rentalContext}
                onClose={() => setRentalContext(null)}
                item={rentalContext}
                currency={currency}
                onConfirmRental={handleConfirmRental}
            />
            <CartModal
                isOpen={isCartModalOpen}
                onClose={() => setIsCartModalOpen(false)}
                cartItems={currentUser ? items.filter(item => currentUser.cart.includes(item.id)) : []}
                onRemoveFromCart={handleRemoveFromCart}
                onCheckout={() => {
                    if (currentUser?.cart.length) {
                        const cartItems = items.filter(item => currentUser.cart.includes(item.id));
                        handleInitiatePurchase(cartItems);
                        setIsCartModalOpen(false);
                    }
                }}
                currency={currency}
            />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </>
    );
};

export default App;