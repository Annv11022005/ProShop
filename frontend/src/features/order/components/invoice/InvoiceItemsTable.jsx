import React from 'react';
import { formatCurrency } from '@/lib/utils';

export default function InvoiceItemsTable({ items = [] }) {
  if (!items || items.length === 0) {
    return (
      <div className='py-6 text-center text-xs text-muted-foreground italic'>
        No items in this order.
      </div>
    );
  }

  return (
    <div className='w-full overflow-x-auto my-2'>
      <table className='w-full text-left text-xs sm:text-sm border-collapse'>
        <thead>
          <tr className='border-b border-border text-muted-foreground uppercase text-[11px] font-semibold tracking-wider'>
            <th className='py-2.5 pr-4'>Item Description</th>
            <th className='py-2.5 px-3 text-center'>Qty</th>
            <th className='py-2.5 px-3 text-right'>Unit Price</th>
            <th className='py-2.5 pl-3 text-right'>Amount</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-border/60'>
          {items.map((item, idx) => {
            const variantText = [item.color, item.size, item.sku]
              .filter(Boolean)
              .join(' · ');

            const itemTotal = item.qty * item.price;

            return (
              <tr key={item._id || item.variantId || idx} className='group'>
                <td className='py-3.5 pr-4'>
                  <div className='flex items-center gap-3'>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className='w-11 h-11 object-cover rounded-md border border-border shrink-0 bg-muted/30'
                      />
                    )}
                    <div className='min-w-0'>
                      <p className='font-semibold text-foreground text-xs sm:text-sm truncate max-w-[240px] sm:max-w-md'>
                        {item.name}
                      </p>
                      {variantText && (
                        <p className='text-[11px] text-muted-foreground mt-0.5'>
                          Variant: {variantText}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                <td className='py-3.5 px-3 text-center font-medium tabular-nums'>
                  {item.qty}
                </td>

                <td className='py-3.5 px-3 text-right text-muted-foreground tabular-nums'>
                  {formatCurrency(item.price)}
                </td>

                <td className='py-3.5 pl-3 text-right font-bold text-foreground tabular-nums'>
                  {formatCurrency(itemTotal)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
