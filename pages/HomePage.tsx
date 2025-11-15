

import React from 'react';
import { Page, User } from '../types';
import { MENU_ITEMS } from '../constants';
import { TrophyIcon } from '../components/icons';
// Fix: Import gamification utility functions to resolve 'Cannot find name' errors.
import { getXpForNextLevel, getCurrentLevelProgress } from '../utils/gamification';

interface HomePageProps {
  setActivePage: (page: Page) => void;
  currentUser: User | null;
}

const HomePage: React.FC<HomePageProps> = ({ setActivePage, currentUser }) => {
  const cardItems = MENU_ITEMS.filter(item => item.name !== 'Home' && item.name !== 'Settings');
  const xpForNextLevel = currentUser ? getXpForNextLevel(currentUser.level) : 1;
  const xpPercentage = currentUser ? getCurrentLevelProgress(currentUser.xp) : 0;

  return (
    <div className="animate-fade-in-up space-y-8">
      <div className="relative text-center p-8 bg-gradient-to-br from-blue-50 to-sky-100 rounded-2xl border border-blue-200 shadow-lg">
        <div className="relative">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welcome back, {currentUser?.username}!
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Your empowering journey to success in STEM continues here.
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cardItems.map((item) => (
                <div
                    key={item.name}
                    onClick={() => setActivePage(item.name)}
                    className="bg-white p-6 rounded-xl border border-gray-200 cursor-pointer group hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg flex flex-col"
                >
                    <div className="flex items-center mb-4">
                    <div className="p-3 rounded-lg bg-blue-100 mr-4 flex-shrink-0">
                        <item.icon className="w-7 h-7 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800">{item.name}</h2>
                    </div>
                    <p className="text-gray-500 group-hover:text-gray-600 transition-colors flex-grow">
                    {getCardDescription(item.name)}
                    </p>
                </div>
                ))}
            </div>
        </div>

        {/* User Game Tracker Widget */}
        {currentUser && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col space-y-4">
                <div className="flex items-center space-x-4">
                    <TrophyIcon className="w-10 h-10 text-blue-500"/>
                    <h2 className="text-2xl font-semibold text-gray-800">Your Quest</h2>
                </div>
                <div>
                    <div className="flex justify-between items-baseline mb-1">
                        <span className="text-lg font-bold text-gray-800">Level {currentUser.level}</span>
                        <span className="text-sm font-medium text-gray-600">{currentUser.xp} / {xpForNextLevel} XP</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                            className="bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
                            style={{ width: `${xpPercentage}%` }}
                        ></div>
                    </div>
                </div>
                 <div className="text-center pt-4">
                    <p className="text-lg italic text-gray-500">"Every expert was once a beginner. Continue your quest today!"</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

const getCardDescription = (pageName: Page): string => {
  switch (pageName) {
    case 'Ask STEMVerse':
      return 'Get instant answers about scholarships and resources.';
    case 'Community Forum':
        return 'Connect with peers, ask questions, and share knowledge.';
    case 'Opportunities':
      return 'Discover amazing scholarships and internships.';
    case 'Inspiration Hub':
      return 'Learn from pioneering women in STEM.';
    case 'STEMQuest':
      return 'Gamified career roadmap with XP and levels.';
    case 'Wellbeing Hub':
        return 'Prioritize your mental health with wellness check-ins and tips.';
    case 'Resume Tips':
      return 'Access expert advice and tools to craft a standout resume.';
    default:
      return 'Explore this section.';
  }
};

export default HomePage;