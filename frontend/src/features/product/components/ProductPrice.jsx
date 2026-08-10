import { formatCurrency } from '@/lib/utils';

export default function ProductPrice({ price, originalPrice }) {
  return (
    <div className='flex flex-wrap items-center gap-3'>
      <div className='flex items-baseline gap-2 text-[18px] font-semibold tabular-nums'>
        <span>{formatCurrency(price)}</span>

        {originalPrice && (
          <span className='font-normal text-muted-foreground line-through'>
            {formatCurrency(originalPrice)}
          </span>
        )}
      </div>
    </div>
  );
}
