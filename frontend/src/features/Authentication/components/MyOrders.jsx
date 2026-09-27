import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/lib/utils';
import OrderStatusBadge from '@/components/OrderStatusBadge';

const MyOrders = ({ orders }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='text-center'>ITEMS</TableHead>
          <TableHead className='text-center'>DATE</TableHead>
          <TableHead className='text-center'>TOTAL</TableHead>
          <TableHead className='text-center'>PAYMENT</TableHead>
          <TableHead className='text-center'>STATUS</TableHead>
          <TableHead className='text-right'>ACTION</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {(orders ?? []).map((order) => {
          const isCod = order.paymentMethod === 'COD';
          return (
            <TableRow key={order._id}>
              <TableCell className='text-center font-semibold'>
                {order.orderItems?.[0]?.name}
                {order.orderItems?.length > 1 && ` (+${order.orderItems.length - 1} more)`}
              </TableCell>
              <TableCell className='text-center'>
                {order.createdAt?.substring(0, 10)}
              </TableCell>
              <TableCell className='text-center font-medium'>
                {formatCurrency(order.totalPrice)}
              </TableCell>
              <TableCell className='text-center text-xs'>
                {order.isPaid ? (
                  <span className='text-emerald-600 dark:text-emerald-400 font-semibold'>
                    Paid ({order.paidAt?.substring(0, 10)})
                  </span>
                ) : isCod ? (
                  <span className='text-amber-600 dark:text-amber-400 font-semibold'>
                    COD (Upon delivery)
                  </span>
                ) : (
                  <span className='text-rose-500 font-medium inline-flex items-center gap-1 justify-center'>
                    <X className='w-3.5 h-3.5' /> Unpaid
                  </span>
                )}
              </TableCell>
              <TableCell className='text-center'>
                <OrderStatusBadge order={order} />
              </TableCell>

              <TableCell className='text-right'>
                <Link to={`/order/${order._id}`}>
                  <Button size='sm' variant='outline'>Detail</Button>
                </Link>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default MyOrders;
