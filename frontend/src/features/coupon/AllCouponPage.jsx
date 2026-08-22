import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetAllCoupon } from './hooks/useCoupons';

import FilterTabs from './components/FilterTabs';
import CouponCard from './components/CouponCard';
import { useGetCategory } from './hooks/useCoupons';
import { Spinner } from '@/components/ui/spinner';
import { Message } from '@/components/AlertMessage';
import Paginate from '@/components/Paginate';

export default function AllCouponPage() {
  const { pageNumber } = useParams();
  const navigate = useNavigate();
  const { isPending, error, categories } = useGetCategory();

  const [activeCategory, setActiveCategory] = useState('All');

  const {
    isPending: pendCoupon,
    error: errCoupon,
    coupons: couponResponse,
  } = useGetAllCoupon(pageNumber, activeCategory);

  const coupons = couponResponse?.coupons ?? [];

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    navigate('/coupon');
  };

  if (isPending || pendCoupon) return <Spinner />;

  if (error || errCoupon)
    return <Message>{error?.message || errCoupon?.message}</Message>;

  return (
    <div>
      <section className='mx-auto w-full max-w-6xl'>
        <header className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
          <div className='flex min-w-0 flex-col gap-2'>
            <h1 className='text-xs font-semibold tracking-widest text-muted-foreground uppercase'>
              Offers
            </h1>
            <h2 className='mt-2 text-2xl font-bold text-foreground'>
              Current Offers
            </h2>
            <p className='mt-2 text-sm text-muted-foreground'>
              View current offers and copy codes directly to clipboard.
            </p>
          </div>
          <div className='inline-flex shrink-0 items-baseline gap-1.5 self-start text-sm tabular-nums text-muted-foreground sm:self-auto'>
            <p className='text-sm text-muted-foreground'>
              Showing {coupons.length} of{' '}
              {couponResponse?.count ?? coupons.length} <span>offers</span>
            </p>
          </div>
        </header>

        <FilterTabs
          categories={categories}
          active={activeCategory}
          onChange={handleCategoryChange}
        />

        <div className='my-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5'>
          {coupons.map((coupon) => (
            <CouponCard key={coupon._id} coupon={coupon} />
          ))}
        </div>

        {couponResponse.pages > 1 && (
          <Paginate
            page={couponResponse.page}
            pages={couponResponse.pages}
            basePath='/coupon'
          />
        )}
      </section>
    </div>
  );
}
