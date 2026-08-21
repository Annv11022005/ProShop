import { Button } from '@/components/ui/button';
import { useGetCouponByCode } from '@/features/coupon/hooks/useCoupon';
import { formatCurrency } from '@/lib/utils';
import { Tag, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PromoCodeField({
  onApply,
  onRemove,
  price,
  initialCouponCode,
  itemsPrice,
}) {
  const [value, setValue] = useState(initialCouponCode || '');
  const [submittedCode, setSubmittedCode] = useState(initialCouponCode || '');
  const [customError, setCustomError] = useState('');
  const { isPending, error, coupon } = useGetCouponByCode(submittedCode);

  useEffect(() => {
    setValue(initialCouponCode || '');
    setSubmittedCode(initialCouponCode || '');
    if (!initialCouponCode) {
      setCustomError('');
    }
  }, [initialCouponCode]);

  useEffect(() => {
    if (!submittedCode) return;

    if (coupon) {
      if (coupon.useCount >= coupon.usageLimit) {
        setCustomError('The discount code has reached its usage limit.');
        onApply?.(null);
        return;
      }
      if (coupon.minSpend && itemsPrice < coupon.minSpend) {
        setCustomError(
          `The order must be at least ${coupon.minSpend.toLocaleString()} VND to apply this code.`,
        );
        onApply?.(null);
        return;
      }

      setCustomError('');
      onApply?.(coupon);
    }
  }, [coupon, itemsPrice, submittedCode, onApply]);

  useEffect(() => {
    if (error && submittedCode) {
      onApply?.(null);
    }
  }, [error, submittedCode, onApply]);

  const appliedCode = initialCouponCode || coupon?.code;

  function submitPromoHandler() {
    const code = value.trim();
    if (!code) {
      handleRemove();
      return;
    }
    setCustomError('');
    setSubmittedCode(code);
  }

  function handleRemove() {
    setValue('');
    setSubmittedCode('');
    setCustomError('');
    if (onRemove) {
      onRemove();
    } else {
      onApply?.(null);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitPromoHandler();
    }
  }

  const apiErrorMsg = error
    ? error?.response?.data?.message || 'Invalid coupon code.'
    : '';
  const displayError = customError || apiErrorMsg;

  return (
    <div className='flex w-full flex-col gap-2'>
      <label
        htmlFor='promo-code'
        className='text-sm font-medium text-neutral-900'
      >
        Coupon
      </label>

      {appliedCode && price > 0 && !displayError ? (
        <div className='flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800'>
          <div className='flex items-center gap-2'>
            <Tag className='size-4 text-emerald-600' />
            <span>
              <strong className='font-semibold'>{appliedCode}</strong> (-{formatCurrency(price)})
            </span>
          </div>
          <Button
            size='sm'
            variant='ghost'
            type='button'
            onClick={handleRemove}
            className='h-7 px-2 text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700'
          >
            <X className='mr-1 size-3.5' />
            Remove
          </Button>
        </div>
      ) : (
        <div className='flex gap-2'>
          <input
            id='promo-code'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Enter code...'
            className='w-full min-w-0 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400'
          />
          <Button
            size='lg'
            variant='outline'
            disabled={isPending}
            type='button'
            onClick={submitPromoHandler}
          >
            Apply
          </Button>
        </div>
      )}

      {displayError && <p className='text-sm text-red-500'>{displayError}</p>}
    </div>
  );
}
