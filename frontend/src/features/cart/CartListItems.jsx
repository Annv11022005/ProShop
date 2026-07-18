import CartItem from './CartItem';

const CartListItems = ({ cartItems, removeCart, addToCartHandler }) => {
  return (
    <div className='flex flex-col gap-6 divide-y divide-primary'>
      {cartItems.map((item) => (
        <div key={item._id} className='py-6 first:pt-0 last:pb-0'>
          <CartItem
            item={item}
            removeCart={removeCart}
            addToCartHandler={addToCartHandler}
          />
        </div>
      ))}
    </div>
  );
};

export default CartListItems;
