import { Spinner } from '@/components/ui/spinner';
import {
  useGetMessages,
  useGetUserChatForAdmin,
  useSendMessage,
  useMarkMessagesAsRead,
} from '@/features/chat/hooks/useChat';
import { useRef, useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { toast } from 'sonner';
import { Message as AlertMessage } from '@/components/AlertMessage';
import ChatSidebar from '../../component/ChatSidebar';
import ChatWindow from '../../component/ChatWindow';

const MessageManagementPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  const typingTimeoutRef = useRef(null);

  const userInfo = useSelector((state) => state.auth.userInfo);
  const typingUsers = useSelector((state) => state.chat?.typingUsers || {});
  const isUserTyping = selectedUser?._id
    ? !!typingUsers[selectedUser._id]
    : false;

  const {
    isPending: pendingUsers,
    error: errUsers,
    userId: chatUsers,
  } = useGetUserChatForAdmin();

  const { isPending: pendingMessages, HistoryMessages = [] } = useGetMessages(
    selectedUser?._id,
  );

  const { sendedMessage } = useSendMessage();
  const { markAsRead } = useMarkMessagesAsRead();

  useEffect(() => {
    if (selectedUser?._id) {
      markAsRead(selectedUser._id);
    }
  }, [selectedUser?._id, HistoryMessages.length, markAsRead]);


  function handleSelectUser(user) {
    if (selectedUser?._id && typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      dispatch({
        type: 'socket/stopTyping',
        payload: { receiverId: selectedUser._id },
      });
    }
    setSelectedUser(user);
    setText('');
  }

  function handleInputChange(val) {
    setText(val);

    if (!selectedUser?._id) return;

    if (val.trim().length > 0) {
      dispatch({
        type: 'socket/typing',
        payload: { receiverId: selectedUser._id },
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        dispatch({
          type: 'socket/stopTyping',
          payload: { receiverId: selectedUser._id },
        });
      }, 1500);
    } else {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      dispatch({
        type: 'socket/stopTyping',
        payload: { receiverId: selectedUser._id },
      });
    }
  }

  function handleSend() {
    if (!text.trim()) return;

    const receiverId = selectedUser?._id;
    if (!receiverId) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    dispatch({
      type: 'socket/stopTyping',
      payload: { receiverId },
    });

    const formData = new FormData();
    formData.append('text', text);

    const tempId = `chat-${Date.now()}`;
    const tempMessage = {
      _id: tempId,
      senderId: userInfo._id,
      receiverId,
      text,
      createdAt: new Date().toISOString(),
    };

    setText('');

    sendedMessage(
      { user: receiverId, data: formData, tempMessage },
      {
        onError: (err) =>
          toast.error(
            err?.response?.data?.message ||
              err?.message ||
              'Gửi tin nhắn thất bại',
            { position: 'top-center' },
          ),
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
    <div className='flex h-[calc(100vh-5.5rem)] min-h-0 overflow-hidden rounded-xl border border-border/60 bg-card shadow-xs'>
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
          messages={HistoryMessages}
          selectedUser={selectedUser}
          text={text}
          setText={handleInputChange}
          onSend={handleSend}
          onKeyDown={handleKeyDown}
          adminId={userInfo._id}
          isUserTyping={isUserTyping}
        />
      )}
    </div>
  );
};

export default MessageManagementPage;


