import { PaymentPage } from '@/features/checkout';

const PaymentScreen = () => {
  return (
    <div className='w-150 mx-auto h-full'>
      <h2 className=' text-3xl font-bold text-primary/80 uppercase '>
        Payment Method
      </h2>

      <PaymentPage />
    </div>
  );
};

export default PaymentScreen;
