import ShippingPage from '@/features/shipping/ShippingPage';

const ShippingScreen = () => {
  return (
    <div className='w-150 mx-auto h-full'>
      <h2 className=' text-3xl font-bold text-primary/80 uppercase '>
        Shipping
      </h2>
      <ShippingPage />
    </div>
  );
};

export default ShippingScreen;
