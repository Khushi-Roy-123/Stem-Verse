import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import AskStemversePage from './pages/AskStemversePage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import InspirationHubPage from './pages/InspirationHubPage';
import StemQuestPage from './pages/StemQuestPage';
import ResumeTipsPage from './pages/ResumeTipsPage';
import AuthPage from './pages/AuthPage';
import ErrorBoundary from './components/ErrorBoundary';
import CommunityForumPage from './pages/CommunityForumPage';
import SettingsPage from './pages/SettingsPage';
import WellbeingHubPage from './pages/WellbeingHubPage';
import LandingPage from './pages/LandingPage';
import { Page, User, Notification } from './types';
import { initializeUsers } from './utils/auth';
import Logo from './components/icons/Logo';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('Home');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [forumPostId, setForumPostId] = useState<string | null>(null);
  const [authViewState, setAuthViewState] = useState<'landing' | 'auth'>('landing');

  useEffect(() => {
    const init = async () => {
      await initializeUsers();
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
      
      const urlParams = new URLSearchParams(window.location.search);
      const postIdFromUrl = urlParams.get('post');
      if (postIdFromUrl) {
        setForumPostId(postIdFromUrl);
        setActivePage('Community Forum');
      }

      setTimeout(() => setIsInitializing(false), 500);
    };
    
    init();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setActivePage('Home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setActivePage('Home');
    setAuthViewState('landing');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: User) => u.username === updatedUser.username);
    if (userIndex > -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
  };
  
  const handleNotificationClick = (notification: Notification) => {
    if (currentUser) {
        const updatedNotifications = currentUser.notifications.map(n => 
            n.id === notification.id ? { ...n, read: true } : n
        );
        handleUpdateUser({ ...currentUser, notifications: updatedNotifications });
    }
    
    setForumPostId(notification.postId);
    setActivePage('Community Forum');
  };


  if (isInitializing) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-sky-50 text-gray-800">
            <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center p-3 animate-pulse">
                <Logo className="text-white"/>
            </div>
            <p className="mt-4 text-lg font-semibold">Loading Stem Verse...</p>
        </div>
    );
  }

  if (!currentUser) {
    if (authViewState === 'landing') {
        return <LandingPage onNavigateToAuth={() => setAuthViewState('auth')} />;
    }
    return <AuthPage onLogin={handleLogin} onNavigateToLanding={() => setAuthViewState('landing')} />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'Home':
        return <HomePage setActivePage={setActivePage} currentUser={currentUser} />;
      case 'Ask STEMVerse':
        return <AskStemversePage />;
      case 'Community Forum':
        return <CommunityForumPage currentUser={currentUser} onUpdateUser={handleUpdateUser} initialPostId={forumPostId} setInitialPostId={setForumPostId} />;
      case 'Opportunities':
        return <OpportunitiesPage currentUser={currentUser} onUpdateUser={handleUpdateUser} />;
      case 'Inspiration Hub':
        return <InspirationHubPage />;
      case 'STEMQuest':
        return <StemQuestPage currentUser={currentUser} onUpdateUser={handleUpdateUser} />;
      case 'Wellbeing Hub':
        return <WellbeingHubPage currentUser={currentUser} onUpdateUser={handleUpdateUser} />;
      case 'Resume Tips':
        return <ResumeTipsPage />;
      case 'Settings':
        return <SettingsPage currentUser={currentUser} onUpdateUser={handleUpdateUser} />;
      default:
        return <HomePage setActivePage={setActivePage} currentUser={currentUser} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-sky-50 text-gray-800">
        <Sidebar 
          activePage={activePage} 
          setActivePage={setActivePage} 
          isSidebarOpen={isSidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          currentUser={currentUser}
          onLogout={handleLogout}
          onNotificationClick={handleNotificationClick}
        />
        <main className="flex-1 flex flex-col overflow-y-auto">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between p-4 bg-sky-50/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200">
            <h1 className="text-xl font-bold text-blue-600">
              Stem Verse
            </h1>
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
          <div className="p-4 sm:p-6 lg:p-8 flex-1">
            {renderPage()}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;