
import React, { useState, useEffect, useMemo } from 'react';
import { User, CareerPath, Quest } from '../types';
import { getCareerPaths } from '../services/dataService';
import { getLevelFromXp, getXpForNextLevel, getCurrentLevelProgress } from '../utils/gamification';
import { GamepadIcon, TrophyIcon, CheckCircleIcon, LockIcon, ExternalLinkIcon, SparklesIcon } from '../components/icons';
import { checkForNewBadges, getBadgeById, ALL_BADGES } from '../utils/badges';
import Confetti from '../components/Confetti';

const CelebrationModal: React.FC<{ level: number; badges: string[]; onClose: () => void }> = ({ level, badges, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in p-4">
        <div className="relative bg-gradient-to-br from-blue-50 to-sky-100 border-2 border-blue-300 rounded-2xl p-8 text-center shadow-2xl overflow-hidden max-w-sm w-full">
            <Confetti />
            <SparklesIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900">Congratulations!</h2>
            {level > 0 && (
                <>
                    <p className="text-blue-700 text-lg mt-2">You've reached</p>
                    <p className="text-5xl font-bold text-gray-900 my-4">Level {level}</p>
                </>
            )}
            {badges.length > 0 && (
                 <div className="mt-4">
                    <p className="text-blue-700 text-lg">{level > 0 ? "You also earned a new badge!" : "You've earned a new badge!"}</p>
                     {badges.map(badgeId => {
                         const badge = getBadgeById(badgeId);
                         if (!badge) return null;
                         const Icon = badge.icon;
                         return (
                            <div key={badgeId} className="mt-2 inline-flex items-center gap-2 bg-blue-100 p-2 rounded-lg">
                                <Icon className="w-8 h-8 text-blue-600" />
                                <span className="font-bold text-gray-900">{badge.name}</span>
                            </div>
                         )
                     })}
                </div>
            )}
            <button
                onClick={onClose}
                className="mt-6 px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
            >
                Continue Your Quest
            </button>
        </div>
    </div>
);

const ProgressDashboard: React.FC<{ user: User; path: CareerPath }> = ({ user, path }) => {
    const totalQuests = path.levels.reduce((acc, level) => acc + level.quests.length, 0);
    const completedQuests = user.completed_quests.filter(qId => qId.startsWith(path.id)).length;
    const completionPercentage = totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0;
    const userBadges = ALL_BADGES.filter(badge => user.badges.includes(badge.id));

    return (
        <div className="space-y-8 animate-fade-in-up">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 text-center shadow-sm">
                    <h3 className="text-gray-500 font-semibold">Completion</h3>
                    <p className="text-4xl font-bold text-blue-600 mt-2">{completionPercentage.toFixed(0)}%</p>
                </div>
                 <div className="bg-white p-6 rounded-xl border border-gray-200 text-center shadow-sm">
                    <h3 className="text-gray-500 font-semibold">Quests Completed</h3>
                    <p className="text-4xl font-bold text-gray-800 mt-2">{completedQuests} / {totalQuests}</p>
                </div>
                 <div className="bg-white p-6 rounded-xl border border-gray-200 text-center shadow-sm">
                    <h3 className="text-gray-500 font-semibold">Current Level</h3>
                    <p className="text-4xl font-bold text-gray-800 mt-2">{user.level}</p>
                </div>
            </div>
            
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Level Roadmap</h2>
                <div className="relative flex flex-col md:flex-row items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                     <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 hidden md:block" style={{transform: 'translateY(-50%)'}}></div>
                    {path.levels.map((level, index) => {
                         const isCompleted = level.quests.every(q => user.completed_quests.includes(q.id));
                         const isCurrent = !isCompleted && (index === 0 || path.levels[index - 1].quests.every(q => user.completed_quests.includes(q.id)));
                         
                        let statusColor = 'bg-gray-400 border-gray-300';
                        if (isCompleted) statusColor = 'bg-blue-600 border-blue-500';
                        if (isCurrent) statusColor = 'bg-blue-500 border-blue-400 animate-pulse';

                        return (
                            <div key={level.level} className="z-10 flex flex-row md:flex-col items-center w-full md:w-auto text-left md:text-center p-2 my-2 md:my-0">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white border-4 ${statusColor} flex-shrink-0`}>
                                    {level.level}
                                </div>
                                <p className={`ml-4 md:ml-0 md:mt-2 text-sm font-semibold w-24 ${isCompleted || isCurrent ? 'text-gray-800' : 'text-gray-500'}`}>{level.title}</p>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Badges Earned</h2>
                {userBadges.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {userBadges.map(badge => {
                            const Icon = badge.icon;
                            return (
                                <div key={badge.id} className="bg-white p-4 rounded-xl border border-gray-200 text-center flex flex-col items-center">
                                    <Icon className="w-12 h-12 text-blue-500 mb-2"/>
                                    <h4 className="font-bold text-gray-800">{badge.name}</h4>
                                    <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
                        <p className="text-gray-500">No badges earned yet. Complete more quests to unlock them!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const QuestView: React.FC<{currentUser: User, selectedPathData: CareerPath, handleMarkComplete: (quest: Quest) => void}> = ({currentUser, selectedPathData, handleMarkComplete}) => {
    const xpForNextLevel = getXpForNextLevel(currentUser.level);
    const xpProgress = getCurrentLevelProgress(currentUser.xp);

    const currentActiveQuestId = selectedPathData.levels
        .flatMap(level => level.quests)
        .find(quest => !currentUser.completed_quests.includes(quest.id))?.id;

    return (
        <div className="space-y-8 animate-fade-in-up">
             <div className="bg-white border border-gray-200 rounded-xl p-6">
                 <div className="flex justify-between items-center mb-2">
                    <span className="px-3 py-1 text-sm font-bold bg-blue-600 text-white rounded-full">Level {currentUser.level}</span>
                    <span className="text-sm font-medium text-gray-600">{currentUser.xp} / {xpForNextLevel} XP</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                        className="bg-blue-500 h-4 rounded-full transition-all duration-500 ease-out text-right pr-2 text-xs font-bold flex items-center justify-end" 
                        style={{ width: `${xpProgress}%` }}
                    >
                       <span className="text-white mix-blend-difference">{xpProgress.toFixed(0)}%</span>
                    </div>
                </div>
            </div>

            <div className="space-y-10">
                {selectedPathData.levels.map(level => (
                    <div key={level.level}>
                        <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-4">Level {level.level}: {level.title}</h2>
                        <div className="space-y-4">
                            {level.quests.map(quest => {
                                const isCompleted = currentUser.completed_quests.includes(quest.id);
                                const isActive = quest.id === currentActiveQuestId;
                                const isLocked = !isCompleted && !isActive;

                                return (
                                    <div key={quest.id} className={`p-5 rounded-lg border-l-4 ${isCompleted ? 'bg-gray-100/50 border-gray-400' : isActive ? 'bg-blue-50 border-blue-500' : 'bg-gray-100/50 border-gray-400'}`}>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    {isCompleted ? <CheckCircleIcon className="w-6 h-6 text-blue-600 flex-shrink-0" /> : isLocked ? <LockIcon className="w-6 h-6 text-gray-500 flex-shrink-0" /> : <TrophyIcon className="w-6 h-6 text-blue-500 flex-shrink-0" />}
                                                    <h3 className={`text-xl font-semibold ${isLocked ? 'text-gray-500' : 'text-gray-800'}`}>{quest.title}</h3>
                                                    <span className="px-2 py-0.5 text-xs font-bold bg-gray-200 text-gray-800 rounded-full">{quest.xp} XP</span>
                                                </div>
                                                <p className={`mt-1 ml-9 text-gray-500 ${isLocked ? 'italic' : ''}`}>{isLocked ? 'Complete previous quests to unlock.' : quest.description}</p>
                                            </div>
                                            {isActive && (
                                                <button onClick={() => handleMarkComplete(quest)} className="mt-4 md:mt-0 md:ml-4 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0">
                                                    Mark as Complete
                                                </button>
                                            )}
                                        </div>
                                         {!isLocked && (
                                            <div className="mt-4 ml-9 pl-1 border-l-2 border-gray-300">
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Resources:</h4>
                                                <ul className="space-y-1.5">
                                                    {quest.resources.map(res => (
                                                        <li key={res.url}>
                                                            <a href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-700 hover:underline text-sm">
                                                                {res.title}
                                                                <ExternalLinkIcon className="w-4 h-4 ml-1.5" />
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface StemQuestPageProps {
    currentUser: User;
    onUpdateUser: (user: User) => void;
}

const StemQuestPage: React.FC<StemQuestPageProps> = ({ currentUser, onUpdateUser }) => {
    const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCelebrationModal, setShowCelebrationModal] = useState<{level: number; badges: string[]} | null>(null);
    const [activeTab, setActiveTab] = useState<'quest' | 'dashboard'>('quest');

    useEffect(() => {
        const loadData = async () => {
            const paths = await getCareerPaths();
            setCareerPaths(paths);
            setIsLoading(false);
        };
        loadData();
    }, []);

    const selectedPathData = useMemo(() => 
        careerPaths.find(p => p.id === currentUser.selectedCareerPath),
        [careerPaths, currentUser.selectedCareerPath]
    );

    const handleSelectPath = (pathId: string) => {
        onUpdateUser({ ...currentUser, selectedCareerPath: pathId });
    };

    const handleMarkComplete = (quest: Quest) => {
        if (currentUser.completed_quests.includes(quest.id)) return;
        const oldLevel = currentUser.level;
        const newXp = currentUser.xp + quest.xp;
        const newLevel = getLevelFromXp(newXp);
        const tempUser: User = { ...currentUser, xp: newXp, level: newLevel, completed_quests: [...currentUser.completed_quests, quest.id], questCompletionDates: { ...currentUser.questCompletionDates, [quest.id]: new Date().toISOString() } };
        const newBadgeIds = checkForNewBadges(tempUser, careerPaths);
        const updatedUser: User = { ...tempUser, badges: [...new Set([...currentUser.badges, ...newBadgeIds])] };
        onUpdateUser(updatedUser);
        if (newLevel > oldLevel || newBadgeIds.length > 0) {
            setShowCelebrationModal({level: newLevel > oldLevel ? newLevel : 0, badges: newBadgeIds});
        }
    };
    
    if (isLoading) {
        return <div className="text-center p-8 text-gray-500">Loading your quest...</div>;
    }

    if (!currentUser.selectedCareerPath || !selectedPathData) {
        return (
            <div className="animate-fade-in-up text-center">
                <GamepadIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Path</h1>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Every hero's journey begins with a single step. Select the field you're passionate about to begin your personalized quest.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {careerPaths.map(path => (
                        <div key={path.id} onClick={() => handleSelectPath(path.id)}
                             className="bg-white border border-gray-200 rounded-xl p-6 text-left cursor-pointer transition-all hover:border-blue-500 hover:-translate-y-1 shadow-sm hover:shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{path.name}</h2>
                            <p className="text-gray-600">{path.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up space-y-8 max-w-7xl mx-auto">
             {showCelebrationModal && <CelebrationModal level={showCelebrationModal.level} badges={showCelebrationModal.badges} onClose={() => setShowCelebrationModal(null)} />}
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{selectedPathData.name} Quest</h1>
                    <p className="text-gray-600 mt-2">Complete quests, earn XP, and level up your skills.</p>
                </div>
                 <div className="flex-shrink-0">
                    <button onClick={() => onUpdateUser({...currentUser, selectedCareerPath: undefined})} className="text-sm text-gray-600 hover:underline">
                        Change Career Path
                    </button>
                </div>
            </div>
            
            <div className="border-b border-gray-300">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button onClick={() => setActiveTab('quest')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'quest' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-400'}`}>
                        Your Quest
                    </button>
                     <button onClick={() => setActiveTab('dashboard')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'dashboard' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-400'}`}>
                        Progress Dashboard
                    </button>
                </nav>
            </div>

            {activeTab === 'quest' && <QuestView currentUser={currentUser} selectedPathData={selectedPathData} handleMarkComplete={handleMarkComplete} />}
            {activeTab === 'dashboard' && <ProgressDashboard user={currentUser} path={selectedPathData} />}
        </div>
    );
};

export default StemQuestPage;