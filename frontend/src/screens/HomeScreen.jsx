import Row from '@/components/ui/Row';
import Col from '@/components/ui/Col';
import Product from '@/components/ui/Product';
import { useProducts } from '@/features/Cart/useProducts';
import { Spinner } from '@/components/ui/spinner';

const HomeScreen = () => {
  const { isPending, error, data: products } = useProducts();

  if (isPending) return <Spinner />;
  if (error) return <p>Lỗi: {error.message}</p>;

  return (
    <Row>
      {products.map((product) => (
        <Col key={product._id}>
          <Product product={product} />
        </Col>
      ))}
    </Row>
  );
};

export default HomeScreen;
