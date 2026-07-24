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

const MyOrders = ({ orders }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='text-center'>ID</TableHead>
          <TableHead className='text-center'>DATE</TableHead>
          <TableHead className='text-center'>TOTAL</TableHead>
          <TableHead className='text-center'>PAID</TableHead>
          <TableHead className='text-center'>DELIVERED</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {(orders ?? []).map((order) => (
          <TableRow key={order._id}>
            <TableCell className='text-center font-semibold'>
              {order._id}
            </TableCell>
            <TableCell className='text-center'>
              {order.createdAt.substring(0, 10)}
            </TableCell>
            <TableCell className='text-center'>{order.totalPrice}</TableCell>
            <TableCell className='text-center'>
              {order.isPaid ? (
                order.paidAt.substring(0, 10)
              ) : (
                <X className='text-red-400 mx-auto' />
              )}
            </TableCell>
            <TableCell className='text-center'>
              {order.isDelivered ? (
                order.deliveredAt.substring(0, 10)
              ) : (
                <X className='text-red-400 mx-auto' />
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
  );
};

export default MyOrders;
