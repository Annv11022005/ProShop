import { Link } from 'react-router-dom';
import { formatCurrency } from '@/lib/utils';

const Item = ({ item }) => {
  const { image, name, price, qty, _id, product } = item;
  const productId = product || _id;
  return (
    <div className='flex justify-around items-center py-3'>
      <img src={image} alt={name} width='100px' className=' rounded-lg' />

      <Link to={`/product/${productId}`}>
        <h3 className='text-primary hover:italic hover:underline text-sm font-semibold'>
          {name}
        </h3>
      </Link>

      <p className='text-primary text-sm font-medium'>
        {qty} x {formatCurrency(price)} = {formatCurrency(qty * price)}
      </p>
    </div>
  );
};

export default Item;
