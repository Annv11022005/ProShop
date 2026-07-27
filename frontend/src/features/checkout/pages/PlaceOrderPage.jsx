import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import StepCheckout from '../components/StepCheckout';
import { Field, FieldGroup, FieldSet, FieldTitle } from '@/components/ui/field';
import Row from '@/components/ui/Row';
import Col from '@/components/ui/Col';
import { Message } from '@/components/ui/Message';
import ListItems from '../components/ListItems';
import PlaceOrderSummary from '../components/PlaceOrderSummary';
import { useCreateOrder } from '@/features/order/hooks/useOrders';
import { useGetDefaultAddress } from '@/features/address/hooks/useAddress';
import { clearCartItems } from '../../cart/cartSlice';
import { toast } from 'sonner';

const PlaceOrderPage = () => {
  const { createOrderItems, isPending } = useCreateOrder();
  const { currentAddress } = useGetDefaultAddress();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [navigate, cart.paymentMethod, cart.shippingAddress.address]);

  function placeOrderHandler() {
    createOrderItems(
      {
        orderItems: cart.cartItems,
        addressId:
          cart.shippingAddress?.addressId ||
          cart.shippingAddress?._id ||
          currentAddress?._id,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      },
      {
        onSuccess: (data) => {
          dispatch(clearCartItems());
          navigate(`/order/${data._id}`);
        },
        onError: (err) => {
          toast(err.response?.data?.message, { position: 'top-center' });
        },
      },
    );
  }

  return (
    <>
      <StepCheckout step1 step2 step3 />

      <Row template='lg:grid-cols-[2fr_1fr]'>
        <Col fluid className='divide-y divide-primary'>
          <FieldSet className='w-full pb-4 mb-2'>
            <FieldGroup>
              <Field className='flex flex-row'>
                <FieldTitle className='text-md'>Address:</FieldTitle>
                <p>
                  {cart.shippingAddress.name}, {cart.shippingAddress.phone},{' '}
                  {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
                  {cart.shippingAddress.postalCode},{' '}
                  {cart.shippingAddress.country}
                </p>
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSet className='w-full pb-4 mb-2'>
            <FieldGroup>
              <Field className='flex flex-row'>
                <FieldTitle className='text-md'>Payment Method:</FieldTitle>
                <p>{cart.paymentMethod}</p>
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSet className='w-full pb-4 mb-2'>
            <FieldGroup>
              <Field>
                <FieldTitle className='text-md'>Order Items:</FieldTitle>
                {cart.cartItems.length === 0 ? (
                  <Message>Your cart is empty</Message>
                ) : (
                  <ListItems cart={cart} />
                )}
              </Field>
            </FieldGroup>
          </FieldSet>
        </Col>

        <Col fluid>
          <PlaceOrderSummary
            cart={cart}
            placeOrderHandler={placeOrderHandler}
            isLoading={isPending}
          />
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderPage;
