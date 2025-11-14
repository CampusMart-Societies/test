import React, { useState, useMemo } from 'react';
import { User, Notification, NotificationType, NotificationSettings } from '../../types';
import { Button } from '../Button';
import { BellIcon, StarIcon, CurrencyRupeeIcon, BookmarkIcon, ChatBubbleLeftEllipsisIcon } from '../icons/Icons';

interface NotificationsSectionProps {
  user: User;
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onUpdateSettings: (settings: NotificationSettings) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
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
    const iconClass = "h-5 w-5";
    switch (type) {
        case 'new_review':
            return <StarIcon className={`${iconClass} text-amber-400`} />;
        case 'item_sold':
            return <CurrencyRupeeIcon className={`${iconClass} text-green-400`} />;
        case 'item_saved':
            return <BookmarkIcon className={`${iconClass} text-primary-400`} filled />;
        case 'new_message':
            return <ChatBubbleLeftEllipsisIcon className={`${iconClass} text-sky-400`} />;
        default:
            return <BellIcon className={`${iconClass} text-slate-400`} />;
    }
};

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; label: string }> = ({ checked, onChange, label }) => (
    <label htmlFor={label} className="flex items-center cursor-pointer">
        <div className="relative">
            <input id={label} type="checkbox" className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)} />
            <div className={`block w-10 h-6 rounded-full transition-colors ${checked ? 'bg-primary-500' : 'bg-slate-600'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-4' : ''}`}></div>
        </div>
    </label>
);

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({ user, notifications, onMarkAsRead, onMarkAllAsRead, onClearAll, onUpdateSettings, showToast }) => {
    const [activeTab, setActiveTab] = useState<'activity' | 'settings'>('activity');
    const [settings, setSettings] = useState(user.notificationSettings);

    const handleSettingsChange = <K extends keyof NotificationSettings, T extends keyof NotificationSettings[K]>(
        category: K,
        type: T,
        value: boolean
    ) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [type]: value,
            }
        }));
    };

    const handleSaveChanges = () => {
        onUpdateSettings(settings);
    };

    const sortedNotifications = useMemo(() => {
        return [...notifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [notifications]);

    return (
        <div>
            <div className="border-b border-slate-700 flex items-center mb-6">
                <button
                    onClick={() => setActiveTab('activity')}
                    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'activity' ? 'text-primary-400 border-primary-400' : 'text-slate-400 border-transparent hover:text-white'}`}
                >
                    Activity
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'settings' ? 'text-primary-400 border-primary-400' : 'text-slate-400 border-transparent hover:text-white'}`}
                >
                    Settings
                </button>
            </div>

            {activeTab === 'activity' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                        {notifications.length > 0 && (
                            <div className="flex gap-2">
                                <Button variant="secondary" onClick={onMarkAllAsRead} className="!px-3 !py-1.5">Mark all as read</Button>
                                <Button variant="ghost" onClick={onClearAll} className="!px-3 !py-1.5 text-red-400/80 hover:bg-red-500/10 hover:text-red-400">Clear all</Button>
                            </div>
                        )}
                    </div>

                    {sortedNotifications.length > 0 ? (
                        <div className="space-y-2">
                            {sortedNotifications.map(notification => (
                                <div
                                    key={notification.id}
                                    onClick={() => onMarkAsRead(notification.id)}
                                    className={`flex items-center gap-4 p-4 rounded-lg transition-colors cursor-pointer ${!notification.isRead ? 'bg-primary-500/10 hover:bg-primary-500/20' : 'hover:bg-slate-800/50'}`}
                                >
                                    {!notification.isRead && <div className="w-2 h-2 bg-sky-400 rounded-full flex-shrink-0" />}
                                    <div className={`flex-shrink-0 ${notification.isRead && 'ml-[12px]'}`}><NotificationIcon type={notification.type} /></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-200 truncate">{notification.message}</p>
                                    </div>
                                    <div className="text-xs text-slate-500 flex-shrink-0">{formatDistanceToNow(notification.timestamp)}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-slate-400 py-16 bg-slate-900/50 border-2 border-dashed border-slate-700/50 rounded-xl">
                            <p className="font-medium">You have no notifications.</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'settings' && (
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Notification Settings</h3>
                    <div className="space-y-8">
                        {/* In-App Notifications */}
                        <div>
                            <h4 className="text-lg font-semibold text-slate-100 mb-3">In-App Notifications</h4>
                            <div className="divide-y divide-slate-700">
                                <div className="flex justify-between items-center py-3"><p>New Messages</p><ToggleSwitch checked={settings.inApp.newMessages} onChange={v => handleSettingsChange('inApp', 'newMessages', v)} label="in-app-new-messages"/></div>
                                <div className="flex justify-between items-center py-3"><p>Item Sold</p><ToggleSwitch checked={settings.inApp.itemSold} onChange={v => handleSettingsChange('inApp', 'itemSold', v)} label="in-app-item-sold"/></div>
                                <div className="flex justify-between items-center py-3"><p>New Reviews</p><ToggleSwitch checked={settings.inApp.newReviews} onChange={v => handleSettingsChange('inApp', 'newReviews', v)} label="in-app-new-reviews"/></div>
                                <div className="flex justify-between items-center py-3"><p>Price Drops</p><ToggleSwitch checked={settings.inApp.priceDrops} onChange={v => handleSettingsChange('inApp', 'priceDrops', v)} label="in-app-price-drops"/></div>
                                <div className="flex justify-between items-center py-3"><p>Item Saved by Others</p><ToggleSwitch checked={settings.inApp.itemSaved} onChange={v => handleSettingsChange('inApp', 'itemSaved', v)} label="in-app-item-saved"/></div>
                            </div>
                        </div>

                        {/* Email Notifications */}
                        <div>
                            <h4 className="text-lg font-semibold text-slate-100 mb-3">Email Notifications</h4>
                            <div className="divide-y divide-slate-700">
                                <div className="flex justify-between items-center py-3"><p>New Messages</p><ToggleSwitch checked={settings.email.newMessages} onChange={v => handleSettingsChange('email', 'newMessages', v)} label="email-new-messages"/></div>
                                <div className="flex justify-between items-center py-3"><p>Item Sold</p><ToggleSwitch checked={settings.email.itemSold} onChange={v => handleSettingsChange('email', 'itemSold', v)} label="email-item-sold"/></div>
                                <div className="flex justify-between items-center py-3"><p>New Reviews</p><ToggleSwitch checked={settings.email.newReviews} onChange={v => handleSettingsChange('email', 'newReviews', v)} label="email-new-reviews"/></div>
                                <div className="flex justify-between items-center py-3"><p>Price Drops</p><ToggleSwitch checked={settings.email.priceDrops} onChange={v => handleSettingsChange('email', 'priceDrops', v)} label="email-price-drops"/></div>
                                <div className="flex justify-between items-center py-3"><p>Campusmart Weekly Digest</p><ToggleSwitch checked={settings.email.weeklyDigest} onChange={v => handleSettingsChange('email', 'weeklyDigest', v)} label="email-weekly-digest"/></div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-700 flex justify-end">
                        <Button onClick={handleSaveChanges}>Save Changes</Button>
                    </div>
                </div>
            )}
        </div>
    );
};