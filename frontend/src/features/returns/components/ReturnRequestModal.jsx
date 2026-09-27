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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  AlertTriangle,
  Upload,
  X,
  Loader2,
  RefreshCw,
  RotateCcw,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import { useCreateReturnRequest, useUploadReturnProof } from '../hooks/useReturns';

const REASON_OPTIONS = [
  { value: 'DAMAGED_DEFECTIVE', label: 'Item is defective, damaged, or broken upon arrival' },
  { value: 'WRONG_ITEM', label: 'Wrong item, color, or size delivered' },
  { value: 'NOT_AS_DESCRIBED', label: 'Product does not match image or description' },
  { value: 'CHANGE_OF_MIND', label: 'Changed mind / no longer needed' },
  { value: 'OTHER', label: 'Other reason' },
];

export default function ReturnRequestModal({ order, open, onOpenChange, onSuccess }) {
  const [type, setType] = useState('RETURN_REFUND');
  const [reason, setReason] = useState('DAMAGED_DEFECTIVE');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  const { uploadProof, isPending: isUploading } = useUploadReturnProof();
  const { submitReturnRequest, isPending: isSubmitting } = useCreateReturnRequest();

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (images.length + files.length > 5) {
      toast.error('You can upload a maximum of 5 proof images.');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    try {
      const res = await uploadProof(formData);
      if (res?.images) {
        setImages((prev) => [...prev, ...res.images]);
        toast.success(`Uploaded ${res.images.length} proof image(s).`);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Image upload failed. Please try again.',
      );
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim() || description.trim().length < 10) {
      toast.error('Please describe the issue in detail (at least 10 characters).');
      return;
    }

    if (images.length === 0) {
      toast.error('Please provide at least 1 proof photo of the item condition.');
      return;
    }

    if (type === 'RETURN_REFUND') {
      if (!bankName.trim() || !accountNumber.trim() || !accountHolder.trim()) {
        toast.error('Please fill in complete bank account details for refund.');
        return;
      }
    }

    try {
      await submitReturnRequest({
        orderId: order._id,
        type,
        reason,
        description: description.trim(),
        images,
        bankInfo:
          type === 'RETURN_REFUND'
            ? {
                bankName: bankName.trim(),
                accountNumber: accountNumber.trim(),
                accountHolder: accountHolder.trim().toUpperCase(),
              }
            : undefined,
      });

      toast.success('Return request submitted successfully! Awaiting admin review.');
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Failed to submit return request.',
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6'>
        <DialogHeader className='border-b pb-4'>
          <DialogTitle className='text-xl font-bold flex items-center gap-2'>
            <RotateCcw className='w-5 h-5 text-primary' />
            Return or Exchange Request - Order #{order?._id?.slice(-6)?.toUpperCase()}
          </DialogTitle>
          <p className='text-xs text-muted-foreground mt-1'>
            Applies to the entire order within 14 days of delivery.
          </p>
        </DialogHeader>

        {/* Shipping note callout */}
        <div className='p-4 my-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3'>
          <AlertTriangle className='w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5' />
          <div>
            <p className='font-semibold text-sm mb-1'>Important Return Shipping Policy:</p>
            <p className='leading-relaxed'>
              Once your request is approved by the admin, please <strong>carefully pack the items</strong> and <strong>drop them off at your nearest courier post office</strong> (e.g., GHTK, Viettel Post, VNPost, etc.) to the provided warehouse address. Afterward, return to your order details page to submit the shipping tracking number.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='space-y-5 pt-2'>
          {/* Form Type Selection */}
          <div className='space-y-2'>
            <Label className='text-sm font-semibold'>Desired Resolution:</Label>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <div
                onClick={() => setType('RETURN_REFUND')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  type === 'RETURN_REFUND'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-muted hover:border-border text-foreground'
                }`}
              >
                <RotateCcw className='w-5 h-5 mt-0.5 shrink-0' />
                <div>
                  <div className='font-semibold text-sm'>Return & Refund</div>
                  <div className='text-xs text-muted-foreground mt-0.5'>
                    Refund {formatCurrency(order?.totalPrice || 0)} via bank transfer.
                  </div>
                </div>
              </div>

              <div
                onClick={() => setType('EXCHANGE')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  type === 'EXCHANGE'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-muted hover:border-border text-foreground'
                }`}
              >
                <RefreshCw className='w-5 h-5 mt-0.5 shrink-0' />
                <div>
                  <div className='font-semibold text-sm'>Exchange for Replacement</div>
                  <div className='text-xs text-muted-foreground mt-0.5'>
                    Receive a new replacement item after warehouse inspects returned goods.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reason Select */}
          <div className='space-y-2'>
            <Label htmlFor='return-reason' className='text-sm font-semibold'>
              Reason for Return / Exchange:
            </Label>
            <select
              id='return-reason'
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className='w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
            >
              {REASON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <Label htmlFor='return-desc' className='text-sm font-semibold'>
                Detailed Issue Description:
              </Label>
              <span className='text-xs text-muted-foreground'>
                {description.length}/1000 characters (min 10)
              </span>
            </div>
            <Textarea
              id='return-desc'
              rows={4}
              placeholder='Please describe the specific issue you encountered with the product to help us process your request quickly...'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='resize-none'
            />
          </div>

          {/* Images Upload */}
          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <Label className='text-sm font-semibold'>
                Proof Photos (Up to 5 images):
              </Label>
              <span className='text-xs text-muted-foreground'>
                {images.length}/5 images
              </span>
            </div>

            <div className='grid grid-cols-3 sm:grid-cols-5 gap-3'>
              {images.map((imgUrl, index) => (
                <div
                  key={index}
                  className='relative group aspect-square rounded-lg overflow-hidden border bg-muted'
                >
                  <img
                    src={imgUrl}
                    alt={`Proof ${index + 1}`}
                    className='w-full h-full object-cover'
                  />
                  <button
                    type='button'
                    onClick={() => handleRemoveImage(index)}
                    className='absolute top-1 right-1 p-1 bg-black/70 hover:bg-rose-600 text-white rounded-full transition-colors'
                  >
                    <X className='w-3 h-3' />
                  </button>
                </div>
              ))}

              {images.length < 5 && (
                <label className='flex flex-col items-center justify-center aspect-square border-2 border-dashed border-muted-foreground/30 hover:border-primary rounded-lg cursor-pointer transition-colors bg-muted/20 hover:bg-muted/40'>
                  {isUploading ? (
                    <Loader2 className='w-5 h-5 animate-spin text-primary' />
                  ) : (
                    <>
                      <Upload className='w-5 h-5 text-muted-foreground mb-1' />
                      <span className='text-[10px] text-muted-foreground font-medium text-center px-1'>
                        Add image
                      </span>
                    </>
                  )}
                  <input
                    type='file'
                    multiple
                    accept='image/*'
                    className='hidden'
                    disabled={isUploading}
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Bank Info for Refund */}
          {type === 'RETURN_REFUND' && (
            <div className='p-4 rounded-xl border bg-muted/20 space-y-3 animate-in fade-in-50'>
              <div className='flex items-center gap-2 text-sm font-semibold text-primary'>
                <CheckCircle className='w-4 h-4' />
                Bank Account Information for Refund (Processed manually by Admin):
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                <div className='space-y-1 sm:col-span-2'>
                  <Label htmlFor='bank-name' className='text-xs font-medium'>
                    Bank Name (e.g. Vietcombank, MB Bank, Chase):
                  </Label>
                  <Input
                    id='bank-name'
                    placeholder='Enter your bank name...'
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                  />
                </div>
                <div className='space-y-1'>
                  <Label htmlFor='bank-account' className='text-xs font-medium'>
                    Account Number:
                  </Label>
                  <Input
                    id='bank-account'
                    placeholder='Enter account number...'
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                  />
                </div>
                <div className='space-y-1'>
                  <Label htmlFor='bank-holder' className='text-xs font-medium'>
                    Account Holder Name (CAPITAL LETTERS):
                  </Label>
                  <Input
                    id='bank-holder'
                    placeholder='JOHN DOE'
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value.toUpperCase())}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className='border-t pt-4 gap-2'>
            <DialogClose asChild>
              <Button type='button' variant='outline' disabled={isSubmitting || isUploading}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type='submit'
              disabled={isSubmitting || isUploading}
              className='min-w-[140px]'
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin mr-2' />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
