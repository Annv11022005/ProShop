import { useEffect, useRef } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bubble, BubbleContent } from '@/components/ui/bubble';
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageGroup,
  MessageFooter,
} from '@/components/ui/message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageCircle } from 'lucide-react';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty';

const ChatWindow = ({
  messages = [],
  selectedUser,
  text,
  setText,
  onSend,
  onKeyDown,
  adminId,
}) => {
  const bottomRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Chưa chọn user → hiển thị empty state
  if (!selectedUser) {
    return (
      <div className='flex flex-1 items-center justify-center bg-muted/20'>
        <Empty className='border-none'>
          <EmptyHeader>
            <EmptyMedia>
              <div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
                <MessageCircle className='h-8 w-8 text-primary' />
              </div>
            </EmptyMedia>
            <EmptyTitle className='text-lg'>Select a conversation</EmptyTitle>
            <EmptyDescription>
              Select a user from the list on the left to start a conversation.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  function getInitials(name) {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  function formatTime(dateStr) {
    return new Date(dateStr).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className='flex flex-1 flex-col'>
      {/* Header */}
      <div className='flex items-center gap-3 border-b border-border/60 bg-background px-5 py-3'>
        <Avatar className='h-9 w-9'>
          <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
          <AvatarFallback className='text-xs'>
            {getInitials(selectedUser.name)}
          </AvatarFallback>
        </Avatar>
        <div className='leading-tight'>
          <p className='text-sm font-semibold'>{selectedUser.name}</p>
          <p className='text-xs text-muted-foreground'>{selectedUser.email}</p>
        </div>
      </div>

      {/* Body  */}
      <div className='flex flex-1 flex-col gap-3 overflow-y-auto p-5'>
        <MessageGroup className='flex flex-col gap-4'>
          {messages.length === 0 && (
            <p className='py-12 text-center text-sm text-muted-foreground'>
              No messages yet. Start a conversation!
            </p>
          )}

          {messages.map((m) => {
            const isAdmin = m.senderId === adminId;
            return (
              <Message
                key={m._id}
                className={isAdmin ? 'flex-row-reverse' : ''}
              >
                {!isAdmin && (
                  <MessageAvatar>
                    <Avatar className='h-7 w-7'>
                      <AvatarImage
                        src={selectedUser.avatar}
                        alt={selectedUser.name}
                      />
                      <AvatarFallback className='text-[10px]'>
                        {getInitials(selectedUser.name)}
                      </AvatarFallback>
                    </Avatar>
                  </MessageAvatar>
                )}

                <MessageContent
                  className={isAdmin ? 'items-end' : 'items-start'}
                >
                  <Bubble
                    variant={isAdmin ? 'default' : 'muted'}
                    className={
                      isAdmin
                        ? 'rounded-2xl rounded-br-sm'
                        : 'rounded-2xl rounded-bl-sm border border-border/60'
                    }
                  >
                    {m.image && (
                      <img
                        src={m.image}
                        alt='attachment'
                        className='max-h-48 rounded-lg object-cover'
                      />
                    )}
                    {m.text && (
                      <BubbleContent className='text-sm leading-relaxed'>
                        {m.text}
                      </BubbleContent>
                    )}
                  </Bubble>
                  <MessageFooter>
                    <span className='text-[10px] text-muted-foreground'>
                      {formatTime(m.createdAt)}
                    </span>
                  </MessageFooter>
                </MessageContent>
              </Message>
            );
          })}
        </MessageGroup>
        <div ref={bottomRef} />
      </div>

      {/* Footer */}
      <div className='flex items-center gap-2 border-t border-border/60 bg-background px-4 py-3'>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder='Aa'
          className='h-10 flex-1 rounded-full border-border/60 text-sm focus-visible:ring-1'
        />
        <Button
          size='icon'
          onClick={onSend}
          disabled={!text.trim()}
          className='h-10 w-10 shrink-0 rounded-full'
        >
          <Send className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
};

export default ChatWindow;
