import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import ReturnRequestModal from './ReturnRequestModal';
import ReturnTrackingModal from './ReturnTrackingModal';
import ReturnReviewModal from '@/features/admin/page/returns/ReturnReviewModal';
import { useCancelReturn } from '../hooks/useReturns';

const REASON_LABELS = {
  DAMAGED_DEFECTIVE: 'Item is defective, damaged, or broken upon arrival',
  WRONG_ITEM: 'Wrong item, color, or size delivered',
  NOT_AS_DESCRIBED: 'Product does not match image or description',
  CHANGE_OF_MIND: 'Changed mind / no longer needed',
  OTHER: 'Other reason',
};

const STATUS_MAP = {
  PENDING_APPROVAL: {
    label: 'Awaiting Admin Review',
    color: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    icon: Clock,
  },
  APPROVED: {
    label: 'Approved - Awaiting Shipment',
    color: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    icon: CheckCircle2,
  },
  RETURNING: {
    label: 'In Transit to Warehouse',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
    icon: Truck,
  },
  RECEIVED: {
    label: 'Received by Warehouse - Inspecting',
    color: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
    icon: PackageCheck,
  },
  COMPLETED: {
    label: 'Completed',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    icon: CheckCircle2,
  },
  REJECTED: {
    label: 'Request Rejected',
    color: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    icon: XCircle,
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/60 dark:text-gray-300 dark:border-gray-700',
    icon: XCircle,
  },
};

