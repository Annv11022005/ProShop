import { useGetOrderDetail } from '@/hooks/useOrders';

import Col from '@/components/ui/Col';
import Row from '@/components/ui/Row';
import { Message } from '@/components/ui/Message';
import { Spinner } from '@/components/ui/spinner';
import { FieldGroup, FieldSet, FieldTitle, Field } from '@/components/ui/field';
import Item from '../place-order/Item';
import PlaceOrderSummary from '../place-order/PlaceOrderSummary';

const OrderPage = () => {
  const { isPending, error, order } = useGetOrderDetail();

  if (isPending) return <Spinner />;
  if (error) return <Message>{error.message}</Message>;

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
                      Delivered on {order.Delivered}
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
            <PlaceOrderSummary
              cart={order}
              isLoading={false}
              placeOrderHandler={() => {}}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default OrderPage;
