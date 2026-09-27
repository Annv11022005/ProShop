import React from 'react';
import { Link } from 'react-router-dom';
import {
  PackageCheck,
  Truck,
  Clock,
  ArrowRight,
  CheckCircle2,
  Boxes,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

export default function PendingOrdersActionCard({ actionRequired }) {
  const {
    total = 0,
    confirmed = 0,
    shipping = 0,
    pendingPayment = 0,
  } = actionRequired || {};

  if (total === 0) {
    return (
      <div className='p-4 rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0'>
            <CheckCircle2 className='w-5 h-5' />
          </div>
          <div>
            <h3 className='font-semibold text-sm text-foreground'>
              All orders processed
            </h3>
            <p className='text-xs text-muted-foreground'>
              There are currently no pending orders requiring immediate processing.
            </p>
          </div>
        </div>
        <Link
          to='/admin/order-list'
          className={buttonVariants({ variant: 'outline', size: 'sm' })}
        >
          View all orders
          <ArrowRight className='w-4 h-4 ml-1.5' />
        </Link>
      </div>
    );
  }

  return (
    <div className='p-5 rounded-2xl border border-amber-500/30 bg-amber-50/60 dark:bg-amber-950/30 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-5 transition-all'>
      <div className='flex items-start sm:items-center gap-4'>
        <div className='relative w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0'>
          <Boxes className='w-6 h-6' />
          <span className='absolute -top-1 -right-1 flex h-4 w-4'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75'></span>
            <span className='relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-[10px] font-bold text-white items-center justify-center'>
              {total}
            </span>
          </span>
        </div>

        <div className='space-y-1'>
          <div className='flex items-center gap-2'>
            <h3 className='font-bold text-base text-foreground'>
              Orders Requiring Action ({total})
            </h3>
            <span className='text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'>
              Action needed
            </span>
          </div>
          <p className='text-xs text-muted-foreground'>
            You have orders waiting for packaging, shipment dispatch, or delivery confirmation.
          </p>

          {/* Breakdown tags */}
          <div className='flex flex-wrap items-center gap-2 pt-1'>
            {confirmed > 0 && (
              <Link
                to='/admin/order-list?status=CONFIRMED'
                className='inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-card text-foreground border border-border hover:border-primary transition-colors shadow-2xs'
              >
                <PackageCheck className='w-3.5 h-3.5 text-primary' />
                <span>{confirmed} Ready to ship</span>
              </Link>
            )}
            {shipping > 0 && (
              <Link
                to='/admin/order-list?status=SHIPPING'
                className='inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-card text-foreground border border-border hover:border-primary transition-colors shadow-2xs'
              >
                <Truck className='w-3.5 h-3.5 text-blue-600 dark:text-blue-400' />
                <span>{shipping} In transit</span>
              </Link>
            )}
            {pendingPayment > 0 && (
              <Link
                to='/admin/order-list?status=PENDING_PAYMENT'
                className='inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-card text-foreground border border-border hover:border-primary transition-colors shadow-2xs'
              >
                <Clock className='w-3.5 h-3.5 text-amber-600 dark:text-amber-400' />
                <span>{pendingPayment} Pending payment</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className='shrink-0 flex items-center gap-2 self-end md:self-center'>
        <Link
          to={confirmed > 0 ? '/admin/order-list?status=CONFIRMED' : '/admin/order-list'}
          className={`${buttonVariants({ size: 'default' })} bg-primary text-primary-foreground font-semibold shadow-xs hover:shadow-md transition-all gap-2`}
        >
          <span>Process Orders</span>
          <ArrowRight className='w-4 h-4' />
        </Link>
      </div>
    </div>
  );
}
