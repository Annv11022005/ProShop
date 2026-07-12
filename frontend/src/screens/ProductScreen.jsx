import { Link, useParams } from 'react-router-dom';
import products from '../../products';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Row from '@/components/ui/Row';
import Col from '@/components/ui/Col';
import Rating from '@/components/ui/Rating';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const product = products.find((p) => p._id === productId);

  return (
    <>
      <Link to='/'>
        <Button>
          <ChevronLeft />
          Go Back
        </Button>
      </Link>

      <Row template='lg:grid-cols-[0.75fr_1fr_0.5fr]'>
        <Col fluid>
          <img src={product.image} alt={product.name} className=' rounded-md' />
        </Col>

        <Col fluid className='flex justify-around items-start flex-col'>
          <h1 className='product-detail'>{product.name}</h1>

          <span className='line' />

          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />

          <span className='line' />

          <h2 className='product-detail'>$ {product.price}</h2>

          <span className='line' />

          <p className=' text-sm text-muted-foreground'>
            {product.description}
          </p>
        </Col>

        <Col fluid className='self-center'>
          <Card>
            <CardHeader className=' border-b border-primary'>
              <CardTitle className='flex-beetwen-center'>
                <p>Price:</p>
                <p>$ {product.price}</p>
              </CardTitle>
            </CardHeader>

            <CardContent className='flex-beetwen-center'>
              <p>Status:</p>
              <p>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</p>
            </CardContent>

            <CardFooter>
              <Button size='lg'>Add To Cart</Button>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProductScreen;
