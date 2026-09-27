import React from 'react';
import { Check, Clock, Truck, PackageCheck, XCircle } from 'lucide-react';
import { getEffectiveStatus } from './OrderStatusBadge';

const STEPS = [
  { key: 'PLACED', label: 'Order Placed', icon: Clock },
  { key: 'CONFIRMED', label: 'Confirmed', icon: Check },
  { key: 'SHIPPING', label: 'In Transit', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: PackageCheck },
];

const OrderTimelineStepper = ({ order }) => {
  if (!order) return null;

  const currentStatus = getEffectiveStatus(order);

  if (currentStatus === 'CANCELLED') {
    return (
      <div className='p-4 mb-6 rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/40 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-center gap-3'>
        <XCircle className='w-6 h-6 shrink-0 text-rose-600 dark:text-rose-400' />
        <div>
          <h3 className='font-semibold text-sm'>Order Cancelled</h3>
          <p className='text-xs opacity-90'>
            {order.cancelledAt
              ? `This order was cancelled on ${new Date(order.cancelledAt).toLocaleString()}`
              : 'This order has been cancelled.'}
          </p>
        </div>
      </div>
    );
  }

  // Determine current step index (0 to 3)
  let activeIndex = 0;
  if (currentStatus === 'CONFIRMED') activeIndex = 1;
  else if (currentStatus === 'SHIPPING') activeIndex = 2;
  else if (currentStatus === 'DELIVERED') activeIndex = 3;

  const getStepDate = (stepKey) => {
    switch (stepKey) {
      case 'PLACED':
        return order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '';
      case 'CONFIRMED':
        return order.confirmedAt
          ? new Date(order.confirmedAt).toLocaleDateString()
          : order.paidAt
            ? new Date(order.paidAt).toLocaleDateString()
            : '';
      case 'SHIPPING':
        return order.shippedAt ? new Date(order.shippedAt).toLocaleDateString() : '';
      case 'DELIVERED':
        return order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : '';
      default:
        return '';
    }
  };

  return (
    <div className='w-full py-6 px-4 mb-6 bg-card border rounded-xl shadow-xs'>
      <div className='relative grid grid-cols-4'>
        {/* Background Connecting Line */}
        <div className='absolute left-[12.5%] right-[12.5%] top-5 -translate-y-1/2 h-1 bg-muted rounded-full z-0' />
        {/* Active Progress Line */}
        <div
          className='absolute left-[12.5%] top-5 -translate-y-1/2 h-1 bg-primary rounded-full transition-all duration-500 z-0'
          style={{ width: `${(activeIndex / (STEPS.length - 1)) * 75}%` }}
        />

        {STEPS.map((step, index) => {
          const isCompleted = index < activeIndex;
          const isCurrent = index === activeIndex;
          const Icon = step.icon;
          const stepDate = getStepDate(step.key);

          return (
            <div key={step.key} className='flex flex-col items-center relative z-10'>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs ${
                  isCompleted
                    ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                    : isCurrent
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/30 scale-105'
                      : 'bg-card text-muted-foreground border-2 border-muted'
                }`}
              >
                {isCompleted ? <Check className='w-5 h-5' /> : <Icon className='w-5 h-5' />}
              </div>
              <div className='text-center mt-2 px-1'>
                <p
                  className={`text-xs font-semibold ${
                    isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </p>
                {stepDate && (
                  <p className='text-[10px] text-muted-foreground mt-0.5'>{stepDate}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimelineStepper;
