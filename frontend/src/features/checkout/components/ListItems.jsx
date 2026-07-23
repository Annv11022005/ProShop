import Item from './Item';

const ListItems = ({ cart }) => {
  return (
    <div className='flex flex-col divide-y divide-primary'>
      {cart.cartItems.map((item) => (
        <div key={item._id}>
          <Item item={item} />
        </div>
      ))}
    </div>
  );
};

export default ListItems;
