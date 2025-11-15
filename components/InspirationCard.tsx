import React from 'react';
import { InspirationalPerson } from '../types';

interface InspirationCardProps {
    person: InspirationalPerson;
    onClick: () => void;
}

const categoryColors: { [key in InspirationalPerson['category']]: string } = {
    'Historical Pioneers': 'bg-blue-500',
    'Modern Innovators': 'bg-sky-500',
    'Nobel Laureates': 'bg-indigo-500',
    'Rising Stars': 'bg-purple-500',
};

// Simple hash function to generate a color from a string
const stringToColor = (str: string): string => {
    let hash = 0;
    if (!str) return 'hsl(220, 30%, 60%)';
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 30%, 60%)`; // Desaturated colors
    return color;
};


const InspirationCard: React.FC<InspirationCardProps> = ({ person, onClick }) => {
    const avatarColor = stringToColor(person.name);
    const initial = person.name ? person.name.charAt(0).toUpperCase() : '?';

    return (
        <div
            onClick={onClick}
            className="bg-white border border-gray-200 rounded-xl cursor-pointer group hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg overflow-hidden aspect-[3/4]"
        >
            <div className="relative w-full h-full">
                 {person.photoUrl ? (
                    <img 
                        src={person.photoUrl} 
                        alt={person.name} 
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105" style={{ backgroundColor: avatarColor }}>
                        <span className="text-8xl font-bold text-white opacity-50">{initial}</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                
                <span className={`absolute top-3 right-3 px-2 py-0.5 text-xs font-semibold text-white rounded-full ${categoryColors[person.category] || 'bg-gray-500'}`}>
                    {person.category}
                </span>

                <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-xl font-bold [text-shadow:0_1px_3px_rgb(0_0_0_/_0.5)]">{person.name}</h3>
                    <p className="text-sm font-medium text-gray-200 [text-shadow:0_1px_3px_rgb(0_0_0_/_0.5)]">{person.field}</p>
                </div>
            </div>
        </div>
    );
};

export default InspirationCard;
