export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  //Calculate item price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
  );
  //Calculate shipping price
  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

  //Calculate tax price
  state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));
  // Calculate discount
  let discount = 0;
  if (state.coupon) {
    const price = Number(state.itemsPrice);
    if (state.coupon.discountType === 'percentage') {
      const rate = Math.min(Math.max(state.coupon.discountValue, 0), 100);
      discount = (price * rate) / 100;
    } else if (state.coupon.discountType === 'fixed') {
      discount = Math.min(state.coupon.discountValue, price);
    }
  }
  state.discount = addDecimals(discount);

  //Calculate total price
  state.totalPrice = Math.max(0, 
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice) -
    Number(state.discount)
  ).toFixed(2);

  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};
