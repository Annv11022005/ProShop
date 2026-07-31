import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useTopProduct } from '../product/hooks/useProducts';
import { Spinner } from '@/components/ui/spinner';
import { Message } from '@/components/ui/Message';
import { Link } from 'react-router-dom';

const ProductCasual = () => {
  const { products, isPending, error } = useTopProduct();

  if (isPending) return <Spinner />;

  if (error) return <Message>{error.message}</Message>;
  return (
    <Carousel className='w-full max-w-md mx-auto'>
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product._id}>
            <div className='p-1'>
              <Card className='group/card relative aspect-video overflow-hidden border-0 p-0'>
                <img
                  src={`${product.image}`}
                  alt={`Slide ${product.name}`}
                  width={1000}
                  height={800}
                  className='absolute inset-0 size-full scale-100 object-cover transition-transform duration-500 ease-in-out group-hover/card:scale-105'
                />

                <div className='absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent' />

                <div className='relative flex h-full flex-col justify-end p-6'>
                  <Link to={`/product/${product.slug || product._id}`}>
                    <h3 className='text-xl font-bold text-white'>
                      {product.name} {product.price}
                    </h3>
                  </Link>
                </div>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default ProductCasual;
