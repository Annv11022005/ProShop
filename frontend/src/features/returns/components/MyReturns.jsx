import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMyReturns, useCancelReturn } from '../hooks/useReturns';
import ReturnTrackingModal from './ReturnTrackingModal';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Message } from '@/components/AlertMessage';
import { formatCurrency } from '@/lib/utils';
import {
  RotateCcw,
  ArrowRight,
  Truck,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

const STATUS_CONFIG = {
  PENDING_APPROVAL: {
    label: 'Under Review',
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-300',
    icon: Clock,
  },
  APPROVED: {
    label: 'Approved (Awaiting Shipment)',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border-blue-300',
    icon: CheckCircle2,
  },
  RETURNING: {
    label: 'Returning In Transit',
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-300',
    icon: Truck,
  },
  RECEIVED: {
    label: 'Received at Warehouse',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 border-purple-300',
    icon: Package,
  },
  COMPLETED: {
    label: 'Completed & Resolved',
    color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-300',
    icon: CheckCircle2,
  },
  REJECTED: {
    label: 'Request Rejected',
    color: 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border-rose-300',
    icon: XCircle,
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-300',
    icon: AlertCircle,
  },
};

export default function MyReturns() {
  const { returns, isPending, error, refetch } = useMyReturns();
  const { cancelReturnRequest, isPending: pendingCancel } = useCancelReturn();

  const [selectedReturn, setSelectedReturn] = useState(null);
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);

  const handleCancel = async (returnId) => {
    if (!window.confirm('Are you sure you want to cancel this return request?')) {
      return;
    }

    try {
      await cancelReturnRequest(returnId);
      toast.success('Return request has been cancelled.');
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to cancel request.');
    }
  };

  const handleOpenTracking = (ret) => {
    setSelectedReturn(ret);
    setTrackingModalOpen(true);
  };

  if (isPending) {
    return (
      <div className='flex justify-center items-center py-16'>
        <Spinner className='size-8' />
      </div>
    );
  }

  if (error) {
    return <Message>{error.message || 'Failed to load return requests'}</Message>;
  }

  if (!returns || returns.length === 0) {
    return (
      <div className='p-8 rounded-xl border border-dashed border-border text-center flex flex-col items-center justify-center gap-3 bg-muted/20'>
        <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary'>
          <RotateCcw className='w-6 h-6' />
        </div>
        <h3 className='text-lg font-semibold text-foreground'>No Return Requests</h3>
        <p className='text-sm text-muted-foreground max-w-md'>
          You have not submitted any return or exchange requests yet. If you have an issue with a delivered order, you can initiate a return from the Order Details page.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between pb-2 border-b'>
        <div>
          <h2 className='text-xl font-bold text-foreground flex items-center gap-2'>
            <RotateCcw className='w-5 h-5 text-primary' />
            Returns & Refunds
          </h2>
          <p className='text-xs text-muted-foreground'>
            Track the approval status and shipping progress of your product returns.
          </p>
        </div>
        <span className='text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded-full'>
          {returns.length} {returns.length === 1 ? 'Request' : 'Requests'}
        </span>
      </div>

      <div className='grid gap-4'>
        {returns.map((ret) => {
          const config = STATUS_CONFIG[ret.status] || STATUS_CONFIG.PENDING_APPROVAL;
          const StatusIcon = config.icon;
          const orderId = ret.order?._id || ret.order;

          return (
            <div
              key={ret._id}
              className='p-5 rounded-xl border border-border bg-card shadow-2xs hover:shadow-xs transition-shadow flex flex-col gap-3'
            >
              {/* Header: Request ID, Type, Status */}
              <div className='flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3'>
                <div className='flex items-center gap-2 flex-wrap'>
                  <span className='font-bold text-sm text-foreground'>
                    Request #{ret._id.slice(-6).toUpperCase()}
                  </span>
                  <span className='text-xs px-2 py-0.5 rounded font-medium bg-muted text-muted-foreground'>
                    {ret.type === 'RETURN_REFUND' ? 'Refund Request' : 'Exchange Request'}
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    • Submitted on {new Date(ret.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.color}`}
                >
                  <StatusIcon className='w-3.5 h-3.5' />
                  <span>{config.label}</span>
                </div>
              </div>

              {/* Body: Reason, Details, Linked Order */}
              <div className='grid sm:grid-cols-2 gap-3 text-sm'>
                <div className='space-y-1'>
                  <p className='text-xs text-muted-foreground'>Reason:</p>
                  <p className='font-medium text-foreground'>{ret.reason}</p>
                  {ret.description && (
                    <p className='text-xs text-muted-foreground italic mt-1'>
                      "{ret.description}"
                    </p>
                  )}
                </div>

                <div className='space-y-1 sm:text-right'>
                  <p className='text-xs text-muted-foreground'>Linked Order:</p>
                  <Link
                    to={`/order/${orderId}`}
                    className='inline-flex items-center gap-1 font-semibold text-primary hover:underline text-sm'
                  >
                    <span>Order #{orderId?.slice(-6).toUpperCase()}</span>
                    <ExternalLink className='w-3.5 h-3.5' />
                  </Link>
                  {ret.refundAmount > 0 && ret.type === 'RETURN_REFUND' && (
                    <p className='text-xs text-muted-foreground mt-1'>
                      Estimated Refund: <strong className='text-foreground'>{formatCurrency(ret.refundAmount)}</strong>
                    </p>
                  )}
                </div>
              </div>

              {/* Warehouse & Customer Tracking details if approved */}
              {ret.adminReview?.warehouseAddress && (
                <div className='p-3 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-xs space-y-1'>
                  <p className='font-semibold text-blue-900 dark:text-blue-200'>
                    Return Warehouse Destination:
                  </p>
                  <p className='text-blue-800/90 dark:text-blue-300'>
                    {ret.adminReview.warehouseAddress}
                  </p>
                  {ret.adminReview.instructions && (
                    <p className='text-muted-foreground mt-1'>
                      Instruction: {ret.adminReview.instructions}
                    </p>
                  )}
                </div>
              )}

              {ret.customerTracking?.trackingCode && (
                <div className='p-3 rounded-lg bg-muted/60 text-xs flex items-center justify-between flex-wrap gap-2'>
                  <div>
                    <span className='text-muted-foreground'>Carrier: </span>
                    <strong className='text-foreground'>{ret.customerTracking.carrier}</strong>
                    <span className='mx-2 text-muted-foreground'>•</span>
                    <span className='text-muted-foreground'>Tracking Code: </span>
                    <strong className='text-primary font-mono'>{ret.customerTracking.trackingCode}</strong>
                  </div>
                  <span className='text-muted-foreground'>
                    Shipped: {new Date(ret.customerTracking.shippedAt).toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className='flex items-center justify-between gap-2 pt-2 border-t border-border/40 mt-1 flex-wrap'>
                <Link to={`/order/${orderId}`}>
                  <Button variant='ghost' size='sm' className='text-xs gap-1 h-8'>
                    View Order
                    <ArrowRight className='w-3 h-3' />
                  </Button>
                </Link>

                <div className='flex items-center gap-2'>
                  {ret.status === 'PENDING_APPROVAL' && (
                    <Button
                      variant='outline'
                      size='sm'
                      className='text-xs text-destructive border-destructive/30 hover:bg-destructive/10 h-8'
                      disabled={pendingCancel}
                      onClick={() => handleCancel(ret._id)}
                    >
                      Cancel Request
                    </Button>
                  )}

                  {ret.status === 'APPROVED' && (
                    <Button
                      size='sm'
                      className='text-xs gap-1.5 h-8 bg-primary hover:bg-primary/90'
                      onClick={() => handleOpenTracking(ret)}
                    >
                      <Truck className='w-3.5 h-3.5' />
                      Submit Tracking Info
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedReturn && (
        <ReturnTrackingModal
          returnRequest={selectedReturn}
          open={trackingModalOpen}
          onOpenChange={setTrackingModalOpen}
          onSuccess={refetch}
        />
      )}
    </div>
  );
}
