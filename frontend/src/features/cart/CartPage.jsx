import Col from '@/components/ui/Col';
import Row from '@/components/ui/Row';
import CartSummary from './CartSummary';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Message } from '@/components/ui/Message';
import CartListItems from './CartListItems';
import { addToCart, removeFromCart } from './cartSlice';

const CartPage = () => {
  //   const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  return (
    <Row template='lg:grid-cols-[3fr_1fr]'>
      <Col fluid>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to='/'>Go back</Link>
          </Message>
        ) : (
          <CartListItems
            removeCart={removeFromCartHandler}
            cartItems={cartItems}
            addToCartHandler={addToCartHandler}
          />
        )}
      </Col>

      <Col fluid>
        <CartSummary cartItems={cartItems} removeCart={removeFromCartHandler} />
      </Col>
    </Row>
  );
};

export default CartPage;
