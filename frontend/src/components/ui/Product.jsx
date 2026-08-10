import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ProductPrice from '@/features/product/components/ProductPrice';

const Product = ({ product }) => {
  return (
    <Card className='flex h-full flex-col overflow-hidden p-0'>
      <CardHeader className='p-0'>
        <CardTitle>
          <Link to={`/product/${product.slug || product._id}`}>
            <div className='aspect-4/3 w-full overflow-hidden rounded-md bg-muted'>
              <img
                src={product.image}
                alt={product.name}
                className='h-full w-full object-cover transition-transform duration-300 hover:scale-105'
              />
            </div>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Link to={`/product/${product.slug || product._id}`}>
          <h1 className='product-title'>{product.name}</h1>
        </Link>

        <p className='text-sm text-muted-foreground mt-1'>{product.subtitle}</p>
      </CardContent>
      <CardFooter className='mt-auto'>
        <div className='flex items-center w-full justify-between'>
          <ProductPrice
            price={product.variants[0].price}
            originalPrice={product.variants[0].originalPrice}
          />
          <Link to={`/product/${product.slug || product._id}`}>
            <Button>Buy Now</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Product;
