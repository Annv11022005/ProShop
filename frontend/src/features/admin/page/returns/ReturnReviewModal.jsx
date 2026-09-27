import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  X,
  PackageCheck,
  Copy,
  ExternalLink,
  MapPin,
  Truck,
  Loader2,
  Clock,
  ShieldCheck,
  CreditCard,
  User,
  MessageSquare,
  Image as ImageIcon,
  Building,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import {
  useReviewReturn,
  useMarkReturnReceived,
  useCompleteReturn,
} from '@/features/returns/hooks/useReturns';

const REASON_LABELS = {
  DAMAGED_DEFECTIVE: 'Item is defective, damaged, or broken upon arrival',
  WRONG_ITEM: 'Wrong item, color, or size delivered',
  NOT_AS_DESCRIBED: 'Product does not match image or description',
  CHANGE_OF_MIND: 'Changed mind / no longer needed',
  OTHER: 'Other reason',
};

const STATUS_CONFIGS = {
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
    label: 'Received by Warehouse',
    color: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
    icon: PackageCheck,
  },
  COMPLETED: {
    label: 'Completed',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    icon: CheckCircle2,
  },
  REJECTED: {
    label: 'Rejected',
    color: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    icon: XCircle,
  },
};

export default function ReturnReviewModal({ returnDoc, open, onOpenChange, onSuccess }) {
  const [decisionMode, setDecisionMode] = useState('APPROVE');
  const [rejectReason, setRejectReason] = useState('');
  const [warehouseAddress, setWarehouseAddress] = useState(
    'ProShop Central Hub, 123 Dien Bien Phu, Ward 15, Binh Thanh District, HCMC (Hotline: 0987654321)',
  );
  const [instructions, setInstructions] = useState(
    'Please pack items securely in original packaging, write order ID on the box, and drop off at courier.',
  );
  const [restock, setRestock] = useState(true);
  const [completeNote, setCompleteNote] = useState('');
  const [copiedField, setCopiedField] = useState('');

  const { reviewReturnRequest, isPending: isReviewing } = useReviewReturn();
  const { markReceived, isPending: isReceiving } = useMarkReturnReceived();
  const { completeReturnRequest, isPending: isCompleting } = useCompleteReturn();

  if (!returnDoc) return null;

  const isRefund = returnDoc.type === 'RETURN_REFUND';
  const statusConfig = STATUS_CONFIGS[returnDoc.status] || STATUS_CONFIGS.PENDING_APPROVAL;
  const StatusIcon = statusConfig.icon;
  const reasonText = REASON_LABELS[returnDoc.reason] || returnDoc.reason;
  const orderId = returnDoc.order?._id
    ? returnDoc.order._id.slice(-8).toUpperCase()
    : returnDoc.order?.slice?.(-8)?.toUpperCase();

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Copied ${fieldName} to clipboard!`);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleApprove = async () => {
    if (!warehouseAddress.trim()) {
      toast.error('Please enter the return warehouse address.');
      return;
    }

    try {
      await reviewReturnRequest({
        id: returnDoc._id,
        action: 'APPROVE',
        warehouseAddress: warehouseAddress.trim(),
        instructions: instructions.trim(),
      });
      toast.success('Return request approved! Notification sent to customer.');
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to approve return request.');
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please enter a rejection reason.');
      return;
    }

    try {
      await reviewReturnRequest({
        id: returnDoc._id,
        action: 'REJECT',
        rejectReason: rejectReason.trim(),
      });
      toast.success('Return request rejected.');
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to reject return request.');
    }
  };

  const handleMarkReceived = async () => {
    try {
      await markReceived(returnDoc._id);
      toast.success('Confirmed receipt of return package at warehouse!');
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Action failed.');
    }
  };

  const handleComplete = async () => {
    try {
      await completeReturnRequest({
        id: returnDoc._id,
        restock,
        note: completeNote.trim(),
      });
      toast.success(
        isRefund
          ? 'Refund confirmed and case completed successfully!'
          : 'Exchange confirmed and case completed successfully!',
      );
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to complete return request.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className='!max-w-[920px] w-[920px] max-w-[96vw] p-0 gap-0 rounded-2xl overflow-hidden shadow-2xl border bg-card'
      >
        {/* Top Header Bar */}
        <div className='px-6 py-3.5 border-b flex items-center justify-between bg-muted/20'>
          <div className='flex items-center gap-3'>
            <div className='w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-2xs'>
              <RotateCcw className='w-5 h-5' />
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <h2 className='text-base font-bold text-foreground'>
                  Case #{returnDoc._id?.slice(-6)?.toUpperCase()}
                </h2>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusConfig.color}`}
                >
                  <StatusIcon className='w-3 h-3' />
                  {statusConfig.label}
                </span>
                <span className='px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary text-primary-foreground shadow-2xs'>
                  {isRefund ? 'Refund' : 'Exchange'}
                </span>
              </div>
              <p className='text-[11px] text-muted-foreground mt-0.5'>
                Order <strong className='text-primary font-mono'>#{orderId}</strong> &bull; Customer <strong className='text-foreground'>{returnDoc.user?.name || 'Customer'}</strong> ({returnDoc.user?.email})
              </p>
            </div>
          </div>

          {/* Right Header Area */}
          <div className='flex items-center gap-4'>
            <div className='text-right pr-3 border-r border-border/80'>
              <span className='text-[10px] text-muted-foreground uppercase font-semibold block'>
                Refund Amount
              </span>
              <span className='font-bold text-emerald-600 dark:text-emerald-400 text-sm'>
                {formatCurrency(returnDoc.refundAmount || 0)}
              </span>
            </div>

            <DialogClose asChild>
              <button
                type='button'
                className='w-7 h-7 rounded-full bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors'
                title='Close'
              >
                <X className='w-3.5 h-3.5' />
              </button>
            </DialogClose>
          </div>
        </div>

        {/* 2-Column Content Body (No Scroll) */}
        <div className='p-5 grid grid-cols-1 md:grid-cols-2 gap-5 bg-background'>
          {/* Left Column: Customer Claim, Proof & Bank Info */}
          <div className='space-y-3.5'>
            {/* Issue Details Box */}
            <div className='p-3 rounded-xl border bg-muted/20 space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5'>
                  <MessageSquare className='w-3.5 h-3.5 text-primary' />
                  Reason:
                </span>
                <span className='text-[11px] font-semibold text-foreground px-2 py-0.5 rounded bg-background border truncate max-w-[240px]' title={reasonText}>
                  {reasonText}
                </span>
              </div>
              <div>
                <span className='text-[10px] text-muted-foreground uppercase font-semibold block mb-0.5'>
                  Customer Description:
                </span>
                <p className='text-xs text-foreground bg-card p-2 rounded-lg border leading-relaxed line-clamp-2 font-normal'>
                  {returnDoc.description}
                </p>
              </div>
            </div>

            {/* Proof Images (Compact Row) */}
            {returnDoc.images && returnDoc.images.length > 0 && (
              <div className='space-y-1.5'>
                <div className='flex items-center justify-between text-xs'>
                  <span className='font-bold text-foreground flex items-center gap-1.5'>
                    <ImageIcon className='w-3.5 h-3.5 text-primary' />
                    Proof Photos ({returnDoc.images.length})
                  </span>
                  <span className='text-[10px] text-muted-foreground'>Click thumbnail to zoom</span>
                </div>
                <div className='flex items-center gap-2'>
                  {returnDoc.images.slice(0, 5).map((imgUrl, idx) => (
                    <a
                      key={idx}
                      href={imgUrl}
                      target='_blank'
                      rel='noreferrer'
                      className='group relative w-14 h-14 rounded-lg overflow-hidden border-2 border-border hover:border-primary shrink-0 transition-all bg-card shadow-2xs'
                    >
                      <img src={imgUrl} alt={`Proof ${idx + 1}`} className='w-full h-full object-cover' />
                      <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity'>
                        <ExternalLink className='w-3.5 h-3.5' />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Bank Information (Compact Card) */}
            {isRefund && returnDoc.bankInfo && (
              <div className='p-3 rounded-xl border border-primary/20 bg-primary/5 space-y-2'>
                <div className='flex items-center justify-between text-xs'>
                  <span className='font-bold text-foreground flex items-center gap-1.5'>
                    <Building className='w-3.5 h-3.5 text-primary' />
                    Refund Bank Wire Details
                  </span>
                  <span className='text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded'>
                    Manual Wire
                  </span>
                </div>

                <div className='grid grid-cols-3 gap-2 bg-card p-2 rounded-lg border text-xs shadow-2xs'>
                  <div className='space-y-0.5 truncate'>
                    <span className='text-[10px] text-muted-foreground uppercase block'>Bank</span>
                    <strong className='text-foreground text-xs truncate block' title={returnDoc.bankInfo.bankName}>
                      {returnDoc.bankInfo.bankName}
                    </strong>
                  </div>
                  <div className='space-y-0.5'>
                    <span className='text-[10px] text-muted-foreground uppercase block'>Account</span>
                    <div className='flex items-center gap-1'>
                      <strong className='font-mono text-foreground text-xs'>{returnDoc.bankInfo.accountNumber}</strong>
                      <button
                        type='button'
                        onClick={() => copyToClipboard(returnDoc.bankInfo.accountNumber, 'Account Number')}
                        className='text-muted-foreground hover:text-foreground p-0.5'
                        title='Copy Account Number'
                      >
                        {copiedField === 'Account Number' ? (
                          <Check className='w-3 h-3 text-emerald-600' />
                        ) : (
                          <Copy className='w-3 h-3' />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className='space-y-0.5 truncate'>
                    <span className='text-[10px] text-muted-foreground uppercase block'>Beneficiary</span>
                    <strong className='text-foreground text-xs uppercase truncate block' title={returnDoc.bankInfo.accountHolder}>
                      {returnDoc.bankInfo.accountHolder}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Return Shipping (if already shipped) */}
            {returnDoc.returnTracking?.trackingCode && (
              <div className='p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/40 text-xs space-y-1'>
                <div className='font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5'>
                  <Truck className='w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400' />
                  Return Shipment Details
                </div>
                <p className='text-foreground text-xs'>
                  Carrier: <strong>{returnDoc.returnTracking.carrier}</strong> | Code: <strong className='font-mono text-primary'>{returnDoc.returnTracking.trackingCode}</strong>
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Admin Actions & Decision */}
          <div className='flex flex-col justify-between space-y-3'>
            {returnDoc.status === 'PENDING_APPROVAL' && (
              <div className='p-3.5 rounded-xl border bg-card space-y-3 shadow-2xs'>
                <div className='flex items-center justify-between border-b pb-2'>
                  <span className='font-bold text-foreground text-xs flex items-center gap-1.5'>
                    <ShieldCheck className='w-4 h-4 text-primary' />
                    Review Decision
                  </span>
                  <div className='flex items-center p-0.5 bg-muted rounded-lg border'>
                    <button
                      type='button'
                      onClick={() => setDecisionMode('APPROVE')}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                        decisionMode === 'APPROVE'
                          ? 'bg-card text-emerald-600 dark:text-emerald-400 shadow-2xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Approve Request
                    </button>
                    <button
                      type='button'
                      onClick={() => setDecisionMode('REJECT')}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                        decisionMode === 'REJECT'
                          ? 'bg-card text-rose-600 dark:text-rose-400 shadow-2xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Reject Request
                    </button>
                  </div>
                </div>

                {decisionMode === 'APPROVE' ? (
                  <div className='space-y-2.5'>
                    <div className='space-y-1'>
                      <Label htmlFor='wh-addr' className='text-[11px] font-semibold'>
                        Warehouse Address (Where customer will ship items):
                      </Label>
                      <Input
                        id='wh-addr'
                        value={warehouseAddress}
                        onChange={(e) => setWarehouseAddress(e.target.value)}
                        className='text-xs h-8'
                      />
                    </div>
                    <div className='space-y-1'>
                      <Label htmlFor='drop-instr' className='text-[11px] font-semibold'>
                        Packaging Instructions:
                      </Label>
                      <Input
                        id='drop-instr'
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        className='text-xs h-8'
                      />
                    </div>
                  </div>
                ) : (
                  <div className='space-y-1.5 animate-in fade-in-50'>
                    <Label htmlFor='rej-reason' className='text-[11px] font-semibold text-rose-600'>
                      Rejection Reason (Required - sent to customer):
                    </Label>
                    <Textarea
                      id='rej-reason'
                      rows={3}
                      placeholder='Explain why this return cannot be accepted...'
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className='text-xs resize-none'
                    />
                  </div>
                )}
              </div>
            )}

            {/* If status is RECEIVED */}
            {returnDoc.status === 'RECEIVED' && (
              <div className='p-3.5 rounded-xl border bg-card space-y-2.5 shadow-2xs'>
                <div className='font-bold text-foreground text-xs flex items-center gap-1.5'>
                  <CheckCircle2 className='w-4 h-4 text-emerald-600' />
                  Finalize Return & Restock
                </div>
                <div className='flex items-center gap-2 p-2 rounded-lg bg-muted/30 border'>
                  <input
                    type='checkbox'
                    id='restock-check'
                    checked={restock}
                    onChange={(e) => setRestock(e.target.checked)}
                    className='rounded w-4 h-4 text-primary cursor-pointer'
                  />
                  <Label htmlFor='restock-check' className='text-xs font-medium cursor-pointer'>
                    Automatically restock returned items into inventory
                  </Label>
                </div>
                <div className='space-y-1'>
                  <Label htmlFor='note-input' className='text-[11px] font-semibold'>
                    Completion Note:
                  </Label>
                  <Input
                    id='note-input'
                    placeholder='e.g. Bank wire confirmed at 2:00 PM...'
                    value={completeNote}
                    onChange={(e) => setCompleteNote(e.target.value)}
                    className='text-xs h-8'
                  />
                </div>
              </div>
            )}

            {/* If status is APPROVED or RETURNING */}
            {['APPROVED', 'RETURNING'].includes(returnDoc.status) && (
              <div className='p-3.5 rounded-xl border bg-purple-50/60 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800 space-y-1.5 text-xs'>
                <div className='font-bold text-purple-950 dark:text-purple-200 flex items-center gap-1.5'>
                  <PackageCheck className='w-4 h-4 text-purple-600' />
                  Warehouse Receipt Verification
                </div>
                <p className='text-muted-foreground text-xs leading-relaxed'>
                  {returnDoc.status === 'APPROVED'
                    ? 'Request has been approved. Awaiting customer return shipment.'
                    : 'Customer has shipped the parcel. Click the button below once the package arrives at warehouse.'}
                </p>
              </div>
            )}

            {/* If status is COMPLETED or REJECTED */}
            {['COMPLETED', 'REJECTED'].includes(returnDoc.status) && (
              <div className='p-3.5 rounded-xl border bg-muted/30 space-y-1.5 text-xs'>
                <p className='font-bold text-foreground'>
                  Case status: {returnDoc.status}
                </p>
                {returnDoc.adminReview?.rejectReason && (
                  <p className='text-rose-600'>Reason: {returnDoc.adminReview.rejectReason}</p>
                )}
              </div>
            )}

            {/* Action Button at bottom right */}
            <div className='pt-2 flex justify-end gap-2'>
              {returnDoc.status === 'PENDING_APPROVAL' && (
                decisionMode === 'APPROVE' ? (
                  <Button
                    type='button'
                    size='sm'
                    disabled={isReviewing}
                    onClick={handleApprove}
                    className='bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 px-5 shadow-xs w-full sm:w-auto'
                  >
                    {isReviewing ? <Loader2 className='w-4 h-4 animate-spin mr-1.5' /> : <CheckCircle2 className='w-4 h-4 mr-1.5' />}
                    Approve Return Request
                  </Button>
                ) : (
                  <Button
                    type='button'
                    variant='destructive'
                    size='sm'
                    disabled={isReviewing}
                    onClick={handleReject}
                    className='font-semibold text-xs h-9 px-5 shadow-xs w-full sm:w-auto'
                  >
                    {isReviewing ? <Loader2 className='w-4 h-4 animate-spin mr-1.5' /> : <XCircle className='w-4 h-4 mr-1.5' />}
                    Confirm Rejection
                  </Button>
                )
              )}

              {['APPROVED', 'RETURNING'].includes(returnDoc.status) && (
                <Button
                  type='button'
                  size='sm'
                  disabled={isReceiving}
                  onClick={handleMarkReceived}
                  className='bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs h-9 px-5 shadow-xs w-full sm:w-auto'
                >
                  {isReceiving ? <Loader2 className='w-4 h-4 animate-spin mr-1.5' /> : <PackageCheck className='w-4 h-4 mr-1.5' />}
                  Mark Received at Warehouse
                </Button>
              )}

              {returnDoc.status === 'RECEIVED' && (
                <Button
                  type='button'
                  size='sm'
                  disabled={isCompleting}
                  onClick={handleComplete}
                  className='bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 px-5 shadow-xs w-full sm:w-auto'
                >
                  {isCompleting ? <Loader2 className='w-4 h-4 animate-spin mr-1.5' /> : <CheckCircle2 className='w-4 h-4 mr-1.5' />}
                  {isRefund ? 'Confirm Refund & Complete' : 'Confirm Exchange & Complete'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Footer bar */}
        <div className='px-6 py-2.5 border-t bg-muted/20 flex justify-between items-center'>
          <span className='text-[11px] text-muted-foreground'>
            ProShop Return & Exchange Governance Portal
          </span>
          <DialogClose asChild>
            <Button type='button' variant='outline' size='sm' className='text-xs h-8 px-4'>
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
