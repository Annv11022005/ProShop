import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Star,
  ArrowRight,
  ShieldCheck,
  Zap,
  ShoppingBag,
  Flame,
} from 'lucide-react';
import ProductPrice from '../product/components/ProductPrice';

const HomeBanner = ({ product, badge = 'Featured Products' }) => {
  const selectedProduct = useMemo(() => {
    if (!product) return null;
    if (Array.isArray(product)) {
      if (product.length === 0) return null;
      // eslint-disable-next-line react-hooks/purity
      const randomIndex = Math.floor(Math.random() * product.length);
      return product[randomIndex];
    }
    return product;
  }, [product]);

  if (!selectedProduct) return null;

  const price = selectedProduct.variants?.[0]?.price;
  const originalPrice = selectedProduct.variants?.[0]?.originalPrice;

  const imageUrl =
    selectedProduct.image ||
    (Array.isArray(selectedProduct.images)
      ? selectedProduct.images[0]?.url || selectedProduct.images[0]
      : '');

  const targetLink = `/product/${selectedProduct.slug || selectedProduct._id}`;

  return (
    <div className='relative overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-2xl border border-primary-foreground/10 my-4'>
      {/* Background Decorative Ambient Glows */}
      <div
        aria-hidden
        className='pointer-events-none absolute -right-16 -top-20 h-96 w-96 rounded-full bg-linear-to-br from-accent-primary to-accent-secondary opacity-25 blur-3xl'
      />
      <div
        aria-hidden
        className='pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-linear-to-tr from-accent-secondary to-accent-primary opacity-20 blur-3xl'
      />

      <div className='relative grid items-center gap-8 p-6 md:grid-cols-12 md:p-10 lg:p-12'>
        {/* Left Column: Product Information & Action */}
        <div className='flex flex-col gap-5 md:col-span-7 z-10'>
          <div className='flex flex-wrap items-center gap-2.5'>
            {badge && (
              <span className='inline-flex items-center gap-1.5 rounded-full bg-accent-primary/15 border border-accent-primary/30 px-3.5 py-1 text-xs font-semibold text-accent-primary backdrop-blur-md'>
                <Flame
                  size={14}
                  className='animate-pulse text-accent-primary'
                />
                {badge}
              </span>
            )}
            {selectedProduct.brand && (
              <span className='rounded-full bg-primary-foreground/30 border border-primary-foreground/15 px-3 py-1 text-xs font-medium text-primary-foreground/80 backdrop-blur-md'>
                {selectedProduct.brand}
              </span>
            )}
          </div>

          {/* Product Title & Subtitle */}
          <div>
            <Link to={targetLink} className='group block'>
              <h2 className='text-3xl font-extrabold tracking-tight text-primary-foreground transition-colors duration-200 group-hover:text-accent-primary md:text-4xl lg:text-5xl leading-tight line-clamp-2'>
                {selectedProduct.name}
              </h2>
            </Link>
            {selectedProduct.subtitle && (
              <p className='mt-3 text-base text-primary-foreground/75 leading-relaxed md:text-lg line-clamp-2 max-w-xl'>
                {selectedProduct.subtitle}
              </p>
            )}
          </div>

          {/* Key Selling Highlights / Tags */}
          <div className='flex flex-wrap items-center gap-3 pt-1 text-xs text-primary-foreground/80'>
            {selectedProduct.rating > 0 && (
              <div className='flex items-center gap-1 rounded-lg bg-primary-foreground/10 border border-primary-foreground/15 px-2.5 py-1.5 backdrop-blur-xs'>
                <Star
                  size={14}
                  className='fill-green-rating text-green-rating'
                />
                <span className='font-bold text-primary-foreground'>
                  {selectedProduct.rating}
                </span>
                {selectedProduct.numReviews > 0 && (
                  <span className='text-primary-foreground/60'>
                    ({selectedProduct.numReviews})
                  </span>
                )}
              </div>
            )}
            <div className='flex items-center gap-1.5 rounded-lg bg-primary-foreground/10 border border-primary-foreground/15 px-2.5 py-1.5 backdrop-blur-xs'>
              <ShieldCheck size={14} className='text-green-rating' />
              <span>Genuine 100%</span>
            </div>
            <div className='flex items-center gap-1.5 rounded-lg bg-primary-foreground/10 border border-primary-foreground/15 px-2.5 py-1.5 backdrop-blur-xs'>
              <Zap size={14} className='text-accent-primary' />
              <span>Fast 12-hour delivery</span>
            </div>
          </div>

          {/* Price & Action Section */}
          <div className='mt-2 flex flex-col items-start gap-4 sm:gap-6'>
            <ProductPrice price={price} originalPrice={originalPrice} />

            <div className='flex items-center gap-3 w-full sm:w-auto'>
              <Button
                asChild
                size='lg'
                className='w-full sm:w-auto bg-linear-to-br from-accent-primary to-accent-secondary text-white font-semibold shadow-lg shadow-accent-primary/20 transition-all duration-300  '
              >
                <Link
                  to={targetLink}
                  className='flex items-center justify-center gap-2'
                >
                  <ShoppingBag size={18} />
                  <span>Buy Now</span>
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className='relative flex items-center justify-center md:col-span-5 z-10'>
          <Link
            to={targetLink}
            className='group relative block w-full max-w-sm'
          >
            <img
              src={imageUrl}
              alt={selectedProduct.name}
              className='h-64 sm:h-72 md:h-80 w-full object-contain transition-transform duration-500'
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
