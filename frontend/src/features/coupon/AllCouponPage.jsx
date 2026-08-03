import { useState } from 'react';
import { Ticket } from 'lucide-react';
import FilterTabs from './components/FilterTabs';
import CouponCard from './components/CouponCard';
import { useGetCategory } from './hooks/useCoupons';
import { Spinner } from '@/components/ui/spinner';
import { Message } from '@/components/ui/Message';
import { useGetAllCoupon } from './hooks/useCoupons';

export default function AllCouponPage() {
  const { isPending, error, categories } = useGetCategory();

  const {
    isPending: pendCoupon,
    error: errCoupon,
    coupons,
  } = useGetAllCoupon();

  const [activeCategory, setActiveCategory] = useState('Tất cả');

  const filtered =
    activeCategory === 'Tất cả'
      ? coupons
      : coupons.filter((c) => c.category === activeCategory);

  if (isPending || pendCoupon) return <Spinner />;

  if (error || errCoupon) return <Message>{error.message}</Message>;

  return (
    <div>
      <section className='mx-auto w-full max-w-6xl'>
        <header className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
          <div className='flex min-w-0 flex-col gap-2'>
            <span className='inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground'>
              <Ticket className='size-3.5' aria-hidden='true' />
              Ưu đãi
            </span>
            <h1 className='text-2xl font-semibold tracking-tight text-primary sm:text-3xl'>
              Các ưu đãi hiện có
            </h1>
            <p className='max-w-prose text-sm leading-5 text-muted-foreground'>
              Xem các ưu đãi hiện tại và sao chép mã trực tiếp vào bộ nhớ tạm.
            </p>
          </div>
          <div className='inline-flex shrink-0 items-baseline gap-1.5 self-start text-sm tabular-nums text-muted-foreground sm:self-auto'>
            <strong className='text-base font-semibold text-primary'>
              {filtered.length}
            </strong>
            <span>ưu đãi</span>
          </div>
        </header>

        <FilterTabs
          categories={categories}
          active={activeCategory}
          onChange={setActiveCategory}
        />

        <div className='mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5'>
          {filtered.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>
      </section>
    </div>
  );
}
