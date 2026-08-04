import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCreateOrder } from '@/features/order/hooks/useOrders';
import { useGetDefaultAddress } from '@/features/address/hooks/useAddress';
import { clearCartItems, applyCoupon } from '../../cart/cartSlice';

import StepCheckout from '../components/StepCheckout';
import { Field, FieldGroup, FieldSet, FieldTitle } from '@/components/ui/field';
import Row from '@/components/ui/Row';
import Col from '@/components/ui/Col';
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
        couponCode: cart.coupon?.code || null,
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
      <Row template='lg:grid-cols-[2fr_1fr]'>
        <Col fluid>
          <h2 className=' text-3xl font-bold text-primary/80 uppercase '>
            Place Order
          </h2>
          <StepCheckout step1 step2 step3 />
          <div className='divide-y divide-primary mt-10'>
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
          </div>
        </Col>

        <Col fluid>
          <PlaceOrderSummary
            cart={cart}
            placeOrderHandler={placeOrderHandler}
            isLoading={isPending}
            discount={cart.discount || 0}
            totalAfterDiscount={cart.totalPrice}
            onApplyCoupon={(coupon) => dispatch(applyCoupon(coupon))}
          />
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderPage;
