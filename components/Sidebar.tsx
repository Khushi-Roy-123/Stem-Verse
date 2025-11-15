import React from 'react';
import { Page, User, Notification } from '../types';
import { MENU_ITEMS } from '../constants';
import { LogoutIcon, Logo } from './icons';
import NotificationBell from './NotificationBell';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  currentUser: User | null;
  onLogout: () => void;
  onNotificationClick: (notification: Notification) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isSidebarOpen, setSidebarOpen, currentUser, onLogout, onNotificationClick }) => {
    
  const handleItemClick = (page: Page) => {
    setActivePage(page);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };
    
  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-60 z-30 md:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      
      <aside className={`fixed md:relative top-0 left-0 h-full w-64 bg-white border-r border-gray-200 text-gray-800 flex flex-col z-40 transform transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 flex items-center space-x-3 border-b border-gray-200">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center p-1.5">
            <Logo className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-blue-600">Stem Verse</h1>
        </div>
        <nav className="flex-1 px-4 py-6">
          <ul>
            {MENU_ITEMS.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => handleItemClick(item.name)}
                  className={`w-full flex items-center px-4 py-3 my-1 rounded-lg text-left transition-all duration-200 ease-in-out
                    ${activePage === item.name 
                      ? 'bg-blue-100 text-blue-700 font-semibold' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  <item.icon className="w-6 h-6 mr-4" />
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
            {currentUser && (
                <div className='mb-4 p-3 bg-gray-100 rounded-lg'>
                    <p className="text-sm font-medium text-gray-800">{currentUser.username}</p>
                    <p className="text-xs text-gray-500">Level {currentUser.level} | {currentUser.xp} XP</p>
                </div>
            )}
            <div className="flex items-center justify-between">
                <button
                  onClick={onLogout}
                  className="flex-1 flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <LogoutIcon className="w-6 h-6 mr-4" />
                  <span className="font-medium">Logout</span>
                </button>
                 <div className="flex items-center gap-1">
                    {currentUser && <NotificationBell user={currentUser} onNotificationClick={onNotificationClick} />}
                </div>
            </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;