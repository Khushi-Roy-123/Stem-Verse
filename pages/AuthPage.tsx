import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import { User } from '../types';
import Logo from '../components/icons/Logo';

interface AuthPageProps {
  onLogin: (user: User) => void;
  onNavigateToLanding: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onNavigateToLanding }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sky-50 p-4 relative">
       <button 
        onClick={onNavigateToLanding} 
        className="absolute top-6 left-6 text-sm text-gray-600 hover:text-blue-600 hover:underline transition-colors flex items-center gap-2"
        aria-label="Back to home page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
       </button>
       <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center p-3">
                <Logo className="text-white"/>
            </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
          <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Welcome to Stem Verse
              </h1>
              <p className="text-gray-600 mt-2">{isLoginView ? 'Sign in to continue' : 'Create an account to get started'}</p>
          </div>
          {isLoginView ? (
            <LoginForm onLogin={onLogin} />
          ) : (
            <SignupForm onSignupSuccess={() => setIsLoginView(true)} />
          )}
        </div>
        
        <div className="text-center mt-6">
            <button 
                onClick={() => setIsLoginView(!isLoginView)}
                className="text-sm text-gray-600 hover:text-blue-600 hover:underline transition-colors"
            >
              {isLoginView ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;