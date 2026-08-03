import { formatCurrency } from '@/lib/utils';
import { Link } from 'react-router-dom';

export default function CartItemRow({ item }) {
  const { image, name, price, qty, _id, product } = item;
  const productId = product || _id;
  return (
    <div className='flex w-full items-start gap-3'>
      <div className='relative size-16 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100'>
        <img
          src={image}
          alt={name}
          className='absolute inset-0 h-full w-full object-cover'
          loading='lazy'
        />
      </div>

      <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
        <Link to={`/product/${productId}`}>
          <div className='truncate hover:underline hover:italic text-sm font-medium text-neutral-900'>
            {name}
          </div>
        </Link>
        <p className='flex min-w-0 items-center gap-1.5 text-sm text-neutral-500'>
          <span className='shrink-0'>Qty {qty}</span>
        </p>
      </div>

      <div className='flex shrink-0 flex-col items-end gap-1'>
        <span className='text-sm font-medium tabular-nums text-neutral-900'>
          {formatCurrency(price)}
        </span>
        {/* {item.originalPrice && (
          <span className='text-xs tabular-nums text-neutral-400 line-through'>
            {formatCurrency()}
          </span>
        )} */}
      </div>
    </div>
  );
}
