import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCancelOrder } from '../hooks/useOrders';

const CANCEL_REASONS = [
  'Changed my mind / Don’t want to buy anymore',
  'Ordered wrong size, color, or variant',
  'Need to change shipping address or payment method',
  'Found a better price elsewhere',
  'Delivery time is too long',
  'Other reason',
];

export default function CancelOrderModal({ orderId, open, onOpenChange, onSuccess }) {
  const [reason, setReason] = useState(CANCEL_REASONS[0]);
  const [note, setNote] = useState('');

  const { cancelOrderItem, isPending } = useCancelOrder();

  const handleCancelSubmit = async (e) => {
    e.preventDefault();

    if (!reason) {
      toast.error('Please select a cancellation reason.');
      return;
    }

    try {
      await cancelOrderItem({
        id: orderId,
        reason,
        note: note.trim(),
      });

      toast.success('Order has been cancelled successfully.');
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Failed to cancel order. Please try again.',
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md p-6'>
        <DialogHeader className='border-b pb-4'>
          <DialogTitle className='text-lg font-bold flex items-center gap-2 text-destructive'>
            <AlertTriangle className='w-5 h-5 text-destructive' />
            Cancel Order
          </DialogTitle>
          <p className='text-xs text-muted-foreground mt-1'>
            Are you sure you want to cancel this order? This action will release reserved stock and return coupon uses immediately.
          </p>
        </DialogHeader>

        <form onSubmit={handleCancelSubmit} className='space-y-4 pt-2'>
          <div className='space-y-1.5'>
            <Label htmlFor='cancelReason' className='text-xs font-semibold'>
              Reason for Cancellation:
            </Label>
            <select
              id='cancelReason'
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className='w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
            >
              {CANCEL_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='cancelNote' className='text-xs font-semibold'>
              Additional Explanation (Optional):
            </Label>
            <Textarea
              id='cancelNote'
              rows={3}
              placeholder='Tell us more about why you want to cancel...'
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className='resize-none'
            />
          </div>

          <DialogFooter className='border-t pt-4 gap-2'>
            <DialogClose asChild>
              <Button type='button' variant='outline' disabled={isPending}>
                Keep Order
              </Button>
            </DialogClose>
            <Button type='submit' variant='destructive' disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin mr-2' />
                  Cancelling...
                </>
              ) : (
                'Confirm Cancel'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
