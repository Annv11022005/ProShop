import { useEffect, useRef, useState } from 'react';
import {
  messageSendFailed,
  messageSentLocally,
  messageSentSuccess,
  setMessages,
} from './chatSlice';
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
  const [previewUrl, setPreviewUrl] = useState(null);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  const { isPending: penSeller, error: errSeller, sellerId } = useGetIdSeller();
  const {
    isPending: pendMessage,
    error: errMessage,
    HistoryMessages,
  } = useGetMessages(sellerId?.[0]?._id);
  const { sendedMessage } = useSendMessage();

  // Create preview URL when imageFile changes
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile]);

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

    const tempId = `chat-${Date.now()}`;
    const localImageUrl = imageFile
      ? URL.createObjectURL(imageFile)
      : undefined;
    const optimisticMessage = {
      _id: tempId,
      senderId: userInfo._id,
      receiverId,
      text,
      image: localImageUrl,
      createdAt: new Date().toISOString(),
    };
    dispatch(messageSentLocally(optimisticMessage));

    setText('');
    setImageFile(null);

    sendedMessage(
      { user: receiverId, data: formData },
      {
        onSuccess: (savedMessage) => {
          dispatch(messageSentSuccess({ tempId, message: savedMessage }));
          if (localImageUrl) URL.revokeObjectURL(localImageUrl);
        },
        onError: (err) => {
          // gỡ message tạm khỏi UI vì gửi thất bại
          dispatch(messageSendFailed(tempId));
          if (localImageUrl) URL.revokeObjectURL(localImageUrl);
          toast.error(err.message.data, {
            position: 'top-center',
          });
        },
      },
    );
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleImageSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are supported', { position: 'top-center' });
      e.target.value = '';
      return;
    }

    const MAX_SIZE_MB = 5;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Image cannot exceed ${MAX_SIZE_MB}MB`, {
        position: 'top-center',
      });
      e.target.value = '';
      return;
    }

    setImageFile(file);
    // reset value để chọn lại cùng 1 file vẫn trigger onChange
    e.target.value = '';
  }

  return (
    <div className='fixed bottom-6 left-6 z-50 flex flex-col items-end'>
      {isOpen && (
        <Card>
          <CardHeader className='flex flex-row items-center justify-between  border-b border-border/60 bg-muted/40'>
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
                  Customer Support
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
                      <BubbleContent className='text-sm leading-relaxed flex flex-col gap-2'>
                        {m.image && (
                          <img
                            src={m.image}
                            alt='attachment'
                            className='max-w-[200px] rounded-md object-cover'
                          />
                        )}
                        {m.text && <span>{m.text}</span>}
                      </BubbleContent>
                    </Bubble>
                  </MessageContent>
                </Message>
              ))}
            </MessageGroup>

            <div ref={bottomRef} />
          </CardContent>

          {/* Input */}
          <CardFooter className='p-3 flex flex-col items-start gap-2 border-t border-border/60 bg-background'>
            {imageFile && (
              <div className='flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 p-2'>
                <img
                  src={previewUrl}
                  alt='preview'
                  className='h-12 w-12 rounded-md object-cover'
                />
                <span className='flex-1 truncate text-xs text-muted-foreground'>
                  {imageFile.name}
                </span>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='h-6 w-6 rounded-full'
                  onClick={() => setImageFile(null)}
                >
                  <X className='h-3 w-3' />
                </Button>
              </div>
            )}

            <InputGroup className='rounded-full border-border/60'>
              <InputGroupAddon align='inline-start'>
                <input
                  type='file'
                  accept='image/*'
                  className='hidden'
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                />
                <InputGroupButton
                  aria-label='Add image'
                  type='button'
                  size='icon-sm'
                  variant='ghost'
                  className='rounded-full hover:bg-muted'
                  onClick={() => fileInputRef.current?.click()}
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
