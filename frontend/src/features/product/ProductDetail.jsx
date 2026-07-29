import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../cart/cartSlice.js';
import { useCreateReview } from './hooks/useReviews.js';

import { useProduct } from './hooks/useProduct';

import { ChevronLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Row from '@/components/ui/Row';
import Col from '@/components/ui/Col';
import { Spinner } from '@/components/ui/spinner.jsx';
import { Message } from '@/components/ui/Message.jsx';
import ProductActionCard from './ProductActionCard.jsx';
import ListReview from './components/ListReview.jsx';
import { Rating } from '@/components/reui/rating';
import { toast } from 'sonner';
import FormReview from './components/FormReview.jsx';

const ProductDetail = () => {
  const { slug } = useParams();
  const { isPending, error, data: product } = useProduct(slug);
  const { isPending: pendingAdd, addReview } = useCreateReview();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const userInfo = useSelector((state) => state.auth);

  function addToCartHandler() {
    dispatch(addToCart({ ...product, qty }));

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

          <Row template='lg:grid-cols-[0.75fr_1fr_0.5fr]'>
            <Col fluid>
              <img
                src={product.image}
                alt={product.name}
                className=' rounded-md'
              />
            </Col>

            <Col fluid className='flex justify-around items-start flex-col'>
              <h1 className='product-detail'>{product.name}</h1>

              <span className='line' />

              <div className='flex items-center gap-3'>
                <Rating rating={product.rating} />
                <p className='rating-text'> {product.numberViews} reviews</p>
              </div>

              <span className='line' />

              <h2 className='product-detail'>$ {product.price}</h2>

              <span className='line' />

              <p className=' text-sm text-muted-foreground'>
                {product.description}
              </p>
            </Col>

            <Col fluid className='self-center'>
              <ProductActionCard
                product={product}
                qty={qty}
                setQty={setQty}
                onAddToCart={addToCartHandler}
              />
            </Col>
          </Row>

          <Row template='lg:grid-cols-[1fr_0.5fr]'>
            <Col fluid>
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
