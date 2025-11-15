import React from 'react';

// Simple hash function to generate a color from a string
const stringToColor = (str: string): string => {
    let hash = 0;
    if (!str) return 'hsl(220, 50%, 60%)'; // Default color for null/undefined username
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 50%, 60%)`;
    return color;
};

interface UserAvatarProps {
    username: string;
    className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ username, className = '' }) => {
    const initial = username ? username.charAt(0).toUpperCase() : '?';
    const bgColor = stringToColor(username);

    return (
        <div
            className={`flex items-center justify-center rounded-full font-bold text-white flex-shrink-0 ${className}`}
            style={{ backgroundColor: bgColor }}
            title={username}
        >
            {initial}
        </div>
    );
};

export default UserAvatar;
