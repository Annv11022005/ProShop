import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SquarePenIcon } from 'lucide-react';
import { useGetUserById, useUpdateUser } from './hook/useUser';
import { Spinner } from '@/components/ui/spinner';
import { Message as AlertMessage } from '@/components/AlertMessage';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const UserEditDialog = ({ userId, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const { isPending, error, user } = useGetUserById(userId, open);
  const { isPending: pendingUpdate, updatedUser } = useUpdateUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user, setName, setEmail, setIsAdmin]);

  async function submitHandler(e) {
    e.preventDefault();
    try {
      await updatedUser({ id: userId, data: { name, email, isAdmin } });
      onSuccess?.();
      toast.success('User updated!', { position: 'top-center' });
      setOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message, {
        position: 'top-center',
      });
    }
  }

  if (isPending && open) return <Spinner />;

  if (error) return <AlertMessage>{error.message}</AlertMessage>;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant='outline'>
            <SquarePenIcon />
          </Button>
        }
      />
      <DialogContent className='sm:max-w-sm'>
        <form onSubmit={submitHandler}>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to your user here. Click save when you are done
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor='name' className='text-md'>
                Name User
              </FieldLabel>
              <Input
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                type='text'
                placeholder='Enter Name User'
              />
            </Field>

            <Field>
              <FieldLabel htmlFor='email' className='text-md'>
                Email User
              </FieldLabel>
              <Input
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type='text'
                placeholder='Enter Email User'
              />
            </Field>

            <RadioGroup
              value={isAdmin ? 'true' : 'false'}
              onValueChange={(value) => setIsAdmin(value === 'true')}
              className='flex flex-row mb-2'
            >
              <Field orientation='horizontal'>
                <RadioGroupItem value='true' id='isAdminTrue' />
                <FieldLabel htmlFor='isAdminTrue'>Admin</FieldLabel>
              </Field>
              <Field orientation='horizontal'>
                <RadioGroupItem value='false' id='isAdminFalse' />
                <FieldLabel htmlFor='isAdminFalse'>User</FieldLabel>
              </Field>
            </RadioGroup>
          </FieldGroup>

          <DialogFooter>
            <DialogClose render={<Button variant='outline'>Cancel</Button>} />
            <Button type='submit' disabled={pendingUpdate}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditDialog;
