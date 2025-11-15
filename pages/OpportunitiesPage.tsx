
import React, { useState, useEffect, useMemo } from 'react';
import { Opportunity, User } from '../types';
import { getOpportunities } from '../services/dataService';
import { BriefcaseIcon, BookmarkIcon, CloseIcon } from '../components/icons';
import { parseDeadline } from '../utils/dateHelper';

const CATEGORIES: Opportunity['category'][] = ['Scholarship', 'Internship', 'Grant', 'Conference'];
const DEADLINES = ['All', 'This Month', 'Next 3 Months', 'Next 6 Months', 'Ongoing'];
const FIELDS: Opportunity['field'][] = ['Computer Science', 'Engineering', 'Data Science', 'All STEM'];
const SORTS = ['Deadline (Nearest First)', 'Alphabetical', 'Recently Added'];

const categoryColors: { [key in Opportunity['category']]: string } = {
    Scholarship: 'bg-blue-50 text-blue-700 border-blue-200/50',
    Internship: 'bg-sky-50 text-sky-700 border-sky-200/50',
    Grant: 'bg-indigo-50 text-indigo-700 border-indigo-200/50',
    Conference: 'bg-purple-50 text-purple-700 border-purple-200/50',
};

interface OpportunityCardProps {
    opportunity: Opportunity;
    isBookmarked: boolean;
    onToggleBookmark: (title: string) => void;
}

const OpportunityCardSkeleton: React.FC = () => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col">
        <div className="flex justify-between items-start mb-3">
            <div className="h-5 w-24 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
        <div className="h-6 w-3/4 bg-gray-300 rounded-md animate-pulse mb-2"></div>
        <div className="h-4 w-1/2 bg-gray-300 rounded-md animate-pulse mb-4"></div>
        <div className="space-y-2 mb-4 flex-grow">
            <div className="h-4 w-full bg-gray-300 rounded-md animate-pulse"></div>
            <div className="h-4 w-5/6 bg-gray-300 rounded-md animate-pulse"></div>
        </div>
        <div className="h-10 w-full bg-gray-300 rounded-lg animate-pulse mt-auto"></div>
    </div>
);


