import { Link } from 'react-router-dom';

const Item = ({ item }) => {
  const { image, name, price, qty, _id } = item;
  return (
    <div className='flex justify-around items-center py-3'>
      <img src={image} alt={name} width='100px' className=' rounded-lg' />

      <Link to={`/product/${_id}`}>
        <h3 className='text-primary hover:italic hover:underline text-sm font-semibold'>
          {name}
        </h3>
      </Link>

      <p className='text-primary text-sm font-medium'>
        {qty} x {price} = {qty * price} $
      </p>
    </div>
  );
};

export default Item;
