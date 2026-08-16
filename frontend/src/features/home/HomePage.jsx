import {
  useProducts,
  useTopProduct,
} from '@/features/product/hooks/useProducts';
import { Link, useParams, useSearchParams } from 'react-router-dom';
// import ProductCasual from './ProductCasual';
import ProductFilter from './ProductFilter';

import Row from '@/components/ui/Row';
import Col from '@/components/ui/Col';
import Product from '@/components/ui/Product';
import { Spinner } from '@/components/ui/spinner';
import { Message } from '@/components/AlertMessage';
import Paginate from '../../components/Paginate';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import ChatWidget from '../chat/ChatWidget';
import { useSelector } from 'react-redux';
import HomeBanner from './HomeBanner';

const HomePage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const { pageNumber, keyword } = useParams();

  const sort = searchParams.get('sortBy');
  const stock = searchParams.get('stock');

  const { products, isPending: pendingTop, error: errTop } = useTopProduct();

  const { isPending, error, data } = useProducts({
    pageNumber,
    keyword,
    sort,
    stock,
  });

  return (
    <>
      {!keyword ? (
        <HomeBanner product={products} />
      ) : (
        <Link to='/'>
          <Button size='lg'>
            <ChevronLeft />
            Go Back
          </Button>
        </Link>
      )}
      {isPending || pendingTop ? (
        <Spinner />
      ) : error || errTop ? (
        <Message>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <div className='flex items-center gap-4'>
            <h2 className='text-3xl font-bold text-primary/80 uppercase mb-0'>
              Latest Products
            </h2>
            <ProductFilter />
          </div>

          <Row>
            {data.products.map((product) => (
              <Col key={product._id}>
                <Product product={product} />
              </Col>
            ))}
            <Paginate
              pages={data.pages}
              page={data.page}
              basePath={keyword ? `/search/${keyword}/page` : '/page'}
            />
          </Row>
        </>
      )}

      {userInfo && <ChatWidget />}
    </>
  );
};

export default HomePage;
