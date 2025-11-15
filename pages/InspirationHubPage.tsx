import React, { useState, useEffect, useMemo } from 'react';
import { InspirationalPerson } from '../types';
import { getInspirations } from '../services/dataService';
import { getRealtimeInspiration } from '../services/geminiService';
import { LightbulbIcon, SparklesIcon, SearchIcon } from '../components/icons';
import InspirationModal from '../components/InspirationModal';
import InspirationCard from '../components/InspirationCard';

const CATEGORIES: InspirationalPerson['category'][] = ['Historical Pioneers', 'Modern Innovators', 'Nobel Laureates', 'Rising Stars'];

const InspirationCardSkeleton: React.FC = () => (
    <div className="bg-white border border-gray-200 rounded-xl flex flex-col shadow-sm overflow-hidden">
        <div className="relative h-48 bg-gray-300 animate-pulse"></div>
        <div className="p-4 flex flex-col flex-grow">
            <div className="h-6 w-3/4 bg-gray-300 rounded-md animate-pulse mb-2"></div>
            <div className="h-4 w-1/2 bg-gray-300 rounded-md animate-pulse mb-3 flex-grow"></div>
            <div className="h-5 w-28 bg-gray-300 rounded-full animate-pulse self-start mt-auto"></div>
        </div>
    </div>
);


const InspirationHubPage: React.FC = () => {
    const [inspirations, setInspirations] = useState<InspirationalPerson[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPerson, setSelectedPerson] = useState<InspirationalPerson | null>(null);

    const [categoryFilter, setCategoryFilter] = useState('All');
    const [fieldFilter, setFieldFilter] = useState('All');
    
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const data = await getInspirations();
            setInspirations(data);
            setIsLoading(false);
        };
        loadData();
    }, []);

    const uniqueFields = useMemo(() => {
        const fields = new Set(inspirations.map(p => p.field));
        return ['All', ...Array.from(fields)];
    }, [inspirations]);

    const filteredInspirations = useMemo(() => {
        return inspirations.filter(person => {
            const categoryMatch = categoryFilter === 'All' || person.category === categoryFilter;
            const fieldMatch = fieldFilter === 'All' || person.field === fieldFilter;
            return categoryMatch && fieldMatch;
        });
    }, [inspirations, categoryFilter, fieldFilter]);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim()) return;
    
        setIsSearching(true);
        setSearchError(null);
        setSelectedPerson(null);
    
        const result = await getRealtimeInspiration(searchQuery);
        if (result) {
            setSelectedPerson(result);
        } else {
            setSearchError(`Could not find an inspiration for "${searchQuery}". Please try another search.`);
        }
        setIsSearching(false);
    };

    const handleRandomInspiration = async () => {
        setIsSearching(true);
        setSearchError(null);
        setSelectedPerson(null);
    
        const result = await getRealtimeInspiration("a surprising and inspirational woman in any STEM field");
        if (result) {
            setSelectedPerson(result);
        } else {
            setSearchError("Sorry, I couldn't find a surprise inspiration right now. Please try again.");
        }
        setIsSearching(false);
    };

    return (
        <div className="animate-fade-in-up space-y-8">
            {selectedPerson && <InspirationModal person={selectedPerson} onClose={() => setSelectedPerson(null)} />}

            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-sky-100 rounded-2xl border border-blue-200 shadow-lg">
                <LightbulbIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Inspiration Hub</h1>
                <p className="text-gray-600 mt-2 max-w-3xl mx-auto">Discover the stories of pioneering women who changed the world with their work in STEM.</p>
            </div>

            <div className="p-4 bg-sky-50/80 rounded-xl border border-gray-200 space-y-4 sticky top-20 md:top-4 z-10 backdrop-blur-sm">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full lg:col-span-1 bg-white border border-gray-300 rounded-md py-2.5 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="All">All Categories</option>
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <select
                        value={fieldFilter}
                        onChange={(e) => setFieldFilter(e.target.value)}
                        className="w-full lg:col-span-1 bg-white border border-gray-300 rounded-md py-2.5 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {uniqueFields.map(field => <option key={field} value={field}>{field}</option>)}
                    </select>
                    <div className="lg:col-span-3 flex flex-col sm:flex-row gap-4">
                        <form onSubmit={handleSearch} className="flex-grow flex gap-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for a name or field (e.g., 'cryptography')"
                                className="w-full bg-white border border-gray-300 rounded-md py-2.5 px-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isSearching}
                            />
                            <button
                                type="submit"
                                disabled={isSearching || !searchQuery.trim()}
                                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                <SearchIcon className="w-5 h-5" />
                                <span className="hidden md:inline">Search</span>
                            </button>
                        </form>
                        <button
                            onClick={handleRandomInspiration}
                            disabled={isSearching}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                            <SparklesIcon className="w-5 h-5" />
                            Surprise Me!
                        </button>
                    </div>
                </div>
                 {isSearching && <p className="text-center text-sm text-gray-600 animate-pulse">Searching for inspiration...</p>}
                 {searchError && <p className="text-center text-sm text-red-600">{searchError}</p>}
            </div>

            <div>
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => <InspirationCardSkeleton key={i} />)}
                    </div>
                ) : (
                    filteredInspirations.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredInspirations.map(person => (
                                <InspirationCard
                                    key={person.id}
                                    person={person}
                                    onClick={() => setSelectedPerson(person)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-8 bg-white rounded-xl border border-gray-200">
                            <p className="text-gray-800 font-semibold text-lg">No Profiles Found</p>
                            <p className="text-gray-600 mt-1">Try adjusting your filter criteria.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default InspirationHubPage;
