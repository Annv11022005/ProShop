import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCreateOrder } from '@/features/order/hooks/useOrders';
import { useGetDefaultAddress } from '@/features/address/hooks/useAddress';
import { clearCartItems } from '../../cart/cartSlice';

import StepCheckout from '../components/StepCheckout';
import { Field, FieldGroup, FieldSet, FieldTitle } from '@/components/ui/field';
import Row from '@/components/ui/Row';
import Col from '@/components/ui/Col';
import { Message } from '@/components/ui/Message';
import ListItems from '../components/ListItems';
import PlaceOrderSummary from '../components/PlaceOrderSummary';
import { toast } from 'sonner';

const PlaceOrderPage = () => {
  const { createOrderItems, isPending } = useCreateOrder();
  const { currentAddress, isPending: isAddressPending } =
    useGetDefaultAddress();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    if (isAddressPending) return;

    if (!currentAddress) {
      navigate('/shipping', { state: { action: 'create' } });
      return;
    }
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [navigate, cart.paymentMethod, currentAddress, isAddressPending]);

  function placeOrderHandler() {
    createOrderItems(
      {
        orderItems: cart.cartItems,
        addressId: currentAddress?._id,
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
                  {currentAddress?.name}, {currentAddress?.phone},{' '}
                  {currentAddress?.address}, {currentAddress?.city},{' '}
                  {currentAddress?.postalCode}, {currentAddress?.country}
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
