
import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { User, Message, getLocalStorage, setLocalStorage, generateId } from '@/utils/chatUtils';

// The backend URL (replace with your actual deployed backend)
const SOCKET_URL = 'https://chatsocket.lovable.dev';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize user and connection
  useEffect(() => {
    // Try to get user from local storage
    const savedUser = getLocalStorage<User | null>('chatUser', null);
    
    if (savedUser) {
      setCurrentUser(savedUser);
    }
    
    // Mock data for demonstration
    setMessages([
      {
        id: '1',
        text: 'Welcome to the chat!',
        senderId: 'system',
        timestamp: Date.now() - 3600000,
        read: true,
      },
      {
        id: '2',
        text: 'Feel free to start a conversation.',
        senderId: 'system',
        timestamp: Date.now() - 3590000,
        read: true,
      },
    ]);
    
    setUsers([
      {
        id: 'system',
        name: 'System',
        avatar: '',
        online: true,
      },
      {
        id: 'user1',
        name: 'Alice',
        avatar: '',
        online: true,
      },
      {
        id: 'user2',
        name: 'Bob',
        avatar: '',
        online: false,
      },
    ]);
    
    // In a real app, this would connect to a backend
    // Simulating connection for now
    setTimeout(() => {
      setIsConnected(true);
    }, 1000);
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);
  
  // In a real app, this would:
  // 1. Connect to a socket server
  // 2. Register handlers for messages, user status, etc.
  useEffect(() => {
    if (!currentUser) return;
    
    try {
      socketRef.current = io(SOCKET_URL, {
        query: {
          userId: currentUser.id,
          userName: currentUser.name,
        },
      });
      
      socketRef.current.on('connect', () => {
        setIsConnected(true);
      });
      
      socketRef.current.on('disconnect', () => {
        setIsConnected(false);
      });
      
      socketRef.current.on('message', (message: Message) => {
        setMessages((prev) => [...prev, message]);
      });
      
      socketRef.current.on('users', (updatedUsers: User[]) => {
        setUsers(updatedUsers);
      });
      
      socketRef.current.on('typing', (userId: string, isTyping: boolean) => {
        if (isTyping) {
          setTypingUsers((prev) => [...prev, userId]);
        } else {
          setTypingUsers((prev) => prev.filter((id) => id !== userId));
        }
      });
    } catch (error) {
      console.error('Socket connection error:', error);
    }
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [currentUser]);
  
  // Create or update user
  const loginUser = useCallback((name: string) => {
    const user: User = {
      id: generateId(),
      name,
      avatar: '',
      online: true,
    };
    
    setCurrentUser(user);
    setLocalStorage('chatUser', user);
    
    // For demo, add user to the list
    setUsers((prev) => [...prev, user]);
    
    return user;
  }, []);
  
  // Send a message
  const sendMessage = useCallback((text: string) => {
    if (!currentUser || !text.trim()) return;
    
    const newMessage: Message = {
      id: generateId(),
      text,
      senderId: currentUser.id,
      timestamp: Date.now(),
      read: false,
    };
    
    // In a real app, this would emit to the socket
    setMessages((prev) => [...prev, newMessage]);
    
    if (socketRef.current) {
      socketRef.current.emit('message', newMessage);
    }
    
    return newMessage;
  }, [currentUser]);
  
  // Set typing status
  const setTyping = useCallback((isTyping: boolean) => {
    if (!currentUser) return;
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    if (isTyping) {
      if (socketRef.current) {
        socketRef.current.emit('typing', currentUser.id, true);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        if (socketRef.current) {
          socketRef.current.emit('typing', currentUser.id, false);
        }
      }, 2000);
    } else {
      if (socketRef.current) {
        socketRef.current.emit('typing', currentUser.id, false);
      }
    }
  }, [currentUser]);
  
  return {
    messages,
    users,
    currentUser,
    isConnected,
    typingUsers,
    loginUser,
    sendMessage,
    setTyping,
  };
};
