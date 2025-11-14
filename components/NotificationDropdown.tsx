import React, { useState, useEffect, useRef, useMemo } from 'react';
import { User, Notification, NotificationType } from '../types';
import { BellIcon, StarIcon, CurrencyRupeeIcon, BookmarkIcon, ChatBubbleLeftEllipsisIcon } from './icons/Icons';

interface NotificationDropdownProps {
  user: User;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onNavigateToNotifications: () => void;
}

const formatDistanceToNow = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
};

const NotificationIcon: React.FC<{ type: NotificationType }> = ({ type }) => {
    const iconClass = "h-6 w-6";
    switch (type) {
        case 'new_review':
            return <StarIcon className={`${iconClass} text-amber-400`} />;
        case 'item_sold':
            return <CurrencyRupeeIcon className={`${iconClass} text-green-500 dark:text-green-400`} />;
        case 'item_saved':
            return <BookmarkIcon className={`${iconClass} text-primary-500 dark:text-primary-400`} filled />;
        case 'new_message':
            return <ChatBubbleLeftEllipsisIcon className={`${iconClass} text-sky-500 dark:text-sky-400`} />;
        default:
            return <BellIcon className={`${iconClass} text-slate-500 dark:text-slate-400`} />;
    }
};

export const NotificationDropdown: React.FC<NotificationDropdownProps> = React.memo(({ user, notifications, onMarkAsRead, onNavigateToNotifications }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const userNotifications = useMemo(() => {
        return notifications
            .filter(n => n.userId === user.id)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [notifications, user.id]);

    const unreadCount = useMemo(() => userNotifications.filter(n => !n.isRead).length, [userNotifications]);
    const recentNotifications = useMemo(() => userNotifications.slice(0, 5), [userNotifications]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleNotificationClick = (notificationId: string) => {
        onMarkAsRead(notificationId);
        // In a real app, you might navigate to the item/review/message
    };
    
    const handleViewAllClick = () => {
        setIsOpen(false);
        onNavigateToNotifications();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950 focus:ring-primary-500"
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-label={`Notifications (${unreadCount} unread)`}
            >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-950" />
                )}
            </button>

            {isOpen && (
                <div
                    className="origin-top-right absolute right-0 mt-2 w-80 rounded-xl shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg ring-1 ring-slate-200 dark:ring-slate-700 focus:outline-none z-50"
                    role="menu"
                    aria-orientation="vertical"
                >
                    <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h3>
                        {unreadCount > 0 && <span className="text-xs bg-primary-500 text-white font-bold px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {recentNotifications.length > 0 ? (
                            recentNotifications.map(notification => (
                                <div
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification.id)}
                                    className={`p-3 flex items-start gap-3 transition-colors cursor-pointer ${!notification.isRead ? 'bg-primary-500/10 hover:bg-primary-500/20' : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
                                >
                                    <div className="flex-shrink-0 pt-1">
                                        <NotificationIcon type={notification.type} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-800 dark:text-slate-200 leading-tight">{notification.message}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{formatDistanceToNow(notification.timestamp)}</p>
                                    </div>
                                    {!notification.isRead && (
                                        <div className="w-2.5 h-2.5 bg-sky-400 rounded-full flex-shrink-0 mt-1.5" />
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">You're all caught up!</p>
                        )}
                    </div>
                    <div className="p-2 border-t border-slate-200 dark:border-slate-700">
                        <button onClick={handleViewAllClick} className="w-full text-center text-sm font-semibold text-primary-500 dark:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-md py-2 transition-colors">
                            View All Notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
});