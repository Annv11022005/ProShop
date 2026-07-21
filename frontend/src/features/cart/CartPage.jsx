import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from './cartSlice';

import Col from '@/components/ui/Col';
import Row from '@/components/ui/Row';
import CartSummary from './CartSummary';
import CartListItems from './CartListItems';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  function checkoutHandler() {
    if (cartItems.length !== 0) {
      navigate('/payment');
    } else {
      navigate('/');
    }
  }

  return (
    <Row template='lg:grid-cols-[3fr_1fr]'>
      <Col fluid>
        {cartItems.length === 0 ? (
          <h2 className='w-full text-center text-lg font-semibold flex justify-center gap-4 text-destructive'>
            ! Your cart is empty
            <Link to='/' className='hover:underline hover:italic'>
              Go Back
            </Link>
          </h2>
        ) : (
          <CartListItems
            removeCart={removeFromCartHandler}
            cartItems={cartItems}
            addToCartHandler={addToCartHandler}
          />
        )}
      </Col>

      <Col fluid>
        <CartSummary cartItems={cartItems} checkoutHandler={checkoutHandler} />
      </Col>
    </Row>
  );
};

export default CartPage;
