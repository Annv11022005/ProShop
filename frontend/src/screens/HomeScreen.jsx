import Row from '@/components/ui/Row';
import products from '../../products';
import Col from '@/components/ui/Col';
import Product from '@/components/ui/Product';

const HomeScreen = () => {
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
