import React from 'react';
import { CreditCard, Building2, User, Phone, Mail, MapPin } from 'lucide-react';

export default function InvoiceParties({ order, sellerAddress }) {
  const ship = order?.shippingAddress || {};
  const paymentMethod = order?.paymentMethod || 'COD';
  const isPaid = order?.isPaid;

  const paidDateStr = order?.paidAt
    ? new Date(order.paidAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 py-2'>
      {/* 1. SELLER / STORE (From Admin) */}
      <div className='flex flex-col gap-2'>
        <p className='text-xs font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5'>
          <Building2 className='size-3.5 text-primary' />
          Sold By (Seller)
        </p>
        <div className='text-xs sm:text-sm leading-relaxed text-foreground not-italic space-y-0.5'>
          <p className='font-bold text-foreground'>
            {sellerAddress?.name || 'ProShop Official Store'}
          </p>
          {sellerAddress?.address ? (
            <>
              <p className='text-muted-foreground flex items-start gap-1'>
                <MapPin className='size-3.5 mt-0.5 shrink-0 text-muted-foreground' />
                <span>
                  {sellerAddress.address}
                  {sellerAddress.city ? `, ${sellerAddress.city}` : ''}
                  {sellerAddress.postalCode ? ` - ${sellerAddress.postalCode}` : ''}
                  {sellerAddress.country ? `, ${sellerAddress.country}` : ''}
                </span>
              </p>
              {sellerAddress.phone && (
                <p className='text-muted-foreground flex items-center gap-1'>
                  <Phone className='size-3 shrink-0' />
                  <span>{sellerAddress.phone}</span>
                </p>
              )}
              {sellerAddress.email && (
                <p className='text-muted-foreground flex items-center gap-1'>
                  <Mail className='size-3 shrink-0' />
                  <span>{sellerAddress.email}</span>
                </p>
              )}
            </>
          ) : (
            <p className='text-xs text-muted-foreground italic'>
              (Store address not registered yet)
            </p>
          )}
        </div>
      </div>

      {/* 2. CUSTOMER / SHIP TO */}
      <div className='flex flex-col gap-2'>
        <p className='text-xs font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5'>
          <User className='size-3.5 text-primary' />
          Ship To (Customer)
        </p>
        <div className='text-xs sm:text-sm leading-relaxed text-foreground not-italic space-y-0.5'>
          <p className='font-bold text-foreground'>
            {ship.name || order?.user?.name || 'Recipient'}
          </p>
          <p className='text-muted-foreground flex items-start gap-1'>
            <MapPin className='size-3.5 mt-0.5 shrink-0 text-muted-foreground' />
            <span>
              {ship.address}
              {ship.city ? `, ${ship.city}` : ''}
              {ship.postalCode ? ` ${ship.postalCode}` : ''}
              {ship.country ? `, ${ship.country}` : ''}
            </span>
          </p>
          {ship.phone && (
            <p className='text-muted-foreground flex items-center gap-1'>
              <Phone className='size-3 shrink-0' />
              <span>{ship.phone}</span>
            </p>
          )}
        </div>
      </div>

      {/* 3. PAYMENT INFORMATION */}
      <div className='flex flex-col gap-2'>
        <p className='text-xs font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5'>
          <CreditCard className='size-3.5 text-primary' />
          Payment Method
        </p>
        <div className='text-xs sm:text-sm leading-relaxed space-y-1'>
          <p className='font-bold text-foreground'>
            {paymentMethod === 'COD'
              ? 'Cash on Delivery (COD)'
              : paymentMethod === 'VNPay'
              ? 'VNPay Online Payment'
              : 'PayPal Smart Checkout'}
          </p>

          {isPaid ? (
            <div className='text-xs text-emerald-700 dark:text-emerald-400 font-medium'>
              <p>✓ Paid on {paidDateStr}</p>
              {order.paymentResult?.id && (
                <p className='text-muted-foreground font-mono text-[11px] truncate'>
                  Ref: {order.paymentResult.id}
                </p>
              )}
            </div>
          ) : (
            <p className='text-xs text-amber-600 dark:text-amber-400 font-medium'>
              {paymentMethod === 'COD'
                ? 'Payment due upon package receipt'
                : 'Awaiting customer online payment'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
