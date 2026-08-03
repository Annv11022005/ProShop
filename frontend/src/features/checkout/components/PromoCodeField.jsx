import { Button } from '@/components/ui/button';
import { useGetCouponByCode } from '@/features/coupon/hooks/useCoupon';
import { formatCurrency } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function PromoCodeField({ onApply, price, initialCouponCode }) {
  const [value, setValue] = useState(initialCouponCode || '');
  const [submittedCode, setSubmittedCode] = useState(initialCouponCode || '');
  const { isPending, error, coupon } = useGetCouponByCode(submittedCode);
  const errorMsg = error
    ? error?.response?.data?.message || 'Invalid coupon code.'
    : '';

  useEffect(() => {
    if (coupon) {
      onApply?.(coupon);
    }
  }, [coupon, onApply]);

  useEffect(() => {
    if (error) {
      onApply?.(null);
    }
  }, [error, onApply]);

  const appliedCode = coupon?.code;

  function submitPromoHandler() {
    const code = value.trim();
    if (!code) {
      setSubmittedCode('');
      onApply?.(null);
      return;
    }
    setSubmittedCode(code);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitPromoHandler();
    }
  }

  return (
    <div className='flex w-full flex-col gap-2'>
      <label
        htmlFor='promo-code'
        className='text-sm font-medium text-neutral-900'
      >
        Coupon
      </label>
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
          disabled={isPending || (!value.trim() && !appliedCode)}
          type='button'
          onClick={submitPromoHandler}
        >
          Apply
        </Button>
      </div>
      {errorMsg && <p className='text-sm text-red-500'>{errorMsg}</p>}
      {!errorMsg && appliedCode && price > 0 && (
        <p className='text-sm text-neutral-500'>
          <strong className='text-neutral-900'>{appliedCode}</strong> saved{' '}
          {formatCurrency(price)}.
        </p>
      )}
    </div>
  );
}
