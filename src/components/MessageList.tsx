
import React, { useEffect, useRef } from 'react';
import { Message, User, formatTime } from '@/utils/chatUtils';
import UserProfile from './UserProfile';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: Message[];
  users: User[];
  currentUser: User | null;
  typingUsers: string[];
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  users,
  currentUser,
  typingUsers,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Get user by ID
  const getUserById = (id: string): User | undefined => {
    return users.find((user) => user.id === id);
  };
  
  // Group consecutive messages from the same sender
  const groupedMessages = messages.reduce((acc: { user: User | undefined; messages: Message[] }[], message) => {
    const user = getUserById(message.senderId);
    const lastGroup = acc[acc.length - 1];
    
    if (lastGroup && lastGroup.user?.id === message.senderId) {
      lastGroup.messages.push(message);
    } else {
      acc.push({ user, messages: [message] });
    }
    
    return acc;
  }, []);
  
  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4">
      {groupedMessages.map((group, groupIndex) => (
        <div key={groupIndex} className="flex flex-col">
          <div className="flex items-start gap-2">
            {group.user && group.user.id !== currentUser?.id && (
              <UserProfile user={group.user} size="sm" />
            )}
            
            <div className={cn(
              'flex flex-col',
              group.user?.id === currentUser?.id ? 'items-end' : 'items-start'
            )}>
              {group.user && group.user.id !== currentUser?.id && (
                <span className="text-xs text-muted-foreground mb-1">{group.user.name}</span>
              )}
              
              {group.messages.map((message, msgIndex) => (
                <div
                  key={message.id}
                  className={cn(
                    'mb-1 group transition-all animate-fade-in',
                    message.senderId === currentUser?.id 
                      ? 'message-bubble-sent' 
                      : 'message-bubble-received'
                  )}
                >
                  <div className="flex flex-col">
                    <p>{message.text}</p>
                    <span
                      className={cn(
                        'text-xs opacity-0 group-hover:opacity-100 transition-opacity self-end',
                        message.senderId === currentUser?.id 
                          ? 'text-primary-foreground/70' 
                          : 'text-secondary-foreground/70'
                      )}
                    >
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      
      {/* Typing indicators */}
      {typingUsers.length > 0 && (
        <div className="flex items-center gap-2 animate-fade-in">
          {typingUsers.map((userId) => {
            const user = getUserById(userId);
            return user && user.id !== currentUser?.id ? (
              <div key={userId} className="flex items-center gap-2">
                <UserProfile user={user} size="sm" />
                <div className="message-bubble-received py-2 px-3">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            ) : null;
          })}
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
