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
    <div className='relative overflow-hidden rounded-2xl bg-card text-card-foreground border border-border shadow-xs my-4 p-6 md:p-8 h-auto md:h-95 flex items-center'>
      <div className='grid items-center gap-6 md:grid-cols-12 w-full h-full'>
        <div className='flex flex-col justify-between h-full md:col-span-7 py-1 gap-3'>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='inline-flex items-center gap-1.5 rounded-full bg-secondary text-secondary-foreground border border-border px-3 py-1 text-xs font-semibold'>
              <Flame size={14} className='text-amber-500' />
              {badge}
            </span>

            <span className='rounded-full bg-muted text-muted-foreground border border-border px-3 py-1 text-xs font-medium'>
              {selectedProduct.brand}
            </span>
          </div>

          {/* Product Title & Subtitle */}
          <div className='my-auto space-y-1.5'>
            <Link to={targetLink} className='group block'>
              <h2 className='text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary md:text-3xl lg:text-4xl leading-tight line-clamp-2'>
                {selectedProduct.name}
              </h2>
            </Link>
            {selectedProduct.subtitle && (
              <p className='text-sm text-muted-foreground leading-relaxed md:text-base line-clamp-2 max-w-xl'>
                {selectedProduct.subtitle}
              </p>
            )}
          </div>

          {/* Key Selling Highlights / Tags */}
          <div className='flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground'>
            {selectedProduct.rating > 0 && (
              <div className='flex items-center justify-center gap-1 rounded-lg bg-muted/60 border border-border px-2.5 py-1 font-medium'>
                <Star size={14} className='fill-amber-400 text-amber-400' />
                <span className='font-bold text-foreground'>
                  {selectedProduct.rating}
                </span>
                {selectedProduct.numReviews > 0 && (
                  <span className='text-muted-foreground'>
                    ({selectedProduct.numReviews})
                  </span>
                )}
              </div>
            )}
            <div className='flex items-center gap-1.5 rounded-lg bg-muted/60 border border-border px-2.5 py-1 font-medium'>
              <ShieldCheck size={14} className='text-emerald-500' />
              <span>Genuine 100%</span>
            </div>
            <div className='flex items-center gap-1.5 rounded-lg bg-muted/60 border border-border px-2.5 py-1 font-medium'>
              <Zap size={14} className='text-sky-500' />
              <span>Fast 12-hour delivery</span>
            </div>
          </div>

          {/* Price & Action Section */}
          <div className='flex flex-col items-start gap-3 pt-1'>
            <ProductPrice price={price} originalPrice={originalPrice} />

            <div className='flex items-center gap-3 w-full sm:w-auto'>
              <Button
                size='lg'
                className='w-full sm:w-auto rounded-xl font-semibold shadow-xs'
              >
                <Link to={targetLink} className='flex items-center gap-2'>
                  <ShoppingBag size={18} />
                  <span>Buy Now</span>
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Fixed Height Product Image Showcase */}
        <div className='flex items-center justify-center md:col-span-5 h-64 md:h-full overflow-hidden'>
          <Link
            to={targetLink}
            className='group relative h-full w-full max-w-sm overflow-hidden rounded-xl transition-colors flex items-center justify-center'
          >
            <img
              src={imageUrl}
              alt={selectedProduct.name}
              className='max-h-full max-w-full object-contain transition-transform duration-300'
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
