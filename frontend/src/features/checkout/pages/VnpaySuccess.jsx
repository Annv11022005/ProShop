import { Link, useSearchParams } from 'react-router-dom';
import { IconStack } from '@/components/reui/icon-stack';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { SparklesIcon, XCircleIcon } from 'lucide-react';

const VnpaySuccess = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const orderId = searchParams.get('orderId');

  const isSuccess = status === 'success';

  return (
    <div className='flex items-center justify-center p-4'>
      <Empty className='max-w-lg py-10'>
        <EmptyHeader>
          <EmptyMedia>
            <IconStack aria-hidden='true' className='text-primary h-24 w-22'>
              {isSuccess ? (
                <SparklesIcon className='text-success size-6' />
              ) : (
                <XCircleIcon className='text-destructive size-6' />
              )}
            </IconStack>
          </EmptyMedia>
          <EmptyTitle className='text-xl font-semibold'>
            {isSuccess ? 'Payment Successful' : 'Payment Failed'}
          </EmptyTitle>
          <EmptyDescription>
            {isSuccess
              ? `Your order ${orderId || ''} has been paid successfully!`
              : 'Payment could not be completed. Please try again.'}
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent className='hover:underline hover:italic font-semibold text-lg'>
          {orderId ? (
            <Link to={`/order/${orderId}`}>View Order</Link>
          ) : (
            <Link to='/'>Back to Home</Link>
          )}
        </EmptyContent>
      </Empty>
    </div>
  );
};

export default VnpaySuccess;
