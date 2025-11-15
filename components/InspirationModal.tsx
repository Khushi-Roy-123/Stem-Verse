import React, { useEffect, useState } from 'react';
import { InspirationalPerson } from '../types';
import { CloseIcon, ExternalLinkIcon, ShareIcon, TwitterIcon, WikipediaIcon, TrophyIcon, MedalIcon } from './icons';

interface InspirationModalProps {
    person: InspirationalPerson;
    onClose: () => void;
}

// Simple hash function to generate a color from a string
const stringToColor = (str: string): string => {
    let hash = 0;
    if (!str) return 'hsl(220, 30%, 60%)';
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 40%, 55%)`;
    return color;
};


const InspirationModal: React.FC<InspirationModalProps> = ({ person, onClose }) => {
    const [shareSuccess, setShareSuccess] = useState<string | null>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = 'auto';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const handleShare = async () => {
        const shareData = {
            title: `Discover ${person.name} on STEMVerse`,
            text: `Learn about ${person.name}, a pioneer in ${person.field}. ${person.quote}`,
            url: window.location.href, // Or a direct link if you had profile pages
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
            setShareSuccess('Link copied!');
            setTimeout(() => setShareSuccess(null), 3000);
        }
    };

    const getYoutubeVideoId = (url: string): string | null => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = person.videoUrl ? getYoutubeVideoId(person.videoUrl) : null;
    
    const socialLinks = Object.entries(person.links || {}).map(([key, url]) => {
        if (!url) return null;
        switch(key) {
            case 'wikipedia': return { name: 'Wikipedia', url, Icon: WikipediaIcon };
            case 'twitter': return { name: 'Twitter', url, Icon: TwitterIcon };
            case 'website': return { name: 'Website', url, Icon: ExternalLinkIcon };
            default: return null;
        }
    }).filter(Boolean);
    
    const avatarColor = stringToColor(person.name);
    const initial = person.name ? person.name.charAt(0).toUpperCase() : '?';

    return (
        <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="inspiration-modal-title"
        >
            <div 
                className="bg-white border border-gray-200 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Left Side (Image & Basic Info) */}
                <div className="w-full md:w-1/3 bg-gray-50 p-6 flex flex-col items-center text-center flex-shrink-0 border-r border-gray-200">
                     {person.photoUrl ? (
                        <img 
                            src={person.photoUrl}
                            alt={person.name}
                            className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg mb-4"
                        />
                     ) : (
                        <div 
                            className="w-40 h-40 rounded-full flex items-center justify-center border-4 border-white shadow-lg mb-4"
                            style={{ backgroundColor: avatarColor }}
                        >
                            <span className="text-7xl font-bold text-white">{initial}</span>
                        </div>
                    )}
                    <h2 id="inspiration-modal-title" className="text-3xl font-bold text-gray-900">{person.name}</h2>
                    <p className="text-blue-600 font-medium">{person.field}</p>
                    <p className="text-sm text-gray-500 mt-1">{person.category}</p>
                    
                    <div className="flex items-center justify-center gap-3 mt-6">
                        <button onClick={handleShare} className="p-2.5 rounded-full text-gray-500 hover:bg-gray-200 hover:text-blue-600 transition-colors" aria-label="Share story">
                            <ShareIcon className="w-6 h-6"/>
                        </button>
                        {socialLinks.map(link => link && (
                             <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full text-gray-500 hover:bg-gray-200 hover:text-blue-600 transition-colors" aria-label={`View ${person.name}'s ${link.name}`}>
                                <link.Icon className="w-6 h-6" />
                            </a>
                        ))}
                    </div>
                    {shareSuccess && <p className="text-xs text-blue-500 mt-2 animate-fade-in">{shareSuccess}</p>}
                </div>

                {/* Right Side (Details) */}
                <div className="w-full md:w-2/3 p-6 md:p-8 overflow-y-auto no-scrollbar relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800" aria-label="Close modal">
                        <CloseIcon className="w-6 h-6"/>
                    </button>
                    
                    <blockquote className="border-l-4 border-blue-400 pl-4 my-6">
                        <p className="text-xl italic text-gray-600">"{person.quote}"</p>
                    </blockquote>
                    
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-2">About</h3>
                            <p className="text-gray-600 leading-relaxed text-base">{person.bio}</p>
                        </div>

                         {videoId && (
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-2">Watch a Feature</h3>
                                <div className="aspect-w-16 aspect-h-9">
                                    <iframe 
                                        className="w-full h-full rounded-lg"
                                        src={`https://www.youtube.com/embed/${videoId}`}
                                        title={`YouTube video player for ${person.name}`}
                                        frameBorder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        )}

                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-2">Major Achievements</h3>
                            <ul className="text-gray-600 space-y-2 mt-3">
                                {person.majorAchievements.map((ach, i) => <li key={i} className="flex items-start gap-3"><TrophyIcon className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" /><span>{ach}</span></li>)}
                            </ul>
                        </div>
                        
                        {person.awards.length > 0 && (
                             <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-2">Notable Awards</h3>
                                <ul className="text-gray-600 space-y-2 mt-3">
                                    {person.awards.map((award, i) => <li key={i} className="flex items-start gap-3"><MedalIcon className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" /><span>{award}</span></li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InspirationModal;
