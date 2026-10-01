import React from 'react';
import { ShieldCheck, RotateCcw, HeartHandshake } from 'lucide-react';

export default function InvoiceFooter({ sellerAddress }) {
  return (
    <div className='border-t border-border/80 pt-6 mt-6 space-y-4'>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs'>
        <div className='flex items-center gap-2 p-2.5 rounded-lg bg-muted/40 border border-border/60'>
          <ShieldCheck className='size-4 text-emerald-600 shrink-0' />
          <span>100% Genuine Tech Products</span>
        </div>

        <div className='flex items-center gap-2 p-2.5 rounded-lg bg-muted/40 border border-border/60'>
          <RotateCcw className='size-4 text-blue-600 shrink-0' />
          <span>14-Day Free Exchange & Return</span>
        </div>

        <div className='flex items-center gap-2 p-2.5 rounded-lg bg-muted/40 border border-border/60'>
          <HeartHandshake className='size-4 text-primary shrink-0' />
          <span>Dedicated Support 24/7</span>
        </div>
      </div>

      <div className='flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground pt-2'>
        <p>
          Thank you for choosing{' '}
          <strong className='text-foreground'>
            {sellerAddress?.name || 'ProShop'}
          </strong>
          . Keep this invoice for warranty and return claims.
        </p>
        <p className='font-mono'>
          Support:{' '}
          <span className='text-foreground'>
            {sellerAddress?.phone || sellerAddress?.email || 'support@proshop.com'}
          </span>
        </p>
      </div>
    </div>
  );
}
