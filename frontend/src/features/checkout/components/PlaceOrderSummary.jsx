import { formatCurrency } from '@/lib/utils';
import CartItemRow from './CartItemRow';
import PromoCodeField from './PromoCodeField';
import SummaryLine from './SummaryLine';
const PlaceOrderSummary = ({
  cart,
  discount,
  totalAfterDiscount,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  return (
    <aside
      className='flex w-full max-w-md flex-col gap-6 rounded-2xl border border-border p-5'
      aria-label='Order summary'
    >
      <div className='flex items-start justify-between gap-4'>
        <div className='min-w-0'>
          <h2 className='text-base font-semibold text-primary'>
            Order Summary
          </h2>
          <p className='mt-0.5 text-sm text-muted-foreground'>
            {cart.cartItems.length}{' '}
            {cart.cartItems.length === 1 ? 'item' : 'items'} shipping to Home
          </p>
        </div>
      </div>

      <div className='flex w-full flex-col gap-4'>
        {cart.cartItems.length > 0 ? (
          cart.cartItems.map((item) => (
            <CartItemRow key={item._id} item={item} />
          ))
        ) : (
          <p className='text-sm text-muted-foreground'>Cart is empty.</p>
        )}
      </div>

      <div className='h-px w-full bg-border' />

      <PromoCodeField
        itemsPrice={cart.itemsPrice}
        price={discount}
        onApply={onApplyCoupon}
        onRemove={onRemoveCoupon}
        initialCouponCode={cart?.coupon?.code}
      />

      <div className='h-px w-full bg-border' />

      <div className='flex w-full flex-col'>
        <SummaryLine label='Subtotal' value={formatCurrency(cart.itemsPrice)} />
        <SummaryLine
          label='Delivery'
          value={formatCurrency(cart.shippingPrice)}
        />
        <SummaryLine label='Tax' value={formatCurrency(cart.taxPrice)} />
        {discount > 0 && (
          <SummaryLine
            label='Discount'
            value={`-${formatCurrency(discount)}`}
            emphasis
          />
        )}
      </div>

      <div className='flex flex-col gap-3 rounded-xl border border-dashed border-border bg-card p-4'>
        <div className='flex min-w-0 items-start justify-between gap-4'>
          <div className='min-w-0'>
            <div className='text-base font-semibold text-foreground'>
              Total
            </div>
            <p className='text-sm text-muted-foreground'>
              Delivery, promo, and tax included.
            </p>
          </div>
          <span className='shrink-0 text-2xl leading-none font-semibold tabular-nums text-foreground'>
            {formatCurrency(totalAfterDiscount)}
          </span>
        </div>
        <div className='flex min-w-0 items-center justify-between gap-3 border-t border-dashed border-border pt-3'>
          <span className='truncate text-xs text-muted-foreground'>
            Charged after review
          </span>
          <span className='inline-flex h-5 items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 text-xs font-medium text-success'>
            Ready to place
          </span>
        </div>
      </div>
    </aside>
  );
};

export default PlaceOrderSummary;
