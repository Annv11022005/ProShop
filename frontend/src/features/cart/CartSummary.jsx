import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const CartSummary = ({ cartItems, checkoutHandler }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h3 className='text-primary text-3xl font-semibold mb-3 text-center'>
            Subtotal {cartItems.reduce((acc, item) => acc + item.qty, 0)} items
          </h3>
          <p className='text-muted-foreground font-medium text-xl italic'>
            ${' '}
            {cartItems
              .reduce((acc, item) => acc + item.qty * item.price, 0)
              .toFixed(2)}
          </p>
        </CardTitle>
      </CardHeader>

      <CardFooter>
        <Button
          size='lg'
          disable={cartItems.length === 0}
          onClick={checkoutHandler}
        >
          Process To Checkout
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CartSummary;
