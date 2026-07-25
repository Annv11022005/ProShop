import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../cart/cartSlice.js';

import { useProduct } from './hooks/useProduct';

import { ChevronLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Row from '@/components/ui/Row';
import Col from '@/components/ui/Col';
import Rating from '@/components/ui/Rating';
import { Spinner } from '@/components/ui/spinner.jsx';
import { Message } from '@/components/ui/Message.jsx';
import ProductActionCard from './ProductActionCard.jsx';

const ProductDetail = () => {
  const { id: productId } = useParams();
  const { isPending, error, data: product } = useProduct(productId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  function addToCartHandler() {
    dispatch(addToCart({ ...product, qty }));

    navigate('/cart');
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

              <Rating
                value={product.rating}
                text={`${product.numberViews} reviews`}
              />

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
        </>
      )}
    </>
  );
};

export default ProductDetail;
