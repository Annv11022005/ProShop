import { updateCart } from './utils/cartUtils';
import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], paymentMethod: 'Paypal' };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      const existItem = state.cartItems.find((x) => x._id === item._id && x.variantId === item.variantId);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id && x.variantId === existItem.variantId ? item : x,
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      return updateCart(state);
    },
    removeFromCart: (state, action) => {
      const { id, variantId } = action.payload;
      state.cartItems = state.cartItems.filter((x) => !(x._id === id && x.variantId === variantId));

      return updateCart(state);
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;

      return updateCart(state);
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      state.coupon = null;
      state.discount = 0;
      return updateCart(state);
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload;
      return updateCart(state);
    },
    removeCoupon: (state) => {
      state.coupon = null;
      state.discount = 0;
      return updateCart(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  savePaymentMethod,
  clearCartItems,
  applyCoupon,
  removeCoupon,
} = cartSlice.actions;

export default cartSlice.reducer;
