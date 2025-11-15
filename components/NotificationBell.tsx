import React, { useState, useEffect, useRef } from 'react';
import { User, Notification } from '../types';
import { NotificationIcon, CloseIcon } from './icons';

interface NotificationBellProps {
    user: User;
    onNotificationClick: (notification: Notification) => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ user, onNotificationClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const unreadCount = user.notifications?.filter(n => !n.read).length || 0;

    const timeSince = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "m ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "min ago";
        return "just now";
    };

    // Close dropdown when clicking outside
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

    const handleItemClick = (notification: Notification) => {
        onNotificationClick(notification);
        setIsOpen(false);
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-white transition-colors"
                aria-label="Open notifications"
            >
                <NotificationIcon className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 text-white text-xs items-center justify-center">{unreadCount}</span>
                    </span>
                )}
            </button>
            {isOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-80 bg-white border border-gray-200 rounded-lg shadow-2xl z-50 animate-fade-in-up">
                    <div className="flex justify-between items-center p-3 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                         <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800">
                            <CloseIcon className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {user.notifications && user.notifications.length > 0 ? (
                            user.notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    onClick={() => handleItemClick(notification)}
                                    className={`p-3 flex items-start gap-3 hover:bg-gray-100 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                                >
                                    {!notification.read && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>}
                                    <div className={`flex-1 ${notification.read ? 'pl-5' : ''}`}>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-bold">{notification.replier}</span> replied to your post: "{notification.postTitle.substring(0, 30)}..."
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">{timeSince(notification.createdAt)}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="p-4 text-center text-sm text-gray-500">No notifications yet.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;