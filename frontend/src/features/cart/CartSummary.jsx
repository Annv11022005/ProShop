import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

const CartSummary = ({ cartItems, checkoutHandler }) => {
  return (
    <div className='p-5 w-full rounded-xl border border-border shadow-2xs'>
      <div className='mb-4 flex flex-col gap-2'>
        <h2 className='text-xl font-bold text-primary'>Order Summary</h2>

        <span className='p-[0.5px] bg-muted-foreground' />
      </div>

      {cartItems.length !== 0 && (
        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-between text-md text-primary p-3 border border-border rounded-xl'>
            <p className=' font-semibold'>Product Quantity:</p>

            <p>{cartItems.reduce((acc, item) => acc + item.qty, 0)} Products</p>
          </div>

          <div className='flex items-center justify-between text-md text-primary p-3 border border-border rounded-xl'>
            <p className=' font-semibold'>Provisional Price:</p>

            <p>
              {formatCurrency(
                cartItems.reduce((acc, item) => acc + item.qty * item.price, 0),
              )}
            </p>
          </div>

          <Button
            size='lg'
            disable={cartItems.length === 0}
            onClick={checkoutHandler}
          >
            Process To Checkout
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartSummary;
