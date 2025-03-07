
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useChat } from '@/hooks/useChat';
import { cn } from '@/lib/utils';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import OnlineUsers from './OnlineUsers';
import UserProfile from './UserProfile';

interface ChatInterfaceProps {
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ className }) => {
  const { toast } = useToast();
  const {
    messages,
    users,
    currentUser,
    isConnected,
    typingUsers,
    loginUser,
    sendMessage,
    setTyping,
  } = useChat();
  
  const [username, setUsername] = useState('');
  const [showLogin, setShowLogin] = useState(true);
  
  const handleLogin = () => {
    if (username.trim()) {
      loginUser(username.trim());
      setShowLogin(false);
      
      toast({
        title: 'Welcome to the chat!',
        description: `You've joined as ${username.trim()}`,
      });
    }
  };
  
  const handleUsernameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };
  
  return (
    <div className={cn('flex flex-col h-full overflow-hidden rounded-lg glass-morphism', className)}>
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h1 className="text-xl font-semibold">Real-time Chat</h1>
        
        {currentUser && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Logged in as</span>
            <div className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full">
              <UserProfile user={currentUser} size="sm" />
              <span className="text-sm font-medium">{currentUser.name}</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Main chat area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {showLogin && !currentUser ? (
            <div className="flex flex-col items-center justify-center h-full p-6 animate-fade-in">
              <div className="w-full max-w-md glass-morphism p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-center">Join the Chat</h2>
                <p className="text-muted-foreground mb-6 text-center">
                  Enter your name to start chatting with others.
                </p>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyDown={handleUsernameKeyDown}
                      className="w-full p-3 bg-secondary rounded-lg outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Enter your name"
                      autoFocus
                    />
                  </div>
                  
                  <button
                    onClick={handleLogin}
                    disabled={!username.trim()}
                    className={cn(
                      "w-full p-3 rounded-lg bg-primary text-primary-foreground transition-all",
                      "disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90",
                    )}
                  >
                    Join Chat
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-hidden">
                <MessageList
                  messages={messages}
                  users={users}
                  currentUser={currentUser}
                  typingUsers={typingUsers}
                />
              </div>
              
              <MessageInput
                currentUser={currentUser}
                onSendMessage={sendMessage}
                onTyping={setTyping}
                isConnected={isConnected}
              />
            </>
          )}
        </div>
        
        {/* Side panel - Only visible on larger screens */}
        <div className="hidden md:block w-60 border-l">
          <OnlineUsers 
            users={users}
            currentUser={currentUser}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
