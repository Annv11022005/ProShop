import Row from '@/components/ui/Row';
import Col from '@/components/ui/Col';
import Product from '@/components/ui/Product';
import { useProducts } from '@/features/product/hooks/useProducts';
import { Spinner } from '@/components/ui/spinner';
import { Message } from '@/components/ui/Message';
import { useParams } from 'react-router-dom';
import Paginate from '../../components/Paginate';

const HomePage = () => {
  const { pageNumber, keyword } = useParams();
  const { isPending, error, data } = useProducts({ pageNumber, keyword });

  return (
    <>
      {isPending ? (
        <Spinner />
      ) : error ? (
        <Message>{error?.data?.message || error.error}</Message>
      ) : (
        <Row>
          {data.products.map((product) => (
            <Col key={product._id}>
              <Product product={product} />
            </Col>
          ))}
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ''}
          />
        </Row>
      )}
    </>
  );
};

export default HomePage;