export default function ReturnStatusCard({ order, returnRequest, refetchReturn, refetchOrder }) {
  const { userInfo } = useSelector((state) => state.auth);
  const [openRequestModal, setOpenRequestModal] = useState(false);
  const [openTrackingModal, setOpenTrackingModal] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const { cancelReturnRequest, isPending: isCancelling } = useCancelReturn();

  if (!order) return null;

  const isDelivered = order.orderStatus === 'DELIVERED' || order.isDelivered;
  const deliveredDate = order.deliveredAt || order.updatedAt;
  const daysSinceDelivery = Math.floor(
    (Date.now() - new Date(deliveredDate).getTime()) / (1000 * 60 * 60 * 24),
  );
  const remainingDays = 14 - daysSinceDelivery;
  const isEligible = isDelivered && remainingDays >= 0;

  const handleCancel = async () => {
    if (!returnRequest?._id) return;
    if (!window.confirm('Are you sure you want to cancel this return request?')) return;

    try {
      await cancelReturnRequest(returnRequest._id);
      toast.success('Return request cancelled.');
      if (refetchReturn) refetchReturn();
      if (refetchOrder) refetchOrder();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to cancel return request.');
    }
  };

  const isOwner =
    userInfo &&
    (order.user?._id
      ? order.user._id.toString() === userInfo._id.toString()
      : order.user?.toString() === userInfo._id.toString());

  // Case 1: No return request yet
  if (!returnRequest || returnRequest.status === 'CANCELLED') {
    // Admins only review requests. Only regular customers who placed the order can request a return.
    if (!isDelivered || userInfo?.isAdmin || !isOwner) return null;

    return (
      <>
        <div className='p-5 mb-6 rounded-2xl border bg-card shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div className='flex items-start gap-3.5'>
            <div className='w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5'>
              <RotateCcw className='w-5 h-5' />
            </div>
            <div>
              <h3 className='font-semibold text-sm text-foreground flex items-center gap-2'>
                14-Day Return & Exchange Policy
                {isEligible && (
                  <span className='px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'>
                    {remainingDays} day{remainingDays !== 1 ? 's' : ''} left
                  </span>
                )}
              </h3>
              <p className='text-xs text-muted-foreground mt-1 max-w-xl'>
                {isEligible
                  ? 'If items are defective, do not match description, or you wish to exchange for replacements, please submit a request before expiration.'
                  : 'The 14-day return and exchange window for this order has expired.'}
              </p>
            </div>
          </div>

          {isEligible && (
            <Button
              variant='outline'
              onClick={() => setOpenRequestModal(true)}
              className='shrink-0 border-primary text-primary hover:bg-primary/5 font-semibold text-xs'
            >
              <RotateCcw className='w-4 h-4 mr-1.5' />
              Request Return / Exchange
            </Button>
          )}
        </div>

        <ReturnRequestModal
          order={order}
          open={openRequestModal}
          onOpenChange={setOpenRequestModal}
          onSuccess={() => {
            if (refetchReturn) refetchReturn();
            if (refetchOrder) refetchOrder();
          }}
        />
      </>
    );
  }

  // Case 2: Active Return Request exists
  const statusConfig = STATUS_MAP[returnRequest.status] || STATUS_MAP.PENDING_APPROVAL;
  const StatusIcon = statusConfig.icon;
  const isRefund = returnRequest.type === 'RETURN_REFUND';

  return (
    <>
      <div className='p-5 mb-6 rounded-2xl border bg-card shadow-xs transition-all space-y-4'>
        {/* Header */}
        <div className='flex flex-wrap items-center justify-between gap-3 border-b pb-3.5'>
          <div className='flex items-center gap-2.5'>
            <div className='w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0'>
              <RotateCcw className='w-4 h-4' />
            </div>
            <div>
              <span className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                Return & Exchange Case
              </span>
              <h4 className='text-sm font-bold text-foreground'>
                {isRefund ? 'Return & Refund Request' : 'Item Exchange Request'}
              </h4>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}
            >
              <StatusIcon className='w-3.5 h-3.5' />
              <span>{statusConfig.label}</span>
            </span>

            {/* Admin Action Button in Header */}
            {userInfo?.isAdmin ? (
              <Button
                size='sm'
                onClick={() => setOpenReviewModal(true)}
                className='text-xs bg-amber-600 hover:bg-amber-700 text-white font-semibold h-8 px-3 shadow-xs'
              >
                <ShieldCheck className='w-3.5 h-3.5 mr-1' />
                Review / Approve
              </Button>
            ) : (
              returnRequest.status === 'PENDING_APPROVAL' && (
                <Button
                  variant='ghost'
                  size='sm'
                  disabled={isCancelling}
                  onClick={handleCancel}
                  className='text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-8 px-2'
                >
                  Cancel Request
                </Button>
              )
            )}
          </div>
        </div>

        {/* Dedicated Admin Action Highlight Banner */}
        {userInfo?.isAdmin && (
          <div className='p-4 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/90 dark:bg-amber-950/40 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs'>
            <div className='space-y-1'>
              <div className='font-bold text-sm text-amber-900 dark:text-amber-200 flex items-center gap-1.5'>
                <ShieldCheck className='w-4 h-4 text-amber-600 dark:text-amber-400' />
                Admin Action: {returnRequest.status === 'PENDING_APPROVAL' ? 'Decision Required' : 'Manage Return Case'}
              </div>
              <p className='text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed'>
                {returnRequest.status === 'PENDING_APPROVAL'
                  ? 'Customer has submitted this return request. Click below to review proof photos and approve or reject.'
                  : returnRequest.status === 'APPROVED'
                    ? 'Request approved. Waiting for customer to ship return items.'
                    : returnRequest.status === 'RETURNING'
                      ? 'Customer shipped the items. Click below to mark received when package arrives.'
                      : returnRequest.status === 'RECEIVED'
                        ? 'Package received at warehouse. Inspect items to complete refund or exchange.'
                        : 'Case status: ' + returnRequest.status}
              </p>
            </div>

            <Button
              size='sm'
              onClick={() => setOpenReviewModal(true)}
              className='bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 h-9 px-4 shadow-xs'
            >
              <ShieldCheck className='w-3.5 h-3.5 mr-1.5' />
              {returnRequest.status === 'PENDING_APPROVAL'
                ? 'Approve / Reject Request'
                : 'Manage Return Request'}
            </Button>
          </div>
        )}

        {/* Action Callout based on status (Customer side) */}
        {!userInfo?.isAdmin && returnRequest.status === 'APPROVED' && (
          <div className='p-4 rounded-xl border border-blue-300 dark:border-blue-800 bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 text-xs space-y-3'>
            <div className='flex items-start gap-2.5'>
              <CheckCircle2 className='w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5' />
              <div className='space-y-1.5 flex-1'>
                <p className='font-bold text-sm'>
                  Your return request has been approved!
                </p>
                <p className='leading-relaxed'>
                  Please pack the items securely and <strong>drop them off at your nearest courier post office</strong> (e.g. GHTK, Viettel Post, VNPost, etc.) to the warehouse address below:
                </p>
                <div className='p-2.5 rounded-lg bg-card border font-medium text-foreground flex items-center gap-2 text-xs'>
                  <MapPin className='w-4 h-4 text-primary shrink-0' />
                  <span>
                    <strong>Return Warehouse Address:</strong> {returnRequest.adminReview?.warehouseAddress || 'ProShop Central Hub, 123 Dien Bien Phu, Binh Thanh District, HCMC'}
                  </span>
                </div>
                {returnRequest.adminReview?.instructions && (
                  <p className='text-muted-foreground italic text-[11px]'>
                    * Instructions: {returnRequest.adminReview.instructions}
                  </p>
                )}
              </div>
            </div>

            <div className='flex justify-end pt-1'>
              <Button
                size='sm'
                onClick={() => setOpenTrackingModal(true)}
                className='bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9'
              >
                <Truck className='w-4 h-4 mr-1.5' />
                I Have Shipped Items - Submit Tracking
              </Button>
            </div>
          </div>
        )}

        {returnRequest.status === 'REJECTED' && (
          <div className='p-4 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50/80 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 text-xs flex items-start gap-3'>
            <XCircle className='w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5' />
            <div className='space-y-1'>
              <p className='font-bold text-sm'>Return request was rejected</p>
              <p className='leading-relaxed'>
                <strong>Rejection reason:</strong> {returnRequest.adminReview?.rejectReason || 'Does not meet return eligibility criteria.'}
              </p>
            </div>
          </div>
        )}

        {returnRequest.status === 'RETURNING' && (
          <div className='p-4 rounded-xl border border-indigo-300 dark:border-indigo-800 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 text-xs flex items-start gap-3'>
            <Truck className='w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5' />
            <div className='space-y-1'>
              <p className='font-bold text-sm'>Return package is currently in transit to warehouse</p>
              <p>
                Carrier: <strong>{returnRequest.returnTracking?.carrier}</strong> - Tracking Number: <strong className='font-mono text-primary'>{returnRequest.returnTracking?.trackingCode}</strong>
              </p>
              <p className='text-muted-foreground text-[11px]'>
                Our warehouse team will inspect the parcel and process the next step as soon as it arrives.
              </p>
            </div>
          </div>
        )}

        {returnRequest.status === 'RECEIVED' && (
          <div className='p-4 rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-50/80 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 text-xs flex items-start gap-3'>
            <PackageCheck className='w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5' />
            <div className='space-y-1'>
              <p className='font-bold text-sm'>Warehouse received the return parcel</p>
              <p className='text-muted-foreground'>
                Your package has arrived at our facility. Our technicians are inspecting the condition to release your refund or dispatch the replacement item.
              </p>
            </div>
          </div>
        )}

        {returnRequest.status === 'COMPLETED' && (
          <div className='p-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 text-xs flex items-start gap-3'>
            <CheckCircle2 className='w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5' />
            <div className='space-y-1'>
              <p className='font-bold text-sm'>
                {isRefund ? 'Refund Completed Successfully!' : 'Exchange Completed Successfully!'}
              </p>
              <p className='text-muted-foreground'>
                {isRefund
                  ? `Admin has transferred ${formatCurrency(returnRequest.refundAmount || 0)} to the designated bank account.`
                  : 'Your replacement order has been prepared and dispatched.'}
              </p>
            </div>
          </div>
        )}

        {/* Collapsible Info Button */}
        <div className='pt-1'>
          <button
            type='button'
            onClick={() => setShowDetails(!showDetails)}
            className='text-xs font-semibold text-primary flex items-center gap-1 hover:underline'
          >
            {showDetails ? 'Collapse request details' : 'View request details & evidence'}
            {showDetails ? <ChevronUp className='w-3.5 h-3.5' /> : <ChevronDown className='w-3.5 h-3.5' />}
          </button>
        </div>

        {/* Collapsed Details Content */}
        {showDetails && (
          <div className='p-4 rounded-xl bg-muted/40 border text-xs space-y-3 pt-3 animate-in fade-in-50'>
            <div>
              <span className='font-semibold text-muted-foreground'>Reason: </span>
              <span className='font-medium text-foreground'>{REASON_LABELS[returnRequest.reason] || returnRequest.reason}</span>
            </div>

            <div>
              <span className='font-semibold text-muted-foreground'>Detailed Description: </span>
              <p className='mt-1 p-2.5 rounded-lg bg-background border text-foreground leading-relaxed'>
                {returnRequest.description}
              </p>
            </div>

            {returnRequest.images && returnRequest.images.length > 0 && (
              <div>
                <span className='font-semibold text-muted-foreground block mb-1.5'>
                  Proof Photos ({returnRequest.images.length}):
                </span>
                <div className='flex flex-wrap gap-2'>
                  {returnRequest.images.map((img, idx) => (
                    <a
                      key={idx}
                      href={img}
                      target='_blank'
                      rel='noreferrer'
                      className='block w-16 h-16 rounded-lg overflow-hidden border hover:opacity-80 transition-opacity'
                    >
                      <img src={img} alt={`Proof ${idx + 1}`} className='w-full h-full object-cover' />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {isRefund && returnRequest.bankInfo && (
              <div className='p-2.5 rounded-lg bg-background border space-y-1'>
                <span className='font-semibold text-muted-foreground block'>
                  Designated Refund Bank Account:
                </span>
                <p>
                  Bank: <strong>{returnRequest.bankInfo.bankName}</strong> | Account No: <strong className='font-mono'>{returnRequest.bankInfo.accountNumber}</strong> | Beneficiary: <strong>{returnRequest.bankInfo.accountHolder}</strong>
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <ReturnTrackingModal
        returnRequest={returnRequest}
        open={openTrackingModal}
        onOpenChange={setOpenTrackingModal}
        onSuccess={() => {
          if (refetchReturn) refetchReturn();
          if (refetchOrder) refetchOrder();
        }}
      />

      {/* Review Modal for Admin */}
      {userInfo?.isAdmin && (
        <ReturnReviewModal
          returnDoc={returnRequest}
          open={openReviewModal}
          onOpenChange={setOpenReviewModal}
          onSuccess={() => {
            if (refetchReturn) refetchReturn();
            if (refetchOrder) refetchOrder();
          }}
        />
      )}
    </>
  );
}
