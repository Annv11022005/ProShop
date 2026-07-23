// import { Button } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

const PlaceOrderSummary = ({ cart, placeOrderHandler, isLoading }) => {
  return (
    <Card>
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
          <p>$ {cart.itemsPrice}</p>
        </div>
        <div className='flex flex-row justify-between'>
          <p>Shipping:</p>
          <p>$ {cart.shippingPrice}</p>
        </div>
        <div className='flex flex-row justify-between'>
          <p>Tax:</p>
          <p>$ {cart.taxPrice}</p>
        </div>
        <div className='flex flex-row justify-between'>
          <p>Total:</p>
          <p>$ {cart.totalPrice}</p>
        </div>
      </CardContent>

      <CardFooter>
        <Button size='lg' onClick={placeOrderHandler}>
          {isLoading ? <Spinner /> : 'Place Order'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlaceOrderSummary;
