
import React from 'react';
import { User, getInitials } from '@/utils/chatUtils';
import { cn } from '@/lib/utils';

interface UserProfileProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  size = 'md',
  showStatus = true,
  className,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div className={cn('relative inline-block', className)}>
      <div
        className={cn(
          'rounded-full flex items-center justify-center',
          sizeClasses[size],
          user.avatar ? '' : 'bg-primary text-primary-foreground'
        )}
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span>{getInitials(user.name)}</span>
        )}
      </div>
      
      {showStatus && (
        <span
          className={cn(
            'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background',
            user.online ? 'bg-green-500' : 'bg-gray-400'
          )}
        />
      )}
    </div>
  );
};

export default UserProfile;
