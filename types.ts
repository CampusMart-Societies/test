

export type Theme = 'light' | 'dark' | 'amoled';
export type Currency = 'INR' | 'USD';
export type ActiveTab = 'profile' | 'password' | 'listings' | 'reviews' | 'wishlist' | 'settings' | 'notifications' | 'payments';

export type Page = 'landing' | 'login' | 'register' | 'marketplace' | 'account' | 'features' | 'how-it-works' | 'testimonials' | 'pricing' | 'contact' | 'home' | 'privacy-policy' | 'terms-of-service' | 'payment';

export interface PlanPurchaseContext {
    type: 'plan';
    name: 'Free' | 'Pro' | 'Premier';
    price: number; // in INR
}

export type PurchaseContext = Item | Item[] | PlanPurchaseContext | null;

export interface Review {
  id: string;
  itemId: string;
  rating: number; // 1 to 5
  comment: string;
  reviewerId: string;
  reviewerName: string;
  reviewerProfilePictureUrl?: string;
  postedDate: string;
}

export enum ItemType {
  SALE = 'For Sale',
  RENT = 'For Rent',
}

export type ItemCondition = 'New' | 'Used - Like New' | 'Used - Good' | 'Used - Fair';

export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  isNegotiable: boolean;
  category: string[];
  type: ItemType;
  imageUrl: string;
  seller: string;
  sellerId: string;
  postedDate: string;
  status: 'available' | 'sold';
  condition: ItemCondition;
}

export interface Filters {
  category: string;
  type: string[];
  priceRange: {
    min: number;
    max: number;
  };
  condition: ItemCondition[];
}

export type NotificationType = 'new_message' | 'item_sold' | 'new_review' | 'price_drop' | 'item_saved';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  relatedItemId?: string;
  relatedUserId?: string; // The user who triggered the notification
  isRead: boolean;
  timestamp: string;
}

export interface NotificationSettings {
    inApp: {
        newMessages: boolean;
        itemSold: boolean;
        newReviews: boolean;
        priceDrops: boolean;
        itemSaved: boolean;
    };
    email: {
        newMessages: boolean;
        itemSold: boolean;
        newReviews: boolean;
        priceDrops: boolean;
        itemSaved: boolean;
        weeklyDigest: boolean;
    };
}

export interface PaymentMethod {
  id: string;
  brand: 'visa' | 'mastercard' | 'google-pay';
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  email?: string; // For digital wallets like Google Pay
}

export interface Transaction {
  id: string;
  date: string;
  itemTitle: string;
  amount: number;
  currency: Currency;
  status: 'completed' | 'pending' | 'failed';
  transactionType: 'purchase' | 'rental';
  rentalDurationHours?: number;
}

export interface User {
  id:string;
  name: string;
  email: string;
  password: string; // In a real app, this would be hashed.
  schoolLevel: string;
  grade: string;
  profilePictureUrl?: string;
  reviewsReceived: Review[];
  savedItemIds: string[];
  purchasedItemIds: string[];
  bio?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  notificationSettings: NotificationSettings;
  paymentMethods: PaymentMethod[];
  transactionHistory: Transaction[];
  plan?: 'Free' | 'Pro' | 'Premier';
  martcoinBalance?: number;
  cart: string[];
}