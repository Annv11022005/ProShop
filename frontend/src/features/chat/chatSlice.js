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
      state.messages.push(action.payload);
    },
    messageSentLocally: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const { setMessages, messageReceived, messageSentLocally } =
  chatSlice.actions;

export default chatSlice.reducer;
