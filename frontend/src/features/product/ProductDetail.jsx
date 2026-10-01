import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../cart/cartSlice.js';
import { useCreateReview } from './hooks/useReviews.js';
import { useProduct } from './hooks/useProduct';

import {
  ChevronLeft,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Plus,
  Minus,
  Zap,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Row from '@/components/ui/Row';
import Col from '@/components/ui/Col';
import { Spinner } from '@/components/ui/spinner.jsx';
import { Message } from '@/components/AlertMessage.jsx';
import ListReview from './components/ListReview.jsx';
import { Rating } from '@/components/reui/rating';
import { toast } from 'sonner';
import FormReview from './components/FormReview.jsx';
import ProductGallery from './components/ProductGallery.jsx';
import ProductPrice from './components/ProductPrice.jsx';
import { cn, getErrorMessage } from '@/lib/utils';
import {
  useGetWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
} from '@/features/authentication/hooks/useWishlist';
import { useGetDefaultAddress } from '@/features/address/hooks/useAddress';


const ProductDetail = () => {
  const { slug } = useParams();
  const { isPending, error, data: product } = useProduct(slug);
  const { isPending: pendingAdd, addReview } = useCreateReview();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { userInfo } = useSelector((state) => state.auth);
  const { currentAddress } = useGetDefaultAddress();

  const { wishlist } = useGetWishlist();

  const { addToWishlist } = useAddToWishlist();
  const { removeFromWishlist } = useRemoveFromWishlist();
  const isInWishlist = wishlist?.some((item) => item._id === product?._id);

  const handleToggleWishlist = () => {
    if (!userInfo) {
      toast.error('Please sign in to add to wishlist', {
        position: 'top-center',
      });
      return;
    }
    if (isInWishlist) {
      removeFromWishlist(product._id);
      toast.success('Removed from wishlist', { position: 'top-center' });
    } else {
      addToWishlist(product._id);
      toast.success('Added to wishlist', { position: 'top-center' });
    }
  };


  const selectedVariant = product?.variants?.[selectedVariantIndex] || null;
  const countInStock = selectedVariant?.countInStock ?? product?.countInStock ?? 0;

  const galleryImages = useMemo(() => {
    const productImages = (product?.images || []).map((img) => ({
      url: img.url,
      variantIndex: null,
    }));

    const variantImages = (product?.variants || []).flatMap((v, vIndex) =>
      (v.images || []).map((img) => ({
        url: img.url,
        variantIndex: vIndex,
      })),
    );

    const merged = [...productImages, ...variantImages];

    // loại trùng theo url, giữ lại bản ghi đầu tiên gặp
    return merged.filter(
      (img, index, self) => index === self.findIndex((t) => t.url === img.url),
    );
  }, [product]);

  function addToCartHandler(shouldNavigate = true) {
    dispatch(
      addToCart({
        ...product,
        qty,
        price: selectedVariant?.price ?? product.price,
        countInStock: countInStock,
        variantId: selectedVariant?._id,
        color: selectedVariant?.color,
        size: selectedVariant?.size,
        sku: selectedVariant?.sku,
      }),
    );

    if (shouldNavigate) {
      navigate('/cart');
    }
  }

  function buyNowHandler() {
    if (!userInfo) {
      toast.error('Please sign in to proceed with purchase', {
        position: 'top-center',
      });
      navigate(`/login?redirect=/product/${slug}`);
      return;
    }

    addToCartHandler(false);

    if (currentAddress) {
      navigate('/payment');
    } else {
      navigate('/shipping', { state: { action: 'create' } });
    }
  }



  async function createReviewHandler(e) {
    e.preventDefault();
    try {
      await addReview(
        { id: product._id, data: { rating, comment } },
        {
          onSuccess: () => {
            toast.success('Review submitted!', { position: 'top-center' });
            setRating(0);
            setComment('');
          },
        },
      );
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Comment fail');
    }
  }

  const handleSelectImage = (index) => {
    setSelectedImageIndex(index);

    const variantIndex = galleryImages[index]?.variantIndex;
    if (variantIndex !== null && variantIndex !== undefined) {
      setSelectedVariantIndex(variantIndex);
    }
  };

  const handlerSelectVariant = (index) => {
    setSelectedVariantIndex(index);

    const targetVariant = product.variants?.[index];
    const targetStock = targetVariant?.countInStock ?? 0;
    if (qty > targetStock && targetStock > 0) {
      setQty(1);
    }

    // tìm ảnh đầu tiên trong gallery thuộc variant này
    const imageIndex = galleryImages.findIndex(
      (img) => img.variantIndex === index,
    );
    if (imageIndex !== -1) {
      setSelectedImageIndex(imageIndex);
    }
  };

  return (
    <>
      {isPending ? (
        <Spinner />
      ) : error ? (
        <Message>{getErrorMessage(error)}</Message>
      ) : (
        <>
          <div className='flex items-center justify-between gap-4 mb-4 flex-wrap'>
            <Link to='/'>
              <Button variant='outline' size='sm' className='gap-1.5'>
                <ChevronLeft size={16} />
                Back to Products
              </Button>
            </Link>

            {/* Breadcrumb Navigation */}
            <div className='flex items-center gap-2 text-xs sm:text-sm text-muted-foreground'>
              <Link to='/' className='hover:text-primary transition-colors'>
                Home
              </Link>
              <span>/</span>
              <span className='capitalize font-medium text-foreground/80'>
                {product.category || 'Catalog'}
              </span>
              <span>/</span>
              <span className='text-primary font-semibold truncate max-w-[180px] sm:max-w-none'>
                {product.name}
              </span>
            </div>
          </div>

          <Row template='lg:grid-cols-[0.75fr_1fr]' className='gap-8'>
            <Col fluid className='my-auto'>
              <ProductGallery
                images={galleryImages.map((image) => image.url)}
                selectedIndex={selectedImageIndex}
                onSelectImage={handleSelectImage}
                productName={product.name}
              />
            </Col>

            <Col fluid className='flex items-start flex-col gap-5 py-4'>
              <h1 className='text-3xl font-bold tracking-tight'>
                {product.name}
              </h1>

              <div className='flex items-center gap-3'>
                <Rating rating={product.rating} />
                <p className='text-sm text-muted-foreground'>
                  {' '}
                  {product.numberViews} reviews
                </p>
              </div>

              <span className='text-sm text-muted-foreground'>
                {product.subtitle}
              </span>

              <ProductPrice
                price={selectedVariant?.price}
                originalPrice={selectedVariant?.originalPrice}
              />

              {product.variants?.length > 1 && (
                <div className='flex flex-col gap-2'>
                  <span className='text-sm font-medium text-muted-foreground'>
                    Variants
                  </span>
                  <div className='flex flex-wrap gap-2'>
                    {product.variants.map((variant, index) => (
                      <Button
                        key={variant._id || index}
                        variant={
                          selectedVariantIndex === index ? 'default' : 'outline'
                        }
                        size='sm'
                        onClick={() => handlerSelectVariant(index)}
                      >
                        {variant.color}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className='flex items-center justify-between w-full py-2.5 border-y border-border/60'>
                <span className='text-sm font-medium text-foreground'>
                  Quantity:
                </span>
                <div className='flex items-center gap-3'>
                  <div className='flex items-center border border-border rounded-lg overflow-hidden bg-background'>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 rounded-none hover:bg-muted'
                      disabled={qty <= 1 || countInStock === 0}
                      onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                    >
                      <Minus className='h-3.5 w-3.5' />
                    </Button>
                    <span className='px-3 min-w-[2.5rem] text-center font-semibold text-sm'>
                      {qty}
                    </span>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 rounded-none hover:bg-muted'
                      disabled={qty >= countInStock || countInStock === 0}
                      onClick={() =>
                        setQty((prev) => Math.min(countInStock, prev + 1))
                      }
                    >
                      <Plus className='h-3.5 w-3.5' />
                    </Button>
                  </div>
                  <span className='text-xs text-muted-foreground'>
                    {countInStock > 0 ? (
                      <span className='text-emerald-600 dark:text-emerald-400 font-medium'>
                        In Stock ({countInStock})
                      </span>
                    ) : (
                      <span className='text-rose-500 font-medium'>Out of Stock</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Add To Cart, Buy Now, Wishlist */}
              <div className='flex items-center gap-2.5 w-full mt-auto pt-2'>
                <Button
                  size='lg'
                  variant='outline'
                  disabled={countInStock === 0}
                  className='flex-1 rounded-lg gap-2 font-semibold border-2 border-primary text-primary hover:bg-primary/5 transition-all'
                  onClick={() => addToCartHandler(true)}
                >
                  <ShoppingBag size={18} />
                  Add To Cart
                </Button>

                <Button
                  size='lg'
                  disabled={countInStock === 0}
                  className='flex-1 rounded-lg gap-2 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all'
                  onClick={buyNowHandler}
                >
                  <Zap size={18} />
                  Buy Now
                </Button>

                <Button
                  size='lg'
                  variant='outline'
                  type='button'
                  className={cn(
                    'px-3.5 rounded-lg border-border hover:bg-muted transition-colors',
                    isInWishlist
                      ? 'bg-muted/80 text-primary border-primary/40'
                      : 'text-muted-foreground hover:text-primary',
                  )}
                  onClick={handleToggleWishlist}
                  aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart
                    size={20}
                    fill={isInWishlist ? 'currentColor' : 'none'}
                    className={
                      isInWishlist ? 'text-primary' : 'text-muted-foreground'
                    }
                  />
                </Button>
              </div>



              <div className='grid grid-cols-3 gap-2 sm:gap-3 w-full text-primary font-normal text-xs sm:text-sm'>
                <div className='flex items-center justify-center flex-col gap-1 border-muted-foreground/40 border border-dashed rounded-lg py-2.5 px-1 min-h-14 text-center'>
                  <Truck size={16} />
                  <span>Free shipping</span>
                </div>
                <div className='flex items-center justify-center flex-col gap-1 border-muted-foreground/40 border border-dashed rounded-lg py-2.5 px-1 min-h-14 text-center'>
                  <RotateCcw size={16} />
                  <span>30-days returns</span>
                </div>
                <div className='flex items-center justify-center flex-col gap-1 border-muted-foreground/40 border border-dashed rounded-lg py-2.5 px-1 min-h-14 text-center'>
                  <ShieldCheck size={16} />
                  <span>1-year warranty</span>
                </div>
              </div>
            </Col>
          </Row>

          <Row template='lg:grid-cols-[1fr_0.5fr]'>
            <Col fluid>
              <div className='flex flex-col items-start gap-1.5 text-md font-normal text-primary mb-10'>
                <span>
                  <strong>Category: </strong>
                  {product.category}
                </span>

                <span>
                  <strong>Description: </strong> {product.description}
                </span>
              </div>

              <h2 className='text-xl mb-3 font-semibold'>Reviews</h2>

              {product.reviews.length === 0 && (
                <div className='mb-3 py-3 flex items-center justify-center'>
                  <Message>
                    No reviews yet. Be the first to share your thoughts.
                  </Message>
                </div>
              )}

              {product.reviews.map((review) => (
                <ListReview
                  key={review._id}
                  name={review.name}
                  rating={review.rating}
                  createAt={review.createdAt?.substring(0, 10)}
                  comment={review.comment}
                />
              ))}

              <h3 className='mb-4 text-lg font-semibold'>Write a review</h3>

              {pendingAdd && <Spinner />}

              {userInfo ? (
                <FormReview
                  rating={rating}
                  setRating={setRating}
                  comment={comment}
                  setComment={setComment}
                  loading={pendingAdd}
                  handler={createReviewHandler}
                />
              ) : (
                <Message>
                  Please <Link to='/login'>Sign in </Link> to write a reviews
                </Message>
              )}
            </Col>
            <Col fluid></Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductDetail;
