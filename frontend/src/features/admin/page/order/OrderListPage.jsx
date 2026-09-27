import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
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
import { buttonVariants } from '@/components/ui/button';
import OrderStatusBadge, { getEffectiveStatus } from '@/components/OrderStatusBadge';

const STATUS_FILTERS = [
  { key: 'ALL', label: 'All Orders' },
  { key: 'PENDING_PAYMENT', label: 'Pending Payment' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'SHIPPING', label: 'In Transit' },
  { key: 'DELIVERED', label: 'Delivered' },
  { key: 'CANCELLED', label: 'Cancelled' },
];

const OrderListPage = () => {
  const { isPending, error, allOrders = [] } = useGetOrders();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlStatus = searchParams.get('status');
  const [activeFilter, setActiveFilter] = useState(
    urlStatus && STATUS_FILTERS.some((f) => f.key === urlStatus) ? urlStatus : 'ALL',
  );

  useEffect(() => {
    const currentUrlStatus = searchParams.get('status');
    if (currentUrlStatus && STATUS_FILTERS.some((f) => f.key === currentUrlStatus)) {
      setActiveFilter(currentUrlStatus);
    } else if (!currentUrlStatus) {
      setActiveFilter('ALL');
    }
  }, [searchParams]);

  const handleFilterChange = (key) => {
    setActiveFilter(key);
    if (key === 'ALL') {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('status');
      setSearchParams(nextParams, { replace: true });
    } else {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set('status', key);
      setSearchParams(nextParams, { replace: true });
    }
  };

  // Filter counts
  const counts = useMemo(() => {
    const map = { ALL: allOrders.length };
    STATUS_FILTERS.slice(1).forEach((f) => (map[f.key] = 0));
    allOrders.forEach((o) => {
      const st = getEffectiveStatus(o);
      if (map[st] !== undefined) map[st] += 1;
    });
    return map;
  }, [allOrders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    if (activeFilter === 'ALL') return allOrders;
    return allOrders.filter((o) => getEffectiveStatus(o) === activeFilter);
  }, [allOrders, activeFilter]);

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-primary'>Order Management</h1>
          <p className='text-sm text-muted-foreground'>
            Track customer orders, manage fulfilment statuses and review payments.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className='flex flex-wrap gap-2 border-b pb-3'>
        {STATUS_FILTERS.map((filter) => {
          const isActive = activeFilter === filter.key;
          const count = counts[filter.key] ?? 0;
          return (
            <button
              key={filter.key}
              onClick={() => handleFilterChange(filter.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <span>{filter.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-background text-muted-foreground'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {isPending ? (
        <div className='flex justify-center p-12'>
          <Spinner />
        </div>
      ) : error ? (
        <Message variant='destructive'>{error.message}</Message>
      ) : filteredOrders.length === 0 ? (
        <div className='text-center py-12 border rounded-xl bg-card text-muted-foreground text-sm'>
          No orders found for this status.
        </div>
      ) : (
        <div className='border rounded-xl bg-card overflow-hidden shadow-xs'>
          <Table>
            <TableHeader>
              <TableRow className='bg-muted/40'>
                <TableHead className='font-semibold text-center'>ORDER ID</TableHead>
                <TableHead className='font-semibold'>CUSTOMER</TableHead>
                <TableHead className='font-semibold text-center'>DATE</TableHead>
                <TableHead className='font-semibold text-center'>TOTAL</TableHead>
                <TableHead className='font-semibold text-center'>PAYMENT</TableHead>
                <TableHead className='font-semibold text-center'>ORDER STATUS</TableHead>
                <TableHead className='font-semibold text-center'>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredOrders.map((order) => {
                const isCod = order.paymentMethod === 'COD';
                return (
                  <TableRow key={order._id} className='hover:bg-muted/30 transition-colors'>
                    <TableCell className='text-center font-mono text-xs font-semibold'>
                      {order._id}
                    </TableCell>
                    <TableCell>
                      <p className='font-medium text-sm'>{order.user?.name || 'Customer'}</p>
                      <p className='text-xs text-muted-foreground'>{order.user?.email}</p>
                    </TableCell>
                    <TableCell className='text-center text-xs text-muted-foreground'>
                      {order.createdAt?.substring(0, 10)}
                    </TableCell>
                    <TableCell className='text-center font-semibold text-sm'>
                      {formatCurrency(order.totalPrice)}
                    </TableCell>
                    <TableCell className='text-center'>
                      <div className='inline-flex flex-col items-center gap-0.5'>
                        <span className='text-xs font-semibold'>
                          {isCod ? 'COD' : order.paymentMethod}
                        </span>
                        {order.isPaid ? (
                          <span className='text-[10px] text-emerald-600 dark:text-emerald-400 font-medium'>
                            Paid ({order.paidAt?.substring(0, 10)})
                          </span>
                        ) : isCod ? (
                          <span className='text-[10px] text-amber-600 dark:text-amber-400 font-medium'>
                            Pay on delivery
                          </span>
                        ) : (
                          <span className='text-[10px] text-rose-500 font-medium'>
                            Unpaid
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className='text-center'>
                      <OrderStatusBadge order={order} />
                    </TableCell>
                    <TableCell className='text-center'>
                      <Link
                        to={`/order/${order._id}`}
                        className={buttonVariants({ size: 'sm', variant: 'outline' })}
                      >
                        Manage
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default OrderListPage;
