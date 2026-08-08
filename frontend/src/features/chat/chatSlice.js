import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
  },
  reducers: {
    // load history
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    //receive chat
    messageReceived: (state, action) => {
      const exists = state.messages.some((m) => m._id === action.payload._id);
      if (!exists) {
        state.messages.push(action.payload);
      }
    },
    messageSentLocally: (state, action) => {
      state.messages.push(action.payload);
    },
    // thay thế message tạm
    messageSentSuccess: (state, action) => {
      const { tempId, message } = action.payload;
      const index = state.messages.findIndex((m) => m._id === tempId);
      if (index !== -1) {
        state.messages[index] = message;
      } else {
        state.messages.push(message);
      }
    },
    // gỡ message lỗi
    messageSendFailed: (state, action) => {
      const tempId = action.payload;
      state.messages = state.messages.filter((m) => m._id !== tempId);
    },
  },
});

export const {
  setMessages,
  messageReceived,
  messageSentLocally,
  messageSentSuccess,
  messageSendFailed,
} = chatSlice.actions;

export default chatSlice.reducer;
