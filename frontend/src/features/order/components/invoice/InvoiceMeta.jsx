import React from 'react';
import { CircleCheck, Clock, AlertCircle } from 'lucide-react';

export default function InvoiceMeta({ order }) {
  if (!order) return null;

  const isPaid = order.isPaid;
  const isCod = order.paymentMethod === 'COD';
  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';

  const receiptId = `RCP-${order._id?.slice(-8).toUpperCase()}`;

  return (
    <div className='flex flex-wrap items-start justify-between gap-4 border-b border-border/80 pb-6'>
      <div className='flex min-w-0 flex-col gap-2'>
        <div>
          {isPaid ? (
            <span className='inline-flex w-fit items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/60 px-2.5 py-0.5 text-xs font-semibold'>
              <CircleCheck className='size-3.5' />
              Paid in Full
            </span>
          ) : isCod ? (
            <span className='inline-flex w-fit items-center gap-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/60 px-2.5 py-0.5 text-xs font-semibold'>
              <Clock className='size-3.5' />
              Cash on Delivery (COD)
            </span>
          ) : (
            <span className='inline-flex w-fit items-center gap-1 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300/60 px-2.5 py-0.5 text-xs font-semibold'>
              <AlertCircle className='size-3.5' />
              Payment Pending
            </span>
          )}
        </div>

        <h1 className='text-2xl font-bold tracking-tight text-foreground md:text-3xl'>
          Purchase Receipt & Invoice
        </h1>
        <p className='text-xs sm:text-sm text-muted-foreground'>
          Issued for order placed by{' '}
          <strong className='text-foreground'>{order.user?.name || order.shippingAddress?.name || 'Customer'}</strong>
          {order.user?.email && ` (${order.user.email})`}.
        </p>
      </div>

      <dl className='grid w-full grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-muted-foreground sm:w-auto sm:text-right'>
        <div className='contents'>
          <dt className='font-medium text-foreground'>Order Number:</dt>
          <dd className='font-mono font-semibold text-primary tabular-nums'>
            #{order._id?.slice(-8).toUpperCase()}
          </dd>
        </div>
        <div className='contents'>
          <dt className='font-medium text-foreground'>Receipt Number:</dt>
          <dd className='font-mono tabular-nums'>{receiptId}</dd>
        </div>
        <div className='contents'>
          <dt className='font-medium text-foreground'>Order Date:</dt>
          <dd className='tabular-nums'>{orderDate}</dd>
        </div>
      </dl>
    </div>
  );
}
