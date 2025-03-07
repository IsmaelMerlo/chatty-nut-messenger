
import React, { useState, useRef, useEffect } from 'react';
import { User } from '@/utils/chatUtils';
import { cn } from '@/lib/utils';
import { Send } from 'lucide-react';

interface MessageInputProps {
  currentUser: User | null;
  onSendMessage: (text: string) => void;
  onTyping: (isTyping: boolean) => void;
  isConnected: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  currentUser,
  onSendMessage,
  onTyping,
  isConnected,
}) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-focus the input
  useEffect(() => {
    if (inputRef.current && currentUser) {
      inputRef.current.focus();
    }
  }, [currentUser]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    
    // Notify typing
    onTyping(true);
  };
  
  const handleSendMessage = () => {
    if (message.trim() && currentUser && isConnected) {
      onSendMessage(message);
      setMessage('');
      onTyping(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };
  
  return (
    <div className="p-4 border-t bg-card">
      <div className="flex items-end gap-2">
        <textarea
          ref={inputRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={currentUser ? "Type a message..." : "Enter your name to join the chat"}
          disabled={!currentUser || !isConnected}
          className={cn(
            "flex-1 resize-none overflow-hidden p-3 rounded-lg bg-secondary",
            "outline-none focus:ring-1 focus:ring-primary transition-all",
            "min-h-[40px] max-h-[120px]"
          )}
          rows={1}
        />
        
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() || !currentUser || !isConnected}
          className={cn(
            "p-3 rounded-lg bg-primary text-primary-foreground transition-all flex items-center justify-center",
            "disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90",
            "h-[40px] w-[40px]"
          )}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
