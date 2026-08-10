import { Trash } from 'lucide-react';
import { ComboboxContent } from '@/components/ui/combobox';
import {
  Combobox,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';
import ProductPrice from '../product/components/ProductPrice';

const CartItem = ({ item, addToCartHandler, removeCart }) => {
  const { image, name, price, originalPrice, qty, countInStock, color } = item;
  return (
    <div className='flex gap-5'>
      <img src={image} alt={name} className=' rounded-lg size-14 sm:size-16' />

      <div className='flex flex-col justify-around w-[50%]'>
        <h3 className='text-primary text-lg font-semibold'>
          {name} {color ? `(${color})` : ''}
        </h3>
        <ProductPrice price={price} originalPrice={originalPrice} />
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
        onClick={() => removeCart(item._id, item.variantId)}
      >
        <Trash />
      </Button>
    </div>
  );
};

export default CartItem;
