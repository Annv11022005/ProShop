import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from './cartSlice';

import Col from '@/components/ui/Col';
import Row from '@/components/ui/Row';
import CartSummary from './CartSummary';
import CartListItems from './CartListItems';
import { ShoppingBasket } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = async (id, variantId) => {
    dispatch(removeFromCart({ id, variantId }));
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
          <div>
            <h2 className='mb-5 text-3xl font-bold text-primary/80 uppercase '>
              Shopping Cart
            </h2>
            <div className='flex flex-col items-center justify-center'>
              <div className='w-20 h-20 rounded-full bg-bg-blue flex items-center justify-center text-blue-avt'>
                <ShoppingBasket size={40} />
              </div>

              <h2 className='text-xl font-semibold text-primary'>
                Your cart is empty.
              </h2>

              <p className='mb-10 text-md font-normal text-muted-foreground'>
                Explore featured products and start shopping.
              </p>

              <Button size='lg' onClick={() => navigate('/')}>
                Continue shopping
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className='mb-5 text-3xl font-bold text-primary/80 uppercase '>
              Shopping Cart
            </h2>
            <CartListItems
              removeCart={removeFromCartHandler}
              cartItems={cartItems}
              addToCartHandler={addToCartHandler}
            />
          </div>
        )}
      </Col>

      <Col fluid>
        <CartSummary cartItems={cartItems} checkoutHandler={checkoutHandler} />
      </Col>
    </Row>
  );
};

export default CartPage;
