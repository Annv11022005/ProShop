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
import { formatCurrency } from '@/lib/utils';

const ProductActionCard = ({ product, qty, setQty, onAddToCart, selectedVariant }) => {
  const price = selectedVariant?.price ?? product.price;
  const countInStock = selectedVariant?.countInStock ?? product.countInStock;

  return (
    <Card>
      <CardHeader className='border-b border-primary'>
        <CardTitle className='flex-between-center'>
          <p>Price:</p>
          <p>{formatCurrency(price)}</p>
        </CardTitle>
      </CardHeader>

      <CardContent className='flex-between-center border-b border-primary pb-5'>
        <p>Status:</p>
        <p>{countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</p>
      </CardContent>

      {countInStock > 0 ? (
        <CardContent className='flex-between-center'>
          <p className='mb-1'>Quantity:</p>
          <div className='w-32'>
            <Combobox
              items={[
                ...Array(countInStock)
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
          disabled={countInStock == 0}
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
