import { Spinner } from '@/components/ui/spinner';
import { useGetOrders } from '../../hook/useAdmin';
import { Message } from '@/components/AlertMessage';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const OrderListPage = () => {
  const { isPending, error, allOrders } = useGetOrders();
  return (
    <div>
      <h1 className='text-lg font-semibold text-primary'>Orders</h1>
      {isPending ? (
        <Spinner />
      ) : error ? (
        <Message>{error.message}</Message>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-center'>ID</TableHead>
              <TableHead className='text-center'>USER</TableHead>
              <TableHead className='text-center'>DATE</TableHead>
              <TableHead className='text-center'>TOTAL</TableHead>
              <TableHead className='text-center'>PAID</TableHead>
              <TableHead className='text-center'>DELIVERED</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {allOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className='text-center font-semibold'>
                  {order._id}
                </TableCell>
                <TableCell className='text-center font-semibold'>
                  {order.user && order.user.name}
                </TableCell>
                <TableCell className='text-center'>
                  {order.createdAt.substring(0, 10)}
                </TableCell>
                <TableCell className='text-center'>
                  {formatCurrency(order.totalPrice)}
                </TableCell>
                <TableCell className='text-center'>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <X className='text-destructive mx-auto' />
                  )}
                </TableCell>
                <TableCell className='text-center'>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <X className='text-destructive mx-auto' />
                  )}
                </TableCell>

                <TableCell className='text-right'>
                  <Link to={`/order/${order._id}`}>
                    <Button size='sm'>Detail</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default OrderListPage;
