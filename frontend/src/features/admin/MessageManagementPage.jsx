import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { messageSentLocally, setMessages } from '../chat/chatSlice';

import {
  useGetUserChatForAdmin,
  useGetMessages,
  useSendMessage,
} from '../chat/hooks/useChat';
import { Spinner } from '@/components/ui/spinner';
import { Message as AlertMessage } from '@/components/AlertMessage';
import { toast } from 'sonner';
import ChatSidebar from './component/ChatSidebar';
import ChatWindow from './component/ChatWindow';

const MessageManagementPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [text, setText] = useState('');

  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const messages = useSelector((state) => state.chat.messages);

  const {
    isPending: pendingUsers,
    error: errUsers,
    userId: chatUsers,
  } = useGetUserChatForAdmin();

  const { isPending: pendingMessages, HistoryMessages } = useGetMessages(
    selectedUser?._id,
  );

  const { sendedMessage } = useSendMessage();

  useEffect(() => {
    if (HistoryMessages) {
      dispatch(setMessages(HistoryMessages));
    }
  }, [HistoryMessages, dispatch]);

  function handleSelectUser(user) {
    setSelectedUser(user);
    setText('');
    dispatch(setMessages([]));
  }

  function handleSend() {
    if (!text.trim()) return;

    const receiverId = selectedUser?._id;
    if (!receiverId) return;

    const formData = new FormData();
    formData.append('text', text);

    // Optimistic update
    const optimisticMessage = {
      _id: `chat-${Date.now()}`,
      senderId: userInfo._id,
      receiverId,
      text,
      createdAt: new Date().toISOString(),
    };
    dispatch(messageSentLocally(optimisticMessage));
    setText('');

    sendedMessage(
      { user: receiverId, data: formData },
      {
        onError: (err) =>
          toast.error(err?.response?.data?.message || 'Gửi tin nhắn thất bại', {
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

  if (pendingUsers) return <Spinner />;
  if (errUsers) return <AlertMessage>{errUsers.message}</AlertMessage>;

  return (
    <div className='flex h-[calc(100vh-4rem)] overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm'>
      <ChatSidebar
        users={chatUsers || []}
        selectedUserId={selectedUser?._id}
        onSelectUser={handleSelectUser}
      />

      {pendingMessages && selectedUser ? (
        <div className='flex flex-1 items-center justify-center'>
          <Spinner />
        </div>
      ) : (
        <ChatWindow
          messages={messages}
          selectedUser={selectedUser}
          text={text}
          setText={setText}
          onSend={handleSend}
          onKeyDown={handleKeyDown}
          adminId={userInfo._id}
        />
      )}
    </div>
  );
};

export default MessageManagementPage;
