import { useProducts } from '@/features/product/hooks/useProducts';
import { useNavigate } from 'react-router-dom';
import { useDeleteProduct } from '../product/hooks/useProduct';

import { Button } from '@/components/ui/button';
import { Message } from '@/components/ui/Message';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, SquarePenIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const ProductListPage = () => {
  const { isPending, error, data: products, refetch } = useProducts();
  const { isPending: pendingDelete, deletedProduct } = useDeleteProduct();

  const navigate = useNavigate();

  async function deleteHandler(id) {
    if (window.confirm('Are you sure?')) {
      try {
        await deletedProduct(id);
        refetch();
        toast.success('Deleted successfully', {
          position: 'top-center',
        });
      } catch (err) {
        toast(err?.data?.message || err.message || 'Delete fail', {
          position: 'top-center',
        });
      }
    }
  }

  return (
    <>
      <div className='flex flex-row justify-between'>
        <h1 className='text-lg font-semibold text-primary'>Products</h1>

        <Button size='lg' onClick={() => navigate('/admin/product/create')}>
          <Plus />
          Create Product
        </Button>
      </div>
      {isPending ? (
        <Spinner />
      ) : error ? (
        <Message>{error.message}</Message>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-center'>ID</TableHead>
              <TableHead className='text-center'>NAME</TableHead>
              <TableHead className='text-center'>PRICE</TableHead>
              <TableHead className='text-center'>CATEGORY</TableHead>
              <TableHead className='text-center'>BRAND</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell className='text-center'>{product._id}</TableCell>
                <TableCell className='text-center font-semibold'>
                  {product.name}
                </TableCell>
                <TableCell className='text-center font-semibold'>
                  $ {product.price}
                </TableCell>
                <TableCell className='text-center'>
                  {product.category}
                </TableCell>
                <TableCell className='text-center'>{product.brand}</TableCell>

                <TableCell className='flex items-end justify-end gap-3'>
                  <Button
                    variant='outline'
                    onClick={() =>
                      navigate(`/admin/product/${product._id}/edit`)
                    }
                  >
                    <SquarePenIcon />
                  </Button>
                  <Button
                    variant=''
                    className='bg-red-500'
                    disabled={pendingDelete}
                    onClick={() => deleteHandler(product._id)}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default ProductListPage;
