import { useEffect, useRef, useState } from 'react';
import { messageSentLocally, setMessages } from './chatSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetIdSeller,
  useGetMessages,
  useSendMessage,
} from './hooks/useChat';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bubble, BubbleContent } from '@/components/ui/bubble';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Send, PlusIcon } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Message as AlertMessage } from '@/components/AlertMessage';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageGroup,
} from '@/components/ui/message';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const bottomRef = useRef(null);

  const { isPending: penSeller, error: errSeller, sellerId } = useGetIdSeller();
  const {
    isPending: pendMessage,
    error: errMessage,
    HistoryMessages,
  } = useGetMessages(sellerId?.[0]?._id);
  const { sendedMessage } = useSendMessage();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (HistoryMessages) {
      dispatch(setMessages(HistoryMessages));
    }
  }, [HistoryMessages, dispatch]);

  if (penSeller || pendMessage) return <Spinner />;

  if (errSeller || errMessage)
    return (
      <AlertMessage>{errSeller?.message || errMessage?.message}</AlertMessage>
    );

  function handleSend() {
    if (!text.trim() && !imageFile) return;

    const receiverId = sellerId?.[0]?._id;
    if (!receiverId) return;

    const formData = new FormData();
    formData.append('text', text);
    if (imageFile) formData.append('image', imageFile);

    const optimisticMessage = {
      _id: `chat-${Date.now()}`,
      senderId: userInfo._id,
      receiverId,
      text,
      image: imageFile ? URL.createObjectURL(imageFile) : undefined,
      createdAt: new Date().toISOString(),
    };
    dispatch(messageSentLocally(optimisticMessage));

    setText('');
    setImageFile(null);

    sendedMessage(
      { user: receiverId, data: formData },
      {
        onError: (err) =>
          toast.error(err.message.data, {
            position: 'top-center',
          }),
      },
    );
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className='fixed bottom-6 left-6 z-50 flex flex-col items-end'>
      {isOpen && (
        <Card className='w-80 mb-4 p-0 gap-0 overflow-hidden border border-border/60 shadow-2xl shadow-black/10 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-200'>
          <CardHeader className='flex flex-row items-center justify-between gap-3 border-b border-border/60 bg-muted/40 px-4 py-3'>
            <div className='flex items-center gap-3'>
              <div className='relative'>
                <Avatar className='h-9 w-9 border border-border/60'>
                  <AvatarImage src='/avatars/shop.png' alt='Shop' />
                  <AvatarFallback>SP</AvatarFallback>
                </Avatar>
                <span className='absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background' />
              </div>
              <div className='leading-tight'>
                <CardTitle className='text-sm font-semibold'>
                  Hỗ trợ khách hàng
                </CardTitle>
              </div>
            </div>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsOpen(false)}
              className='h-8 w-8 rounded-full text-muted-foreground hover:bg-muted'
            >
              <X className='h-4 w-4' />
            </Button>
          </CardHeader>

          {/* Messages */}
          <CardContent className='flex h-96 flex-col gap-1 overflow-y-auto p-4'>
            <MessageGroup className='flex flex-col gap-3'>
              {messages.map((m) => (
                <Message
                  key={m._id}
                  className={
                    m.senderId === userInfo._id ? 'flex-row-reverse' : ''
                  }
                >
                  {m.senderId === sellerId[0]?._id && (
                    <MessageAvatar>
                      <Avatar className='h-7 w-7 border border-border/60'>
                        <AvatarImage src='/avatars/shop.png' alt='Shop' />
                        <AvatarFallback>SP</AvatarFallback>
                      </Avatar>
                    </MessageAvatar>
                  )}
                  <MessageContent
                    className={
                      m.senderId === userInfo._id ? 'items-end' : 'items-start'
                    }
                  >
                    <Bubble
                      variant={
                        m.senderId === userInfo._id ? 'default' : 'muted'
                      }
                      className={
                        m.senderId === userInfo._id
                          ? 'rounded-2xl rounded-br-sm bg-primary text-primary-foreground'
                          : 'rounded-2xl rounded-bl-sm border border-border/60 bg-muted/60'
                      }
                    >
                      <BubbleContent className='text-sm leading-relaxed'>
                        {m.text}
                      </BubbleContent>
                    </Bubble>
                  </MessageContent>
                </Message>
              ))}
            </MessageGroup>

            <div ref={bottomRef} />
          </CardContent>

          {/* Input */}
          <CardFooter className='p-3 border-t border-border/60 bg-background'>
            <InputGroup className='rounded-full border-border/60'>
              <InputGroupAddon align='inline-start'>
                <InputGroupButton
                  aria-label='Thêm ảnh'
                  type='button'
                  size='icon-sm'
                  variant='ghost'
                  className='rounded-full hover:bg-muted'
                >
                  <PlusIcon />
                </InputGroupButton>
              </InputGroupAddon>
              <InputGroupInput
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Enter Messages'
                className='text-sm'
              />
              <InputGroupAddon align='inline-end'>
                <InputGroupButton
                  type='submit'
                  variant='default'
                  size='icon-sm'
                  disabled={!text.trim() && !imageFile}
                  onClick={handleSend}
                  className='rounded-full bg-primary text-primary-foreground hover:bg-primary/90'
                >
                  <Send className='h-4 w-4' />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </CardFooter>
        </Card>
      )}

      {!isOpen && (
        <Button
          className='h-12 w-12 rounded-full border border-border/60 shadow-lg transition-transform hover:scale-105 active:scale-95'
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className='h-4 w-4' />
        </Button>
      )}
    </div>
  );
};

export default ChatWidget;
