import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const ChatSidebar = ({ users = [], selectedUserId, onSelectUser }) => {
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className='flex h-full w-80 shrink-0 flex-col border-r border-border/60'>
      {/* Header */}
      <div className='flex items-center gap-2 border-b border-border/60 px-4 py-3'>
        <h2 className='text-base font-semibold'>Message</h2>
        <span className='rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary'>
          {users.length}
        </span>
      </div>

      {/* Search */}
      <div className='relative px-3 py-2'>
        <Search className='absolute top-1/2 left-6 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search ...'
          className='h-9 rounded-full pl-9 text-sm'
        />
      </div>

      {/* User list */}
      <div className='flex-1 overflow-y-auto'>
        {filteredUsers.length === 0 && (
          <p className='px-4 py-8 text-center text-sm text-muted-foreground'>
            User Not Found
          </p>
        )}

        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => onSelectUser(user)}
            className={cn(
              'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60',
              selectedUserId === user._id &&
                'bg-primary/5 border-r-2 border-r-primary',
            )}
          >
            <div className='relative'>
              <Avatar className='h-10 w-10'>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className='text-xs font-medium'>
                  {user.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className='min-w-0 flex-1'>
              <p className='truncate text-sm font-medium'>{user.name}</p>
              <p className='truncate text-xs text-muted-foreground'>
                {user.email}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
