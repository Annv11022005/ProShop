import { useEffect, useState } from 'react';
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
import { SparklesIcon } from 'lucide-react';

const VnpaySuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('checking');
  const orderId = searchParams.get('vnp_TxnRef')?.split('_')[0];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!orderId) return setStatus('failed');

    fetch(`/api/v1/orders/vnpay/callback${window.location.search}`)
      .then(() => {
        return fetch(`/api/v1/orders/${orderId}`, { credentials: 'include' });
      })
      .then((res) => res.json())
      .then((order) => setStatus(order?.isPaid ? 'success' : 'failed'))
      .catch(() => setStatus('failed'));
  }, [orderId]);

  if (status === 'checking') return <p>Đang xác nhận thanh toán...</p>;

  return (
    <div>
      <h2>
        {status === 'success' ? (
          <div className='flex items-center justify-center p-4'>
            <Empty className='max-w-lg py-10'>
              <EmptyHeader>
                <EmptyMedia>
                  <IconStack
                    aria-hidden='true'
                    className='text-primary h-24 w-22'
                  >
                    <SparklesIcon className='text-green-400 size-5' />
                  </IconStack>
                </EmptyMedia>
                <EmptyTitle className='text-xl font-semibold'>
                  Thanh toán thành công
                </EmptyTitle>
                <EmptyDescription>
                  Đơn hàng {orderId} của bạn đã được thanh toán thành công!
                </EmptyDescription>
              </EmptyHeader>

              <EmptyContent className='hover:underline hover:italic font-semibold text-lg'>
                <Link to={`/order/${orderId}`}>Xem đơn hàng</Link>
              </EmptyContent>
            </Empty>
          </div>
        ) : (
          'Thanh toán thất bại'
        )}
      </h2>
    </div>
  );
};

export default VnpaySuccess;
