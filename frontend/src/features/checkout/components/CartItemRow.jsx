import { formatCurrency } from '@/lib/utils';
import { Link } from 'react-router-dom';

export default function CartItemRow({ item }) {
  const { image, name, price, qty, _id, product } = item;
  const productId = product || _id;
  return (
    <div className='flex w-full items-start gap-3'>
      <div className='relative size-16 shrink-0 overflow-hidden rounded-lg border border-border bg-muted'>
        <img
          src={image}
          alt={name}
          className='absolute inset-0 h-full w-full object-cover'
          loading='lazy'
        />
      </div>

      <div className='flex min-w-0 flex-1 flex-col  gap-0.5'>
        <Link to={`/product/${productId}`}>
          <div className='truncate hover:underline hover:italic text-sm font-medium text-foreground'>
            {name}
          </div>
        </Link>
        <p className='min-w-0 text-sm text-muted-foreground'>
          <span>Qty {qty}</span>
        </p>
      </div>

      <div className='flex shrink-0 flex-col items-end gap-1'>
        <span className='text-[16px] font-medium tabular-nums text-foreground'>
          {formatCurrency(price)}
        </span>
        {/* {item.originalPrice && (
            <span className='text-xs tabular-nums text-muted-foreground line-through'>
            {formatCurrency()}
          </span>
        )} */}
      </div>
    </div>
  );
}
