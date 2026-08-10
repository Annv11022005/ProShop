import { useState } from 'react';
import FilterTabs from './components/FilterTabs';
import CouponCard from './components/CouponCard';
import { useGetCategory } from './hooks/useCoupons';
import { Spinner } from '@/components/ui/spinner';
import { Message } from '@/components/AlertMessage';
import { useGetAllCoupon } from './hooks/useCoupons';

export default function AllCouponPage() {
  const { isPending, error, categories } = useGetCategory();

  const {
    isPending: pendCoupon,
    error: errCoupon,
    coupons: couponResponse,
  } = useGetAllCoupon();

  const [activeCategory, setActiveCategory] = useState('All');
  const coupons = couponResponse?.coupons ?? [];

  const filtered =
    activeCategory === 'All'
      ? coupons
      : coupons.filter((c) => c.category === activeCategory);

  if (isPending || pendCoupon) return <Spinner />;

  if (error || errCoupon)
    return <Message>{error?.message || errCoupon?.message}</Message>;

  return (
    <div>
      <section className='mx-auto w-full max-w-6xl'>
        <header className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
          <div className='flex min-w-0 flex-col gap-2'>
            <h1 className='text-xs font-semibold tracking-widest text-neutral-500 uppercase'>
              Offers
            </h1>
            <h2 className='mt-2 text-2xl font-bold text-neutral-900'>
              Current Offers
            </h2>
            <p className='mt-2 text-sm text-neutral-600'>
              View current offers and copy codes directly to clipboard.
            </p>
          </div>
          <div className='inline-flex shrink-0 items-baseline gap-1.5 self-start text-sm tabular-nums text-muted-foreground sm:self-auto'>
            <p className='text-sm text-neutral-500'>
              Showing {filtered.length} <span>offers</span>
            </p>
          </div>
        </header>

        <FilterTabs
          categories={categories}
          active={activeCategory}
          onChange={setActiveCategory}
        />

        <div className='mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5'>
          {filtered.map((coupon) => (
            <CouponCard key={coupon._id} coupon={coupon} />
          ))}
        </div>
      </section>
    </div>
  );
}
