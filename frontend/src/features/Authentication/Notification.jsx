import {
  useMakeRead,
  useMakeReadAll,
  useNotifications,
} from './hooks/useNotifications';

import { Spinner } from '@/components/ui/spinner';
import { Message as AlertMessage } from '@/components/AlertMessage';
import { ArrowRight, Bell, Clock, PackageCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Notification = () => {
  const {
    data,
    isPending,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotifications();

  const { makeRead } = useMakeRead();
  const { makeReadAll, isPending: pendMakeAll } = useMakeReadAll();

  if (isPending) return <Spinner />;
  if (error) return <AlertMessage>{error.message}</AlertMessage>;

  return (
    <div className='p-5 border border-border rounded-lg shadow-xs'>
      <div className='mb-7 flex items-center justify-between'>
        <h2 className='text-xl flex gap-3 items-center font-semibold text-primary'>
          <Bell size={18} />
          Notification
        </h2>

        <button
          className='text-sm hover:underline hover:italic font-semibold text-muted-foreground bg-none'
          onClick={() => makeReadAll()}
          disabled={pendMakeAll}
        >
          Mark all as read
        </button>
      </div>
      <div className='flex flex-col gap-3'>
        {data?.notifications.length === 0 ? (
          <div className='text-center py-8 text-muted-foreground text-sm'>
            No notifications yet
          </div>
        ) : (
          data?.notifications.map((n) => (
            <div
              key={n._id}
              className={`relative flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 hover:shadow-xs hover:border-primary/30 ${
                !n.isRead
                  ? 'bg-primary/3 border-primary/10'
                  : 'bg-card border-border/80'
              }`}
              onClick={() => !n.isRead && makeRead(n._id)}
            >
              {/* Icon Status */}
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg-blue text-blue-avt'>
                <PackageCheck className='h-5 w-5' />
              </div>

              {/* Notification Content */}
              <div className='flex-1 min-w-0 space-y-1'>
                <div className='flex items-center justify-between mr-5 gap-2'>
                  <p className='text-sm font-semibold text-foreground truncate'>
                    {n.title}
                  </p>
                  {n.createdAt && (
                    <span className='text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1'>
                      <Clock className='h-3 w-3' />
                      {new Date(n.createdAt).toLocaleDateString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </span>
                  )}
                </div>

                <p className='text-xs text-muted-foreground leading-relaxed line-clamp-2'>
                  {n.message}
                </p>

                {/* Action Link */}
                {n.relatedId && n.relatedModel === 'Order' && (
                  <div className='pt-1.5'>
                    <Link
                      to={`/order/${n.relatedId}`}
                      className='inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors group'
                    >
                      <span>View order</span>
                      <ArrowRight className='h-3 w-3 transition-transform group-hover:translate-x-0.5' />
                    </Link>
                  </div>
                )}
              </div>

              {/* Unread indicator dot */}
              {!n.isRead && (
                <span className='absolute top-4 right-4 h-2 w-2 rounded-full bg-primary' />
              )}
            </div>
          ))
        )}
      </div>

      {hasNextPage && (
        <div className='mt-4 text-center'>
          <Button
            variant='outline'
            className='w-full'
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Loading ...' : 'Load more'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Notification;