const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, isBookmarked, onToggleBookmark }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 relative shadow-sm">
        <button 
            onClick={() => onToggleBookmark(opportunity.title)}
            className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 transition-colors"
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
            <BookmarkIcon className={`w-6 h-6 ${isBookmarked ? 'fill-current text-blue-600' : 'fill-none'}`} />
        </button>
        <div className="flex justify-between items-start mb-3">
            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${categoryColors[opportunity.category]}`}>
                {opportunity.category}
            </span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-1 pr-8">{opportunity.title}</h3>
        <p className="text-sm font-medium text-gray-600 mb-3">{opportunity.organization}</p>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{opportunity.description}</p>
        
        <div className="space-y-3 text-sm mb-4">
            <p><strong className="font-semibold text-gray-700">Field:</strong> <span className="text-gray-600">{opportunity.field}</span></p>
            <p><strong className="font-semibold text-gray-700">Eligibility:</strong> <span className="text-gray-600">{opportunity.eligibility}</span></p>
            <p><strong className="font-semibold text-gray-700">Deadline:</strong> <span className="text-gray-600">{opportunity.deadline}</span></p>
        </div>

        <a href={opportunity.link} target="_blank" rel="noopener noreferrer" className="mt-auto inline-block text-center w-full px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
            Apply Now
        </a>
    </div>
);

interface OpportunitiesPageProps {
    currentUser: User;
    onUpdateUser: (user: User) => void;
}

const OpportunitiesPage: React.FC<OpportunitiesPageProps> = ({ currentUser, onUpdateUser }) => {
    const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedDeadline, setSelectedDeadline] = useState('All');
    const [selectedField, setSelectedField] = useState('All');
    const [showSavedOnly, setShowSavedOnly] = useState(false);
    const [sortOption, setSortOption] = useState(SORTS[0]);
    
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const data = await getOpportunities();
            setAllOpportunities(data);
            setIsLoading(false);
        };
        loadData();
    }, []);

    const filteredOpportunities = useMemo(() => {
        const now = new Date();
        let result = allOpportunities;

        if (showSavedOnly) result = result.filter(op => currentUser.savedOpportunities.includes(op.title));
        if (selectedCategory !== 'All') result = result.filter(op => op.category === selectedCategory);
        if (selectedField !== 'All') result = result.filter(op => op.field === selectedField);
        if (selectedDeadline !== 'All') {
             if (selectedDeadline === 'Ongoing') {
                result = result.filter(op => ['rolling', 'varies'].some(keyword => op.deadline.toLowerCase().includes(keyword)));
            } else {
                const monthsToAdd = { 'This Month': 1, 'Next 3 Months': 3, 'Next 6 Months': 6 }[selectedDeadline] || 0;
                const endDate = new Date(now);
                endDate.setMonth(now.getMonth() + monthsToAdd);
                result = result.filter(op => {
                    const deadlineDate = parseDeadline(op.deadline);
                    return deadlineDate && deadlineDate >= now && deadlineDate <= endDate;
                });
            }
        }
        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase();
            result = result.filter(op =>
                op.title.toLowerCase().includes(lowercasedTerm) ||
                op.organization.toLowerCase().includes(lowercasedTerm) ||
                op.description.toLowerCase().includes(lowercasedTerm)
            );
        }

        const sortedResult = [...result];
        if (sortOption === 'Alphabetical') {
            sortedResult.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortOption === 'Deadline (Nearest First)') {
             sortedResult.sort((a, b) => {
                const dateA = parseDeadline(a.deadline);
                const dateB = parseDeadline(b.deadline);
                if (dateA && dateB) return dateA.getTime() - dateB.getTime();
                if (dateA) return -1;
                if (dateB) return 1;
                return 0;
            });
        }
        return sortedResult;
    }, [searchTerm, selectedCategory, selectedDeadline, selectedField, showSavedOnly, sortOption, allOpportunities, currentUser.savedOpportunities]);

    const handleToggleBookmark = (title: string) => {
        const saved = currentUser.savedOpportunities || [];
        const isSaved = saved.includes(title);
        const newSaved = isSaved ? saved.filter(t => t !== title) : [...saved, title];
        onUpdateUser({ ...currentUser, savedOpportunities: newSaved });
    };

    const activeFilters = [
        { type: 'category', value: selectedCategory, label: 'Category' },
        { type: 'deadline', value: selectedDeadline, label: 'Deadline' },
        { type: 'field', value: selectedField, label: 'Field' },
        { type: 'saved', value: showSavedOnly, label: 'Saved' }
    ].filter(f => f.value && f.value !== 'All');

    const removeFilter = (type: string) => {
        if (type === 'category') setSelectedCategory('All');
        if (type === 'deadline') setSelectedDeadline('All');
        if (type === 'field') setSelectedField('All');
        if (type === 'saved') setShowSavedOnly(false);
    };

    return (
        <div className="animate-fade-in-up space-y-8">
            <div className="text-center">
                <BriefcaseIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Opportunities Hub</h1>
                <p className="text-gray-600 mt-2">Discover scholarships, internships, grants, and more to advance your career.</p>
            </div>

            <div className="p-4 bg-sky-50/80 rounded-xl border border-gray-200 space-y-4 sticky top-20 md:top-4 z-10 backdrop-blur-sm">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     <input
                        type="text"
                        placeholder="Search by keyword..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-md py-2.5 px-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full bg-white border border-gray-300 rounded-md py-2.5 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="All">All Categories</option>
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <select value={selectedDeadline} onChange={(e) => setSelectedDeadline(e.target.value)} className="w-full bg-white border border-gray-300 rounded-md py-2.5 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                         {DEADLINES.map(d => <option key={d} value={d}>{d === 'All' ? 'Any Deadline' : d}</option>)}
                    </select>
                     <select value={selectedField} onChange={(e) => setSelectedField(e.target.value)} className="w-full bg-white border border-gray-300 rounded-md py-2.5 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="All">All Fields</option>
                        {FIELDS.map(field => <option key={field} value={field}>{field}</option>)}
                    </select>
                </div>
                 <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" checked={showSavedOnly} onChange={(e) => setShowSavedOnly(e.target.checked)} className="form-checkbox h-5 w-5 bg-gray-200 border-gray-400 rounded text-blue-600 focus:ring-blue-500" />
                            <span className="text-sm font-medium text-gray-700">Show Saved Only</span>
                        </label>
                        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="w-full md:w-auto bg-white border border-gray-300 rounded-md py-1.5 px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                           {SORTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
                {activeFilters.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-200">
                        <span className="text-sm font-medium text-gray-600">Active Filters:</span>
                        {activeFilters.map(filter => (
                            <span key={filter.type} className="flex items-center bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                                {filter.label}: {filter.type === 'saved' ? 'Yes' : filter.value}
                                <button onClick={() => removeFilter(filter.type)} className="ml-2 text-blue-600 hover:text-blue-800">
                                    <CloseIcon className="w-3 h-3"/>
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div>
                 <p className="text-gray-600 mb-6 text-sm">
                    Showing <span className="font-bold text-gray-900">{filteredOpportunities.length}</span> of <span className="font-bold text-gray-900">{allOpportunities.length}</span> opportunities.
                </p>
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => <OpportunityCardSkeleton key={i} />)}
                    </div>
                ) : (
                    filteredOpportunities.length > 0 ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredOpportunities.map((op, index) => (
                                <OpportunityCard 
                                    key={op.title + index} 
                                    opportunity={op} 
                                    isBookmarked={currentUser.savedOpportunities.includes(op.title)}
                                    onToggleBookmark={handleToggleBookmark}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-8 bg-white rounded-xl border border-gray-200">
                            <p className="text-gray-800 font-semibold text-lg">No Opportunities Found</p>
                            <p className="text-gray-600 mt-1">Try adjusting your search or filter criteria.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default OpportunitiesPage;