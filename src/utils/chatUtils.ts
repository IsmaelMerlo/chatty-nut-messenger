
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  typing?: boolean;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: number;
  read: boolean;
}

// Generate a random color for user avatars
export const generateColor = (): string => {
  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Get initials from name
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Format timestamp to readable format
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Get data from localStorage
export const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

// Set data to localStorage
export const setLocalStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Generate a unique ID
export const generateId = (): string => {
  return uuidv4();
};
