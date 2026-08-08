import Paginate from '@/components/Paginate';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, SquarePenIcon, Trash2 } from 'lucide-react';
import { useGetAllCoupon } from '../coupon/hooks/useCoupons';
import { Spinner } from '@/components/ui/spinner';
import { Message as AlertMessage } from '@/components/AlertMessage';
import { useNavigate, useParams } from 'react-router-dom';
import { formatCurrency } from '@/lib/utils';
import { useDeleteCoupon } from '../coupon/hooks/useCoupon';
import { useEffect } from 'react';

const CouponListPage = () => {
  const { pageNumber } = useParams();
  const { isPending, error, coupons } = useGetAllCoupon(pageNumber);
  const { isPending: pendDelete, deletedCoupon } = useDeleteCoupon();

  const navigate = useNavigate();

  useEffect(() => {
    if (coupons && coupons.pages >= 1 && coupons.page > coupons.pages) {
      navigate(`/admin/coupon-list/${coupons.pages}`);
    }
  }, [coupons, navigate]);

  return (
    <>
      <div className='flex flex-row justify-between'>
        <h1 className='text-lg font-semibold text-primary'>Coupons</h1>

        <Button size='lg' onClick={() => navigate('/admin/coupon/create')}>
          <Plus />
          Create Coupon
        </Button>
      </div>
      {isPending ? (
        <Spinner />
      ) : error ? (
        <AlertMessage>{error.message}</AlertMessage>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-center'>ID</TableHead>
              <TableHead className='text-center'>TITLE</TableHead>
              <TableHead className='text-center'>CATEGORY</TableHead>
              <TableHead className='text-center'>CODE</TableHead>
              <TableHead className='text-center'>MINSPEND</TableHead>
              <TableHead className='text-center'>USAGELIMIT</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {coupons.coupons.map((coupon) => (
              <TableRow key={coupon._id}>
                <TableCell className='text-center'>{coupon._id}</TableCell>
                <TableCell className='text-center font-semibold'>
                  {coupon.title}
                </TableCell>
                <TableCell className='text-center font-semibold'>
                  {coupon.category}
                </TableCell>
                <TableCell className='text-center'>{coupon.code}</TableCell>
                <TableCell className='text-center'>
                  {formatCurrency(coupon.minSpend)}
                </TableCell>
                <TableCell className='text-center'>
                  {coupon.usageLimit}
                </TableCell>

                <TableCell className='flex items-end justify-end gap-3'>
                  <Button
                    variant='outline'
                    onClick={() => navigate(`/admin/coupon/${coupon._id}/edit`)}
                  >
                    <SquarePenIcon />
                  </Button>
                  <Button
                    variant=''
                    className='bg-red-500'
                    disabled={pendDelete}
                    onClick={() => {
                      deletedCoupon(coupon._id);
                    }}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          {coupons.pages >= 2 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6}>
                  <Paginate
                    page={coupons.page}
                    pages={coupons.pages}
                    basePath='/admin/coupon-list'
                  />
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      )}
    </>
  );
};

export default CouponListPage;
