import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Clock,
  ExternalLink,
  PackageCheck,
} from 'lucide-react';
import {
  useCountUnreadNotification,
  useMakeRead,
  useMakeReadAll,
  useNotifications,
} from '../hooks/useNotifications';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { count: unreadCount } = useCountUnreadNotification();
  const { data } = useNotifications();
  const { makeRead } = useMakeRead();
  const { makeReadAll, isPending: isMarkingAll } = useMakeReadAll();

  const notifications = data?.notifications?.slice(0, 5) || [];

  const handleItemClick = (notification) => {
    if (!notification.isRead) {
      makeRead(notification._id);
    }
    setOpen(false);
    if (notification.relatedId && notification.relatedModel === 'Order') {
      navigate(`/order/${notification.relatedId}`);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <Button
            variant='outline'
            size='icon'
            className='relative rounded-full w-9 h-9 cursor-pointer'
            aria-label='Notifications'
          >
            <Bell className='h-4 w-4 text-foreground' />
            {unreadCount > 0 && (
              <span className='absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-xs animate-in zoom-in-50 duration-200'>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Button>
        }
      />

      <DropdownMenuContent
        align='end'
        sideOffset={8}
        className='w-80 sm:w-96 p-0 rounded-xl bg-card border border-border shadow-lg overflow-hidden'
      >
        {/* Header */}
        <div className='flex items-center justify-between px-4 py-3 bg-muted/40 border-b border-border/60'>
          <div className='flex items-center gap-2'>
            <h3 className='text-sm font-semibold text-foreground'>
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className='px-2 py-0.5 text-[11px] font-medium rounded-full bg-primary/10 text-primary'>
                {unreadCount} new
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              type='button'
              disabled={isMarkingAll}
              onClick={() => makeReadAll()}
              className='text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50'
            >
              <CheckCheck className='h-3.5 w-3.5' />
              <span>{isMarkingAll ? 'Marking...' : 'Mark all as read'}</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className='max-h-80 overflow-y-auto divide-y divide-border/40'>
          {notifications.length === 0 ? (
            <div className='py-8 text-center text-muted-foreground text-xs'>
              <Bell className='h-8 w-8 mx-auto mb-2 opacity-30' />
              No notifications yet
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => handleItemClick(n)}
                className={`flex items-start gap-3 p-3 text-left transition-colors cursor-pointer hover:bg-muted/50 ${
                  !n.isRead ? 'bg-primary/5' : 'bg-transparent'
                }`}
              >
                <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg-blue text-blue-avt mt-0.5'>
                  <PackageCheck className='h-4 w-4' />
                </div>

                <div className='flex-1 min-w-0 space-y-0.5'>
                  <div className='flex items-center justify-between gap-1'>
                    <p className='text-xs font-semibold text-foreground truncate'>
                      {n.title}
                    </p>
                    {n.createdAt && (
                      <span className='text-[10px] text-muted-foreground whitespace-nowrap flex items-center gap-0.5'>
                        <Clock className='h-2.5 w-2.5' />
                        {new Date(n.createdAt).toLocaleDateString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: '2-digit',
                        })}
                      </span>
                    )}
                  </div>

                  <p className='text-xs text-muted-foreground line-clamp-2 leading-tight'>
                    {n.message}
                  </p>
                </div>

                {!n.isRead && (
                  <span className='h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5' />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <DropdownMenuSeparator className='m-0' />
        <div className='p-2 bg-muted/20 text-center'>
          <Link
            to='/profile'
            state={{ tab: 'notifications' }}
            onClick={() => setOpen(false)}
            className='inline-flex items-center justify-center gap-1.5 w-full py-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors rounded-md hover:bg-primary/5'
          >
            <span>View all notifications</span>
            <ExternalLink className='h-3 w-3' />
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
