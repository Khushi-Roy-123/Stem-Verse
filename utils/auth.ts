import { User } from '../types';

// Helper function to convert ArrayBuffer to hex string
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Hashes a password using SHA-256
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return bufferToHex(hashBuffer);
}

// Retrieves users from localStorage
export function getUsers(): User[] {
  const usersJson = localStorage.getItem('users');
  return usersJson ? JSON.parse(usersJson) : [];
}

// Saves users to localStorage
export function saveUsers(users: User[]): void {
  localStorage.setItem('users', JSON.stringify(users));
}

// Initializes the user store in localStorage if it doesn't exist
export async function initializeUsers(): Promise<void> {
  if (localStorage.getItem('users') === null) {
    try {
      const response = await fetch('/data/users.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch initial users: ${response.statusText}`);
      }
      const initialUsers = await response.json();
      localStorage.setItem('users', JSON.stringify(initialUsers));
    } catch (error) {
      console.error('Error initializing user data:', error);
      // If fetching fails, initialize with an empty array to prevent app crash
      localStorage.setItem('users', '[]');
    }
  }
}
