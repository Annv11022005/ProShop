import React from 'react';
import { formatCurrency } from '@/lib/utils';

export default function InvoiceSummary({ order }) {
  if (!order) return null;

  const itemsPrice =
    order.itemsPrice ??
    order.orderItems?.reduce((acc, it) => acc + it.price * it.qty, 0) ??
    0;

  const shippingPrice = order.shippingPrice ?? 0;
  const discount = order.discount ?? 0;
  const taxPrice = order.taxPrice ?? 0;
  const totalPrice = order.totalPrice ?? itemsPrice + shippingPrice - discount;

  return (
    <div className='flex justify-end pt-3 border-t border-border/80'>
      <div className='w-full max-w-xs space-y-2 text-xs sm:text-sm'>
        <div className='flex justify-between text-muted-foreground'>
          <span>Items Subtotal:</span>
          <span className='tabular-nums font-medium text-foreground'>
            {formatCurrency(itemsPrice)}
          </span>
        </div>

        <div className='flex justify-between text-muted-foreground'>
          <span>Shipping Fee:</span>
          <span className='tabular-nums font-medium text-foreground'>
            {shippingPrice > 0 ? formatCurrency(shippingPrice) : 'Free Shipping'}
          </span>
        </div>

        {discount > 0 && (
          <div className='flex justify-between text-emerald-600 dark:text-emerald-400 font-medium'>
            <span>Coupon Discount:</span>
            <span className='tabular-nums'>-{formatCurrency(discount)}</span>
          </div>
        )}

        {taxPrice > 0 && (
          <div className='flex justify-between text-muted-foreground'>
            <span>Tax (VAT):</span>
            <span className='tabular-nums font-medium text-foreground'>
              {formatCurrency(taxPrice)}
            </span>
          </div>
        )}

        <div className='h-px bg-border my-2' />

        <div className='flex justify-between items-baseline text-base sm:text-lg font-bold text-foreground'>
          <span>Total Amount:</span>
          <span className='text-primary tabular-nums'>
            {formatCurrency(totalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}
