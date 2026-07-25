import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import {
  useGetOrderDetail,
  usePayOrder,
  useGetPayPalClientById,
} from './hooks/useOrders';

import Item from '../checkout/components/Item';
import Col from '@/components/ui/Col';
import Row from '@/components/ui/Row';
import { Message } from '@/components/ui/Message';
import { Spinner } from '@/components/ui/spinner';
import { FieldGroup, FieldSet, FieldTitle, Field } from '@/components/ui/field';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { useUpdateOrder } from '../admin/hook/useAdmin';
import { Button } from '@/components/ui/button';

const OrderPage = () => {
  const { id: orderId } = useParams();

  const {
    isPending: pendingGetOrderDetail,
    error,
    order,
    refetch,
  } = useGetOrderDetail(orderId);

  const { payOrderItem } = usePayOrder();

  const [{ isPending: isPaypalScriptPending }, paypalDispatch] =
    usePayPalScriptReducer();

  const {
    isPending: pendingPaypal,
    paypal,
    error: errorPaypal,
  } = useGetPayPalClientById();

  const { userInfo } = useSelector((state) => state.auth);
  const { isPending: pendingDeliver, deliverOrder } = useUpdateOrder();

  useEffect(() => {
    if (!errorPaypal && !pendingPaypal && paypal?.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: 'resetOption',
          value: {
            'client-id': paypal.clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, pendingPaypal, errorPaypal]);

  if (pendingGetOrderDetail) return <Spinner />;
  if (error) return <Message>{error.message}</Message>;

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrderItem({ orderId, details });
        refetch();
        toast.success('Payment successfully', { position: 'top-center' });
      } catch (error) {
        toast.error(error?.data?.message || error?.message || 'payment error', {
          position: 'top-center',
        });
      }
    });
  }

  // async function onApproveTest() {
  //   await payOrderItem({ orderId, details: { payer: {} } });
  //   toast.success('Payment successfully');
  // }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((paypalOrderId) => {
        return paypalOrderId;
      });
  }

  function onError(err) {
    toast.error(err.message);
  }

  async function deliverHandler() {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success('Order delivered', { position: 'top-center' });
    } catch (error) {
      toast.error(error?.data?.message || error?.message || 'payment error', {
        position: 'top-center',
      });
    }
  }

  if (!order) return null;

  return (
    <>
      <h2 className=' text-3xl font-semibold text-primary'>
        ORDER <span className=' italic font-bold'>{order._id}</span>
      </h2>
      <div>
        <Row template='lg:grid-cols-[2fr_1fr]'>
          <Col fluid>
            <FieldSet className='w-full pb-4 mb-2'>
              <FieldGroup>
                <Field className='flex flex-row'>
                  <FieldTitle className='text-md'>Name:</FieldTitle>
                  <p>{order.user.name}</p>
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSet className='w-full pb-4 mb-2'>
              <FieldGroup>
                <Field className='flex flex-row'>
                  <FieldTitle className='text-md'>Email:</FieldTitle>
                  <p>{order.user.email}</p>
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSet className='w-full pb-4 mb-2'>
              <FieldGroup>
                <Field className='flex flex-row'>
                  <FieldTitle className='text-md'>Address:</FieldTitle>
                  <p>
                    {order.shippingAddress.address},{' '}
                    {order.shippingAddress.city},{' '}
                    {order.shippingAddress.postalCode},{' '}
                    {order.shippingAddress.country}
                  </p>
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSet className='w-full pb-4 mb-2 border-b border-primary'>
              <FieldGroup>
                <Field>
                  {order.isDelivered ? (
                    <Message variant='success'>
                      Delivered on {order.deliveredAt}
                    </Message>
                  ) : (
                    <Message variant='danger'>Not Delivered</Message>
                  )}
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSet className='w-full pb-4 mb-2 pt-2'>
              <FieldGroup>
                <Field className='flex flex-row'>
                  <FieldTitle className='text-md'>Payment Method:</FieldTitle>
                  <p>{order.paymentMethod}</p>
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSet className='w-full pb-4 mb-2 border-b border-primary'>
              <FieldGroup>
                <Field>
                  {order.isPaid ? (
                    <Message variant='success'>Paid on {order.paidAt}</Message>
                  ) : (
                    <Message variant='danger'>Not Paid</Message>
                  )}
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSet className='w-full pt-2'>
              <FieldGroup>
                <Field className='flex flex-col gap-0'>
                  <FieldTitle className='text-md mb-2'>Order Items:</FieldTitle>
                  {order.orderItems.map((item, index) => (
                    <div key={index} className='border'>
                      <Item item={item} />
                    </div>
                  ))}
                </Field>
              </FieldGroup>
            </FieldSet>
          </Col>

          <Col fluid>
            <Card className='rounded-none'>
              <CardHeader>
                <CardTitle>
                  <h3 className='text-primary text-3xl font-semibold mb-3 text-center'>
                    Order Summary
                  </h3>
                </CardTitle>
              </CardHeader>

              <CardContent className='flex flex-col gap-y-3 divide-y divide-primary'>
                <div className='flex flex-row justify-between'>
                  <p>Items:</p>
                  <p>$ {order.itemsPrice}</p>
                </div>
                <div className='flex flex-row justify-between'>
                  <p>Shipping:</p>
                  <p>$ {order.shippingPrice}</p>
                </div>
                <div className='flex flex-row justify-between'>
                  <p>Tax:</p>
                  <p>$ {order.taxPrice}</p>
                </div>
                <div className='flex flex-row justify-between'>
                  <p>Total:</p>
                  <p>$ {order.totalPrice}</p>
                </div>
              </CardContent>

              {!order.isPaid && !userInfo.isAdmin && (
                <CardFooter>
                  {pendingPaypal && <Spinner />}
                  {isPaypalScriptPending ? (
                    <Spinner />
                  ) : (
                    <div className='flex flex-col gap-3 items-center justify-center w-full'>
                      {/* <Button size='lg' onClick={onApproveTest}>
                        {pendingPay ? <Spinner /> : 'Test Pay order'}
                      </Button> */}

                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      />
                    </div>
                  )}
                </CardFooter>
              )}

              {userInfo.isAdmin && userInfo && !order.isDelivered && (
                <CardFooter>
                  {pendingDeliver ? (
                    <Spinner />
                  ) : (
                    <Button size='lg' onClick={deliverHandler}>
                      Make at Delivered
                    </Button>
                  )}
                </CardFooter>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default OrderPage;
