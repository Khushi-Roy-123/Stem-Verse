import React, { useState } from 'react';
import { getUsers, saveUsers, hashPassword } from '../utils/auth';
import { User } from '../types';

interface SignupFormProps {
    onSignupSuccess: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignupSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    const users = getUsers();
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      setError('Username is already taken.');
      setIsLoading(false);
      return;
    }
     if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      setError('An account with this email already exists.');
      setIsLoading(false);
      return;
    }

    const hashedPassword = await hashPassword(password);
    const newUser: User = {
      username,
      email,
      hashed_password: hashedPassword,
      xp: 0,
      level: 1,
      completed_quests: [],
      savedOpportunities: [],
      badges: [],
      questCompletionDates: {},
      notifications: [],
      notificationPreferences: {
          weeklyDigest: true,
          questReminders: true,
          newInspirations: false,
          deadlineAlerts: true,
      },
      wellbeingHistory: [],
    };

    saveUsers([...users, newUser]);
    setIsLoading(false);
    onSignupSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg text-center text-sm">{error}</p>}
      
      <div>
        <label htmlFor="signup-username" className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          id="signup-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="signup-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          id="signup-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      
       <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </div>
    </form>
  );
};

export default SignupForm;