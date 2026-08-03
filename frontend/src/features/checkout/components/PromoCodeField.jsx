// import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';

export default function PromoCodeField() {
  const [value, setValue] = useState('');
  //   const [errorMsg, setErrorMsg] = useState('');

  return (
    <div className='flex w-full flex-col gap-2'>
      <label
        htmlFor='promo-code'
        className='text-sm font-medium text-neutral-900'
      >
        Mã giảm giá
      </label>
      <div className='flex gap-2'>
        <input
          id='promo-code'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={() => {}}
          placeholder='Nhập mã...'
          className='w-full min-w-0 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400'
        />
        <button
          type='button'
          onClick={() => {}}
          className='shrink-0 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50'
        >
          Áp dụng
        </button>
      </div>
      {/* {errorMsg && <p className='text-sm text-red-500'>{errorMsg}</p>}
      {!errorMsg && appliedCode && discount > 0 && (
        <p className='text-sm text-neutral-500'>
          <strong className='text-neutral-900'>{appliedCode}</strong> đã giảm{' '}
          {formatCurrency(discount)}.
        </p>
      )} */}
    </div>
  );
}
