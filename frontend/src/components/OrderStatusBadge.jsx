import React from 'react';
import {
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
  RotateCcw,
} from 'lucide-react';

const STATUS_CONFIG = {
  PENDING_PAYMENT: {
    label: 'Pending Payment',
    color: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    icon: Clock,
  },
  CONFIRMED: {
    label: 'Confirmed',
    color: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    icon: CheckCircle2,
  },
  SHIPPING: {
    label: 'In Transit',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
    icon: Truck,
  },
  DELIVERED: {
    label: 'Delivered',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    icon: PackageCheck,
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    icon: XCircle,
  },
  RETURN_REQUESTED: {
    label: 'Return Requested',
    color: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
    icon: RotateCcw,
  },
  RETURNED: {
    label: 'Returned & Refunded',
    color: 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800',
    icon: RotateCcw,
  },
};

export const getEffectiveStatus = (order) => {
  if (!order) return 'PENDING_PAYMENT';
  if (order.orderStatus === 'RETURNED' || order.returnStatus === 'COMPLETED') return 'RETURNED';
  if (order.returnStatus === 'REQUESTED' || order.returnStatus === 'APPROVED') return 'RETURN_REQUESTED';
  if (order.orderStatus) return order.orderStatus;
  if (order.isCancelled) return 'CANCELLED';
  if (order.isDelivered) return 'DELIVERED';
  if (order.isPaid) return 'CONFIRMED';
  return 'PENDING_PAYMENT';
};

const OrderStatusBadge = ({ order, status: directStatus, showIcon = true, className = '' }) => {
  const status = directStatus || getEffectiveStatus(order);
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING_PAYMENT;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${config.color} ${className}`}
    >
      {showIcon && <Icon className='w-3.5 h-3.5 shrink-0' />}
      <span>{config.label}</span>
    </span>
  );
};

export default OrderStatusBadge;
