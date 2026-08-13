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

const ProductDetail = () => {
  const { slug } = useParams();
  const { isPending, error, data: product } = useProduct(slug);
  const { isPending: pendingAdd, addReview } = useCreateReview();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const qty = 1;
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const userInfo = useSelector((state) => state.auth);

  const selectedVariant = product?.variants?.[selectedVariantIndex] || null;
  const countInStock = selectedVariant?.countInStock ?? product?.countInStock;

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

  function addToCartHandler() {
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

    navigate('/cart');
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
        <Message>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <Link to='/'>
            <Button>
              <ChevronLeft />
              Go Back
            </Button>
          </Link>

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

              <div className='flex justify-between gap-5 '>
                <p>Status:</p>
                <p>{countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</p>
              </div>

              <Button
                size='lg'
                disabled={countInStock == 0}
                className='w-full rounded-lg mt-auto gap-7'
                onClick={addToCartHandler}
              >
                <ShoppingBag size={16} />
                Add To Cart
              </Button>

              <div className='flex justify-around w-full text-primary font-normal text-sm'>
                <div className='flex items-center justify-center flex-col  border-muted-foreground border border-dashed rounded-lg w-40 h-15'>
                  <Truck size={16} />
                  Free shipping
                </div>
                <div className='flex items-center justify-center flex-col  border-muted-foreground border border-dashed rounded-lg w-40 h-15'>
                  <RotateCcw size={16} />
                  30-days returns
                </div>
                <div className='flex items-center justify-center flex-col  border-muted-foreground border border-dashed rounded-lg w-40 h-15'>
                  <ShieldCheck size={16} />
                  1-year warranty
                </div>
              </div>
            </Col>
          </Row>

          <Row template='lg:grid-cols-[1fr_0.5fr]'>
            <Col fluid>
              <div className='flex flex-col items-start gap-1.5 text-md font-normal text-primary mb-15'>
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
