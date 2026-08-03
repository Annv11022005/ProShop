import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { formatCurrency } from '@/lib/utils';
import CartItemRow from './CartItemRow';
import PromoCodeField from './PromoCodeField';
import SummaryLine from './SummaryLine';

const PlaceOrderSummary = ({ cart, placeOrderHandler, isLoading }) => {
  return (
    <aside
      className='flex w-full max-w-md flex-col gap-6 rounded-2xl border border-neutral-200 p-5'
      aria-label='Order summary'
    >
      <div className='flex items-start justify-between gap-4'>
        <div className='min-w-0'>
          <h2 className='text-base font-semibold text-primary'>
            Order Summary
          </h2>
          <p className='mt-0.5 text-sm text-neutral-500'>
            {cart.cartItems.length}{' '}
            {cart.cartItems.length === 1 ? 'item' : 'items'} shipping to Home
          </p>
        </div>
      </div>

      <div className='flex w-full flex-col gap-4'>
        {cart.cartItems.length > 0 ? (
          cart.cartItems.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))
        ) : (
          <p className='text-sm text-neutral-500'>Giỏ hàng trống.</p>
        )}
      </div>

      <div className='h-px w-full bg-neutral-200' />

      <PromoCodeField />

      <div className='h-px w-full bg-neutral-200' />

      <div className='flex w-full flex-col'>
        <SummaryLine label='Subtotal' value={formatCurrency(cart.itemsPrice)} />
        <SummaryLine
          label='Delivery'
          value={formatCurrency(cart.shippingPrice)}
        />
        <SummaryLine label='Tax' value={formatCurrency(cart.taxPrice)} />
        {/* {promo.discount > 0 && (
          <SummaryLine
            label='Discount'
            value={`-${formatCurrency(promo.discount)}`}
            emphasis
          />
        )} */}
      </div>

      <div className='flex flex-col gap-3 rounded-xl border border-dashed border-neutral-300 bg-white p-4'>
        <div className='flex min-w-0 items-start justify-between gap-4'>
          <div className='min-w-0'>
            <div className='text-base font-semibold text-neutral-900'>
              Total
            </div>
            <p className='text-sm text-neutral-500'>
              Delivery, promo, and tax included.
            </p>
          </div>
          <span className='shrink-0 text-2xl leading-none font-semibold tabular-nums text-neutral-900'>
            {formatCurrency(cart.totalPrice)}
          </span>
        </div>
        <div className='flex min-w-0 items-center justify-between gap-3 border-t border-dashed border-neutral-200 pt-3'>
          <span className='truncate text-xs text-neutral-500'>
            Charged after review
          </span>
          <span className='inline-flex h-5 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 text-xs font-medium text-emerald-700'>
            Ready to place
          </span>

          <Button size='lg' onClick={placeOrderHandler}>
            {isLoading ? <Spinner /> : 'Place Order'}
          </Button>
        </div>
      </div>
    </aside>
  );
  // return (
  //   <Card>
  //     <CardHeader>
  //       <CardTitle>
  //         <h3 className='text-primary text-3xl font-semibold mb-3 text-center'>
  //           Order Summary
  //         </h3>
  //       </CardTitle>
  //     </CardHeader>

  //     <CardContent className='flex flex-col gap-y-3 divide-y divide-primary'>
  //       <div className='flex flex-row justify-between'>
  //         <p>Items:</p>
  //         <p>{formatCurrency(cart.itemsPrice)}</p>
  //       </div>
  //       <div className='flex flex-row justify-between'>
  //         <p>Shipping:</p>
  //         <p>{formatCurrency(cart.shippingPrice)}</p>
  //       </div>
  //       <div className='flex flex-row justify-between'>
  //         <p>Tax:</p>
  //         <p>{formatCurrency(cart.taxPrice)}</p>
  //       </div>
  //       <div className='flex flex-row justify-between'>
  //         <p>Total:</p>
  //         <p>{formatCurrency(cart.totalPrice)}</p>
  //       </div>
  //     </CardContent>

  //     <CardFooter>
  //       <Button size='lg' onClick={placeOrderHandler}>
  //         {isLoading ? <Spinner /> : 'Place Order'}
  //       </Button>
  //     </CardFooter>
  //   </Card>
  // );
};

export default PlaceOrderSummary;
