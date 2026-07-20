import { configureStore } from '@reduxjs/toolkit';
import cartSliceReducer from '@/features/cart/cartSlice';
import authSliceReducer from '@/features/Authentication/authSlice';

const store = configureStore({
  reducer: {
    cart: cartSliceReducer,
    auth: authSliceReducer,
  },
});

export default store;
