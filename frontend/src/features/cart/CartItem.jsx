import { Trash } from 'lucide-react';
import { ComboboxContent } from '@/components/ui/combobox';
import {
  Combobox,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

const CartItem = ({ item, addToCartHandler, removeCart }) => {
  const { image, name, price, qty, countInStock } = item;
  return (
    <div className='flex gap-5'>
      <img src={image} alt={name} width='150px' className=' rounded-lg' />

      <div className='flex flex-col justify-around w-[50%]'>
        <h3 className='text-primary text-xl font-semibold'>{name}</h3>
        <p className='product-price'>{formatCurrency(price)}</p>
      </div>

      <div className='w-32 h-auto my-auto'>
        <Combobox
          items={[
            ...Array(countInStock)
              .keys()
              .map((x) => x + 1),
          ]}
          value={qty}
          onValueChange={(e) => addToCartHandler(item, Number(e))}
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

      <Button
        size='lg'
        className='my-auto'
        onClick={() => removeCart(item._id)}
      >
        <Trash />
      </Button>
    </div>
  );
};

export default CartItem;
