import { configureStore } from '@reduxjs/toolkit';
import cartSliceReducer from '@/features/cart/cartSlice';
import authSliceReducer from '@/features/authentication/authSlice';
import chatSliceReducer from '@/features/chat/chatSlice';
import socketMiddleware from './lib/socketMiddleware';

const store = configureStore({
  reducer: {
    cart: cartSliceReducer,
    auth: authSliceReducer,
    chat: chatSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(socketMiddleware),
});

export default store;
