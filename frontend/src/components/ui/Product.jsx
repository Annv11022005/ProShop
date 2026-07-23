import {
  Card,
  //   CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ product }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link to={`/product/${product._id}`}>
            <img src={product.image} />
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Link to={`/product/${product._id}`}>
          <h1 className='product-title'>{product.name}</h1>
        </Link>
        <Rating value={product.rating} text={`${product.numberViews} reviews`} />
      </CardContent>
      <CardFooter>
        <div className='flex items-center w-full justify-between'>
          <h2 className='product-price'>$ {product.price}</h2>
          <Link to={`/product/${product._id}`}>
            <Button>Mua ngay</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Product;
