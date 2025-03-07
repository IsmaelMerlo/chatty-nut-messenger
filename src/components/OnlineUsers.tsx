
import React from 'react';
import { User } from '@/utils/chatUtils';
import UserProfile from './UserProfile';
import { cn } from '@/lib/utils';

interface OnlineUsersProps {
  users: User[];
  currentUser: User | null;
  className?: string;
}

const OnlineUsers: React.FC<OnlineUsersProps> = ({
  users,
  currentUser,
  className,
}) => {
  const onlineUsers = users.filter((user) => user.online && user.id !== 'system');

  return (
    <div className={cn('p-4', className)}>
      <div className="mb-2">
        <h2 className="text-sm font-medium text-muted-foreground">Online Users</h2>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {onlineUsers.map((user) => (
          <div
            key={user.id}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary transition-all',
              'hover:bg-secondary/80',
              user.id === currentUser?.id ? 'ring-1 ring-primary' : ''
            )}
          >
            <UserProfile user={user} size="sm" />
            <span className="text-sm truncate max-w-[100px]">{user.name}</span>
          </div>
        ))}
        
        {onlineUsers.length === 0 && (
          <p className="text-sm text-muted-foreground">No users online</p>
        )}
      </div>
    </div>
  );
};

export default OnlineUsers;
