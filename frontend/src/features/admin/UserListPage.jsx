import { useNavigate } from 'react-router-dom';
import { useDeleteUser, useGetUsers } from './hook/useUser';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CheckIcon, SquarePenIcon, Trash2, X } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Message } from '@/components/AlertMessage';
import { toast } from 'sonner';

const UserListPage = () => {
  const { isPending, error, users, refetch } = useGetUsers();
  const { isPending: pendingUser, deletedUser } = useDeleteUser();

  const navigate = useNavigate();

  if (isPending || pendingUser) return <Spinner />;
  if (error) return <Message>{error.message}</Message>;

  async function deleteHandler(id) {
    if (window.confirm('Are you sure?')) {
      try {
        await deletedUser(id);
        refetch();
        toast.success('Delete successfully!', { position: 'top-center' });
      } catch (err) {
        toast(err?.data?.message || err.message || 'Delete fail', {
          position: 'top-center',
        });
      }
    }
  }

  return (
    <div>
      <h1 className='text-3xl font-semibold text-primary'>Users</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='text-center'>ID</TableHead>
            <TableHead className='text-center'>NAME</TableHead>
            <TableHead className='text-center'>EMAIL</TableHead>
            <TableHead className='text-center'>ADMIN</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell className='text-center font-semibold'>
                {user._id}
              </TableCell>
              <TableCell className='text-center font-semibold'>
                {user.name}
              </TableCell>
              <TableCell className='text-center font-semibold'>
                {user.email}
              </TableCell>
              <TableCell>
                {user.isAdmin ? (
                  <CheckIcon className='mx-auto text-green-500' />
                ) : (
                  <X className='mx-auto text-red-500' />
                )}
              </TableCell>

              <TableCell className='flex items-end justify-end gap-3'>
                <Button
                  variant='outline'
                  onClick={() => navigate(`/admin/user/${user._id}`)}
                >
                  <SquarePenIcon />
                </Button>
                <Button
                  className='bg-red-500'
                  onClick={() => deleteHandler(user._id)}
                >
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserListPage;
