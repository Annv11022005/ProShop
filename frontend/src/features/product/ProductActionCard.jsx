import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';

const ProductActionCard = ({ product, qty, setQty, onAddToCart }) => {
  return (
    <Card>
      <CardHeader className='border-b border-primary'>
        <CardTitle className='flex-between-center'>
          <p>Price:</p>
          <p>$ {product.price}</p>
        </CardTitle>
      </CardHeader>

      <CardContent className='flex-between-center border-b border-primary pb-5'>
        <p>Status:</p>
        <p>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</p>
      </CardContent>

      {product.countInStock > 0 ? (
        <CardContent className='flex-between-center'>
          <p className='mb-1'>Quantity:</p>
          <div className='w-32'>
            <Combobox
              items={[
                ...Array(product.countInStock)
                  .keys()
                  .map((x) => x + 1),
              ]}
              value={qty}
              onValueChange={setQty}
            >
              <ComboboxInput />
              <ComboboxContent>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
        </CardContent>
      ) : (
        ''
      )}

      <CardFooter>
        <Button
          disabled={product.countInStock == 0}
          onClick={onAddToCart}
          size='lg'
        >
          Add To Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductActionCard;
