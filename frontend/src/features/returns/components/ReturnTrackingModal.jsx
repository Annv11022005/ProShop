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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Truck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateReturnTracking } from '../hooks/useReturns';

const CARRIERS = [
  'GHTK (Giao Hang Tiet Kiem)',
  'Viettel Post',
  'VNPost / Vietnam Post',
  'J&T Express',
  'GHN (Giao Hang Nhanh)',
  'SPX Express',
  'FedEx / DHL',
  'Other Courier',
];

export default function ReturnTrackingModal({ returnRequest, open, onOpenChange, onSuccess }) {
  const [carrier, setCarrier] = useState(CARRIERS[0]);
  const [customCarrier, setCustomCarrier] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const [note, setNote] = useState('');

  const { submitTracking, isPending } = useUpdateReturnTracking();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedCarrier = carrier === 'Other Courier' ? customCarrier.trim() : carrier;

    if (!selectedCarrier) {
      toast.error('Please select or enter the shipping carrier.');
      return;
    }

    if (!trackingCode.trim()) {
      toast.error('Please enter the shipping tracking number.');
      return;
    }

    try {
      await submitTracking({
        id: returnRequest._id,
        carrier: selectedCarrier,
        trackingCode: trackingCode.trim().toUpperCase(),
        note: note.trim(),
      });

      toast.success('Return shipping details updated successfully!');
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Failed to update tracking details. Please try again.',
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md p-6'>
        <DialogHeader className='border-b pb-4'>
          <DialogTitle className='text-lg font-bold flex items-center gap-2'>
            <Truck className='w-5 h-5 text-primary' />
            Submit Return Shipping Details
          </DialogTitle>
          <p className='text-xs text-muted-foreground mt-1'>
            Please enter your parcel tracking information after dropping it off at the courier office.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4 pt-2'>
          <div className='space-y-1.5'>
            <Label htmlFor='carrier' className='text-xs font-semibold'>
              Shipping Carrier:
            </Label>
            <select
              id='carrier'
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              className='w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
            >
              {CARRIERS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {carrier === 'Other Courier' && (
            <div className='space-y-1.5'>
              <Label htmlFor='customCarrier' className='text-xs font-semibold'>
                Carrier Name:
              </Label>
              <Input
                id='customCarrier'
                placeholder='Enter courier name...'
                value={customCarrier}
                onChange={(e) => setCustomCarrier(e.target.value)}
                required
              />
            </div>
          )}

          <div className='space-y-1.5'>
            <Label htmlFor='trackingCode' className='text-xs font-semibold'>
              Tracking Number / Waybill:
            </Label>
            <Input
              id='trackingCode'
              placeholder='e.g., S123456789VN, GHTK12345...'
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              required
            />
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='trackingNote' className='text-xs font-semibold'>
              Additional Notes (Optional):
            </Label>
            <Textarea
              id='trackingNote'
              rows={2}
              placeholder='Any note regarding the package or shipping date...'
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className='resize-none'
            />
          </div>

          <DialogFooter className='border-t pt-4 gap-2'>
            <DialogClose asChild>
              <Button type='button' variant='outline' disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type='submit' disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin mr-2' />
                  Saving...
                </>
              ) : (
                'Confirm Shipment'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
