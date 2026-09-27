import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import {
  useGetOrderDetail,
  usePayOrder,
  useGetPayPalClientById,
  useCreateVnpayPayment,
} from './hooks/useOrders';

import Item from '../checkout/components/Item';
import Col from '@/components/ui/Col';
import Row from '@/components/ui/Row';
import { Message } from '@/components/AlertMessage';
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
import { getErrorMessage } from '@/lib/utils';
import { useUpdateOrder, useUpdateOrderStatus } from '../admin/hook/useAdmin';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import OrderStatusBadge, { getEffectiveStatus } from '@/components/OrderStatusBadge';
import OrderTimelineStepper from '@/components/OrderTimelineStepper';

const OrderPage = () => {
  const { id: orderId } = useParams();

  const {
    isPending: pendingGetOrderDetail,
    error,
    order,
    refetch,
  } = useGetOrderDetail(orderId);

  const { payOrderItem } = usePayOrder();

  const { createPayment } = useCreateVnpayPayment();

  const [{ isPending: isPaypalScriptPending }, paypalDispatch] =
    usePayPalScriptReducer();

  const {
    isPending: pendingPaypal,
    paypal,
    error: errorPaypal,
  } = useGetPayPalClientById();

  const { userInfo } = useSelector((state) => state.auth);
  const { isPending: pendingDeliver, deliverOrder } = useUpdateOrder();
  const { isPending: pendingStatusChange, changeOrderStatus } =
    useUpdateOrderStatus();

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

      if (order && !order.isPaid && order.paymentMethod !== 'COD') {
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
        toast.error(getErrorMessage(error, 'Payment failed'), {
          position: 'top-center',
        });
      }
    });
  }

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
    toast.error(getErrorMessage(err, 'Payment error'));
  }

  async function handleStatusChange(nextStatus, note = '') {
    try {
      await changeOrderStatus({ id: orderId, status: nextStatus, note });
      refetch();
      toast.success(`Order updated to ${nextStatus}`, {
        position: 'top-center',
      });
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update order status'), {
        position: 'top-center',
      });
    }
  }

  async function deliverHandler() {
    return handleStatusChange('DELIVERED', 'Marked as delivered by Admin');
  }

  async function createPaymentHandler() {
    try {
      const payment = await createPayment(orderId);
      window.location.href = payment.paymentUrl;
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to initiate payment'), {
        position: 'top-center',
      });
    }
  }

  if (!order) return null;

  const currentStatus = getEffectiveStatus(order);
  const isCod = order.paymentMethod === 'COD';

  return (
    <Row template='lg:grid-cols-[2fr_1fr]'>
      <Col fluid>
        <div className='flex flex-wrap items-center justify-between gap-3 mb-5'>
          <h2 className='text-2xl sm:text-3xl font-semibold text-primary'>
            ORDER <span className='italic font-bold'>#{order._id}</span>
          </h2>
          <OrderStatusBadge order={order} className='text-sm py-1.5 px-3' />
        </div>

        {/* Order Progress Stepper */}
        <OrderTimelineStepper order={order} />

        <FieldSet className='w-full pb-4 mb-2'>
          <FieldGroup>
            <Field className='flex flex-row'>
              <FieldTitle className='text-md'>Customer Name:</FieldTitle>
              <p className='font-medium'>{order.user?.name}</p>
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet className='w-full pb-4 mb-2'>
          <FieldGroup>
            <Field className='flex flex-row'>
              <FieldTitle className='text-md'>Customer Email:</FieldTitle>
              <p>{order.user?.email}</p>
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet className='w-full pb-4 mb-2'>
          <FieldGroup>
            <Field className='flex flex-row'>
              <FieldTitle className='text-md'>Shipping Address:</FieldTitle>
              <p>
                {order.shippingAddress?.name}, {order.shippingAddress?.phone},{' '}
                {order.shippingAddress?.address}, {order.shippingAddress?.city},{' '}
                {order.shippingAddress?.postalCode},{' '}
                {order.shippingAddress?.country}
              </p>
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet className='w-full pb-4 mb-2 border-b border-primary'>
          <FieldGroup>
            <Field>
              {order.isDelivered ? (
                <Message variant='success'>
                  Delivered on {new Date(order.deliveredAt).toLocaleString()}
                </Message>
              ) : currentStatus === 'SHIPPING' ? (
                <Message variant='info'>
                  Order is currently in transit with courier. Expected delivery soon.
                </Message>
              ) : currentStatus === 'CANCELLED' ? (
                <Message variant='danger'>Order has been cancelled.</Message>
              ) : (
                <Message variant='warning'>Order is confirmed and being prepared for shipment.</Message>
              )}
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet className='w-full pb-4 mb-2 pt-2'>
          <FieldGroup>
            <Field className='flex flex-row items-center gap-2'>
              <FieldTitle className='text-md'>Payment Method:</FieldTitle>
              <p className='font-semibold'>
                {isCod ? 'Cash on Delivery (COD)' : order.paymentMethod}
              </p>
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet className='w-full pb-4 mb-2 border-b border-primary'>
          <FieldGroup>
            <Field>
              {order.isPaid ? (
                <Message variant='success'>
                  Paid on {new Date(order.paidAt).toLocaleString()}
                  {isCod ? ' (Cash collected upon delivery)' : ''}
                </Message>
              ) : isCod ? (
                <div className='p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-200 text-sm'>
                  <p className='font-semibold mb-0.5'>Cash on Delivery (COD)</p>
                  <p className='text-xs'>
                    Please prepare <strong>{formatCurrency(order.totalPrice)}</strong> in cash to pay directly to the courier when receiving your items.
                  </p>
                </div>
              ) : order.isCancelled ? (
                <Message variant='danger'>
                  The payment deadline has passed or order was cancelled.
                </Message>
              ) : (
                <Message variant='danger'>Not Paid - Please complete payment below.</Message>
              )}
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet className='w-full pt-2'>
          <FieldGroup>
            <Field className='flex flex-col gap-0'>
              <FieldTitle className='text-md mb-2'>Order Items:</FieldTitle>
              {order.orderItems?.map((item, index) => (
                <div key={index} className='border rounded-lg mb-2 overflow-hidden'>
                  <Item item={item} />
                </div>
              ))}
            </Field>
          </FieldGroup>
        </FieldSet>
      </Col>

      <Col fluid>
        <Card className='rounded-xl shadow-xs'>
          <CardHeader>
            <CardTitle>
              <h3 className='text-primary text-2xl font-bold mb-1 text-center'>
                Order Summary
              </h3>
            </CardTitle>
          </CardHeader>

          <CardContent className='flex flex-col gap-y-3 divide-y divide-primary'>
            <div className='flex flex-row justify-between'>
              <p>Items:</p>
              <p>{formatCurrency(order.itemsPrice)}</p>
            </div>
            <div className='flex flex-row justify-between'>
              <p>Shipping:</p>
              <p>{formatCurrency(order.shippingPrice)}</p>
            </div>
            <div className='flex flex-row justify-between'>
              <p>Tax:</p>
              <p>{formatCurrency(order.taxPrice)}</p>
            </div>
            {order.discount > 0 && (
              <div className='flex flex-row justify-between text-success font-medium'>
                <p>Discount:</p>
                <p>-{formatCurrency(order.discount)}</p>
              </div>
            )}
            <div className='flex flex-row justify-between font-semibold text-lg'>
              <p>Total:</p>
              <p>{formatCurrency(order.totalPrice)}</p>
            </div>
          </CardContent>

          {/* Customer Payment Section */}
          {!order.isPaid && !userInfo?.isAdmin && !order.isCancelled ? (
            <CardFooter>
              {isCod ? (
                <div className='w-full text-center p-3 rounded-lg bg-muted/70 text-xs text-muted-foreground font-medium'>
                  Cash on Delivery selected. No online payment required.
                </div>
              ) : (
                <div className='w-full'>
                  {pendingPaypal && <Spinner />}
                  {isPaypalScriptPending ? (
                    <Spinner />
                  ) : (
                    <div className='flex flex-col gap-3 items-center justify-center w-full'>
                      {order.paymentMethod === 'Paypal' ? (
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        />
                      ) : (
                        <Button size='lg' className='w-full' onClick={createPaymentHandler}>
                          Proceed to Payment
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardFooter>
          ) : order.isPaid && !userInfo?.isAdmin ? (
            <CardFooter>
              <p className='text-sm font-medium text-emerald-600 dark:text-emerald-400 text-center w-full'>
                The order has been successfully paid for.
              </p>
            </CardFooter>
          ) : order.isCancelled && !userInfo?.isAdmin ? (
            <CardFooter>
              <p className='text-sm font-medium text-destructive text-center w-full'>
                This order has been cancelled.
              </p>
            </CardFooter>
          ) : null}

          {/* Admin Management Actions */}
          {userInfo?.isAdmin && (
            <CardFooter className='flex flex-col gap-2 w-full pt-4 border-t'>
              <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 text-center w-full'>
                Admin Order Control
              </p>
              {pendingDeliver || pendingStatusChange ? (
                <div className='flex justify-center w-full py-2'>
                  <Spinner />
                </div>
              ) : (
                <div className='flex flex-col gap-2 w-full'>
                  {currentStatus === 'PENDING_PAYMENT' && (
                    <>
                      <Button
                        className='w-full'
                        onClick={() => handleStatusChange('CONFIRMED', 'Confirmed by Admin')}
                      >
                        Confirm Order
                      </Button>
                      <Button
                        variant='destructive'
                        className='w-full'
                        onClick={() => handleStatusChange('CANCELLED', 'Cancelled by Admin')}
                      >
                        Cancel Order
                      </Button>
                    </>
                  )}

                  {currentStatus === 'CONFIRMED' && (
                    <>
                      <Button
                        className='w-full'
                        onClick={() => handleStatusChange('SHIPPING', 'Handed over to carrier')}
                      >
                        Start Shipping / In Transit
                      </Button>
                      <Button
                        variant='destructive'
                        className='w-full'
                        onClick={() => handleStatusChange('CANCELLED', 'Cancelled by Admin')}
                      >
                        Cancel Order
                      </Button>
                    </>
                  )}

                  {currentStatus === 'SHIPPING' && (
                    <>
                      <Button
                        className='w-full bg-emerald-600 hover:bg-emerald-700 text-white'
                        onClick={() => handleStatusChange('DELIVERED', 'Delivered successfully')}
                      >
                        Confirm Delivered
                      </Button>
                      <Button
                        variant='destructive'
                        className='w-full'
                        onClick={() => handleStatusChange('CANCELLED', 'Delivery failed / Cancelled')}
                      >
                        Mark Delivery Failed / Cancel
                      </Button>
                    </>
                  )}

                  {currentStatus === 'DELIVERED' && (
                    <div className='text-center py-2 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg w-full'>
                      Order Delivered & Completed
                    </div>
                  )}

                  {currentStatus === 'CANCELLED' && (
                    <div className='text-center py-2 text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40 rounded-lg w-full'>
                      Order Cancelled
                    </div>
                  )}
                </div>
              )}
            </CardFooter>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default OrderPage;
