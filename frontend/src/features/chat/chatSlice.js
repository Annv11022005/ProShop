import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    onlineUsers: [],
    typingUsers: {}, // { [userId]: boolean }
    isChatOpen: false,
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setUserTyping: (state, action) => {
      const { userId, isTyping } = action.payload;
      if (userId) {
        state.typingUsers[userId] = isTyping;
      }
    },
    toggleChat: (state) => {
      state.isChatOpen = !state.isChatOpen;
    },
    setChatOpen: (state, action) => {
      state.isChatOpen = action.payload;
    },
  },
});

export const { setOnlineUsers, setUserTyping, toggleChat, setChatOpen } =
  chatSlice.actions;

export default chatSlice.reducer;


