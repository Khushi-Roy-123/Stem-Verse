import React, { useState, useRef, useEffect } from 'react';
import { User, Mood, WellbeingEntry, ChatMessage } from '../types';
import { getWellbeingSuggestion, chatWithAura } from '../services/geminiService';
import { HeartbeatIcon, SparklesIcon, SendIcon, UserIcon, ChatIcon } from '../components/icons';
import MarkdownRenderer from '../components/MarkdownRenderer';

interface WellbeingHubPageProps {
    currentUser: User;
    onUpdateUser: (user: User) => void;
}

const moodOptions: { mood: Mood; label: string; emoji: string; color: string }[] = [
    { mood: 'great', label: "Great", emoji: "😊", color: 'border-green-400 bg-green-50 hover:bg-green-100' },
    { mood: 'okay', label: "Okay", emoji: "🙂", color: 'border-blue-400 bg-blue-50 hover:bg-blue-100' },
    { mood: 'stressed', label: "Stressed", emoji: "😟", color: 'border-yellow-500 bg-yellow-50 hover:bg-yellow-100' },
    { mood: 'overwhelmed', label: "Overwhelmed", emoji: "😩", color: 'border-red-400 bg-red-50 hover:bg-red-100' },
];

const WellbeingHubPage: React.FC<WellbeingHubPageProps> = ({ currentUser, onUpdateUser }) => {
    const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
    
    const [auraMessages, setAuraMessages] = useState<ChatMessage[]>([]);
    const [auraInput, setAuraInput] = useState('');
    const [isAuraLoading, setIsAuraLoading] = useState(false);
    const auraMessagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        auraMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [auraMessages]);

    const handleMoodCheckIn = async (mood: Mood) => {
        setIsLoadingSuggestion(true);
        setAiSuggestion(null);

        const newEntry: WellbeingEntry = { mood, date: new Date().toISOString() };
        const updatedHistory = [newEntry, ...(currentUser.wellbeingHistory || [])];
        
        const updatedUser: User = { ...currentUser, wellbeingHistory: updatedHistory };
        onUpdateUser(updatedUser);

        const suggestion = await getWellbeingSuggestion(mood, updatedHistory);
        setAiSuggestion(suggestion);
        setIsLoadingSuggestion(false);
    };

    const handleAuraChatSend = async () => {
        if (auraInput.trim() === '' || isAuraLoading) return;
        
        const userMessage: ChatMessage = { role: 'user', text: auraInput };
        const newMessages = [...auraMessages, userMessage];
        setAuraMessages(newMessages);
        setAuraInput('');
        setIsAuraLoading(true);

        const responseText = await chatWithAura(newMessages);
        
        const modelMessage: ChatMessage = { role: 'model', text: responseText };
        setAuraMessages(prev => [...prev, modelMessage]);
        setIsAuraLoading(false);
    };
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          handleAuraChatSend();
        }
    };


    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    return (
        <div className="animate-fade-in-up space-y-8 max-w-4xl mx-auto">
            <div className="text-center">
                <HeartbeatIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Wellbeing Hub</h1>
                <p className="text-gray-600 mt-2">Take a moment to check in with yourself. Your mental health is a priority.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">How are you feeling today?</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {moodOptions.map(({ mood, label, emoji, color }) => (
                        <button
                            key={mood}
                            onClick={() => handleMoodCheckIn(mood)}
                            disabled={isLoadingSuggestion}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 ${color}`}
                        >
                            <span className="text-4xl mb-2">{emoji}</span>
                            <span className="font-semibold text-gray-700">{label}</span>
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                    <SparklesIcon className="w-7 h-7 text-blue-500" />
                    A Mindful Moment for You
                </h2>
                {isLoadingSuggestion && (
                     <div className="flex items-center space-x-2 text-gray-500">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        <span>Generating a suggestion...</span>
                    </div>
                )}
                {!isLoadingSuggestion && aiSuggestion && (
                    <p className="text-gray-700 bg-blue-50/50 p-4 rounded-lg border border-blue-200">{aiSuggestion}</p>
                )}
                 {!isLoadingSuggestion && !aiSuggestion && (
                    <p className="text-gray-500">Your personalized suggestion will appear here after you check in.</p>
                 )}
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                    <ChatIcon className="w-7 h-7 text-blue-500" />
                    Talk it Out with Aura
                </h2>
                <div className="h-96 flex flex-col">
                    <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4 space-y-4 no-scrollbar border border-gray-200">
                        {auraMessages.length === 0 && (
                            <div className="flex items-start gap-3 animate-fade-in">
                                <div className="w-9 h-9 flex-shrink-0 rounded-full bg-blue-500 flex items-center justify-center">
                                    <HeartbeatIcon className="w-5 h-5 text-white"/>
                                </div>
                                <div className="max-w-xl p-3 rounded-lg bg-gray-200 text-gray-800 rounded-bl-none shadow-sm">
                                    <p>If you need to talk, I'm here to listen. Share what's on your mind.</p>
                                </div>
                            </div>
                        )}
                        {auraMessages.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                {msg.role === 'model' && (
                                    <div className="w-9 h-9 flex-shrink-0 rounded-full bg-blue-500 flex items-center justify-center">
                                        <HeartbeatIcon className="w-5 h-5 text-white"/>
                                    </div>
                                )}
                                <div className={`max-w-xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
                                    {msg.role === 'model' ? <MarkdownRenderer content={msg.text} /> : <p className="whitespace-pre-wrap">{msg.text}</p>}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-9 h-9 flex-shrink-0 rounded-full bg-gray-300 flex items-center justify-center">
                                        <UserIcon className="w-5 h-5 text-gray-700"/>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isAuraLoading && (
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 flex-shrink-0 rounded-full bg-blue-500 flex items-center justify-center">
                                    <HeartbeatIcon className="w-5 h-5 text-white"/>
                                </div>
                                <div className="max-w-xl p-3 rounded-lg bg-gray-200 text-gray-800 rounded-bl-none">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={auraMessagesEndRef} />
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center bg-white rounded-full p-2 border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 transition-all shadow-sm">
                            <input
                                type="text"
                                value={auraInput}
                                onChange={(e) => setAuraInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Share your thoughts..."
                                className="w-full bg-transparent px-4 py-2 text-gray-800 placeholder-gray-500 focus:outline-none"
                                disabled={isAuraLoading}
                            />
                            <button
                                onClick={handleAuraChatSend}
                                disabled={isAuraLoading || auraInput.trim() === ''}
                                className="p-3 rounded-full bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-all"
                            >
                                <SendIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                 <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Check-ins</h2>
                 {currentUser.wellbeingHistory && currentUser.wellbeingHistory.length > 0 ? (
                    <ul className="space-y-3">
                        {currentUser.wellbeingHistory.slice(0, 7).map((entry, index) => {
                            const moodInfo = moodOptions.find(m => m.mood === entry.mood);
                            return (
                                <li key={index} className="flex items-center justify-between p-3 bg-gray-100/60 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{moodInfo?.emoji}</span>
                                        <span className="font-medium text-gray-700 capitalize">{entry.mood}</span>
                                    </div>
                                    <span className="text-sm text-gray-500">{formatDate(entry.date)}</span>
                                </li>
                            );
                        })}
                    </ul>
                 ) : (
                    <p className="text-gray-500 text-center py-4">You have no check-ins yet. Log your mood above to get started!</p>
                 )}
            </div>
        </div>
    );
};

export default WellbeingHubPage;