import Row from '@/components/ui/Row';
import Col from '@/components/ui/Col';
import Product from '@/components/ui/Product';
import { useProducts } from '@/features/product/hooks/useProducts';
import { Spinner } from '@/components/ui/spinner';
import { Message } from '@/components/ui/Message';

const HomeScreen = () => {
  const { isPending, error, data: products } = useProducts();

  return (
    <>
      {isPending ? (
        <Spinner />
      ) : error ? (
        <Message>{error?.data?.message || error.error}</Message>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product._id}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default HomeScreen;
