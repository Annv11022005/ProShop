import { formatCurrency } from '@/lib/utils';
import { useEffect } from 'react';
import { useProducts } from '@/features/product/hooks/useProducts';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteProduct } from '@/features/product/hooks/useProduct';

import { Button } from '@/components/ui/button';
import { Message } from '@/components/AlertMessage';
import { Spinner } from '@/components/ui/spinner';
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
import { toast } from 'sonner';
import Paginate from '@/components/Paginate';

const ProductListPage = () => {
  const { pageNumber } = useParams();
  const { isPending, error, data, refetch } = useProducts({ pageNumber });
  const { isPending: pendingDelete, deletedProduct } = useDeleteProduct();

  const navigate = useNavigate();

  useEffect(() => {
    if (data && data.products && data.pages >= 1 && data.page > data.pages) {
      navigate(`/admin/product-list/${data.pages}`);
    }
  }, [data, navigate]);

  async function deleteHandler(id) {
    if (window.confirm('Are you sure?')) {
      try {
        await deletedProduct(id);
        refetch();
        toast.success('Deleted successfully', {
          position: 'top-center',
        });
      } catch (err) {
        toast.error(err?.response?.data?.message || err.message || 'Delete fail', {
          position: 'top-center',
        });
      }
    }
  }

  return (
    <>
      <div className='flex flex-row justify-between mb-4'>
        <h1 className='text-lg font-semibold text-primary'>Products</h1>

        <Button size='lg' onClick={() => navigate('/admin/product/create')}>
          <Plus className="mr-2" />
          Create Product
        </Button>
      </div>
      {isPending ? (
        <div className="flex justify-center mt-10">
          <Spinner />
        </div>
      ) : error ? (
        <Message>{error.message}</Message>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-center'>IMAGE</TableHead>
              <TableHead className='text-center'>NAME</TableHead>
              <TableHead className='text-center'>PRICE</TableHead>
              <TableHead className='text-center'>CATEGORY</TableHead>
              <TableHead className='text-center'>BRAND</TableHead>
              <TableHead className='text-center'>STATUS</TableHead>
              <TableHead className='text-center'>STOCK</TableHead>
              <TableHead className='text-right'></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.products?.map((product) => (
              <TableRow key={product._id}>
                <TableCell className='text-center'>
                  <img
                    src={product.image || '/images/sample.jpg'}
                    alt={product.name}
                    className='w-12 h-12 object-cover rounded-md mx-auto'
                  />
                </TableCell>
                <TableCell className='text-center font-semibold max-w-[200px] truncate'>
                  {product.name}
                </TableCell>
                <TableCell className='text-center font-semibold'>
                  {formatCurrency(product.price)}
                </TableCell>
                <TableCell className='text-center'>
                  {product.category}
                </TableCell>
                <TableCell className='text-center'>{product.brand}</TableCell>
                <TableCell className='text-center'>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === 'Active' ? 'bg-success/15 text-success' : product.status === 'Schedule' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {product.status || 'Draft'}
                  </span>
                </TableCell>
                <TableCell className='text-center'>{product.countInStock}</TableCell>

                <TableCell className='flex items-center justify-end gap-3 h-[72px]'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      navigate(`/admin/product/${product._id}/edit`)
                    }
                  >
                    <SquarePenIcon className="size-4" />
                  </Button>
                  <Button
                    variant='destructive'
                    size='sm'
                    disabled={pendingDelete}
                    onClick={() => deleteHandler(product._id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {data?.pages >= 2 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={8}>
                  <Paginate
                    page={data.page}
                    pages={data.pages}
                    basePath='/admin/product-list'
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

export default ProductListPage;
