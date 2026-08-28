import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag } from 'lucide-react';
import WishlistIcon from '../WishlistIcon';
import {
  useAddToWishlist,
  useGetWishlist,
  useRemoveFromWishlist,
} from '@/features/authentication/hooks/useWishlist';
import { Spinner } from './spinner';
import { formatCurrency, cn } from '@/lib/utils';

function formatCompact(num) {
  if (num === null || num === undefined) return '0';
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }

  return num.toString();
}

const Product = ({ product }) => {
  const { isPending, wishlist } = useGetWishlist();
  const { addToWishlist } = useAddToWishlist();
  const { removeFromWishlist } = useRemoveFromWishlist();

  const isInWishlist = wishlist?.some((item) => item._id === product._id);

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  const imageUrl =
    typeof product.image === 'string'
      ? product.image
      : product.image?.[0]?.url || product.images?.[0]?.url || '';

  const price = product.price ?? product.variants?.[0]?.price ?? 0;
  const originalPrice =
    product.originalPrice ?? product.variants?.[0]?.originalPrice;

  if (isPending) return <Spinner />;

  const targetLink = `/product/${product.slug || product._id}`;

  return (
    <Card className='group relative flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card text-card-foreground shadow-2xs hover:shadow-md hover:border-primary/30 transition-all duration-200 p-0'>
      {/* Top Media / Image Container */}
      <CardHeader className='p-0 relative overflow-hidden'>
        <div className='aspect-4/3 relative w-full overflow-hidden bg-muted/50'>
          <Link to={targetLink} className='block w-full h-full'>
            <img
              src={imageUrl || '/images/sample.jpg'}
              alt={product.name}
              loading='lazy'
              className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
            />
          </Link>

          {/* Wishlist Button */}
          <WishlistIcon
            isActive={isInWishlist}
            onClick={handleToggleWishlist}
          />
        </div>
      </CardHeader>

      {/* Main Card Content */}
      <CardContent className='flex flex-1 flex-col gap-1'>
        {/* Brand mini subtitle */}
        {product.brand && (
          <span className='text-[11px] font-medium uppercase tracking-wider text-muted-foreground line-clamp-1'>
            {product.brand}
          </span>
        )}

        {/* Product Title */}
        <Link to={targetLink} className='group/title'>
          <h2 className='text-sm font-semibold leading-snug text-foreground group-hover/title:text-primary transition-colors line-clamp-2 min-h-[2.25rem]'>
            {product.name}
          </h2>
        </Link>

        {/* Product Subtitle */}
        {product.subtitle && (
          <p className='text-xs text-muted-foreground line-clamp-1 leading-normal'>
            {product.subtitle}
          </p>
        )}

        {/* Rating & Sold Stats Row */}
        <div className='flex items-center gap-2 text-xs text-muted-foreground mt-auto pt-1.5'>
          <div className='flex items-center gap-1 text-foreground font-semibold'>
            <Star size={12} className='fill-amber-400 text-amber-400' />
            <span className='text-[11px]'>{product.rating || '5.0'}</span>
          </div>

          <span className='text-border'>•</span>

          <span className='text-[11px] text-muted-foreground'>
            {formatCompact(product.qtySold || 0)} sold
          </span>
        </div>
      </CardContent>

      {/* Footer Price & Action Button */}
      <CardFooter className='p-3 mt-auto'>
        <div className='flex items-center justify-between w-full gap-2'>
          <div className='flex flex-col min-w-0'>
            <span className='text-sm font-bold text-foreground truncate'>
              {formatCurrency(price)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className='text-[11px] text-muted-foreground line-through truncate'>
                {formatCurrency(originalPrice)}
              </span>
            )}
          </div>

          <Link
            to={targetLink}
            className={cn(
              buttonVariants({ size: 'sm' }),
              'h-7 px-2.5 text-xs font-medium rounded-lg shrink-0 gap-1 shadow-2xs hover:shadow-xs transition-shadow',
            )}
          >
            <ShoppingBag size={12} />
            <span>Buy</span>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Product;
