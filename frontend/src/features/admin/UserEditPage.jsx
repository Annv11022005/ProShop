import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Message } from '@/components/ui/Message';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';
import { useGetUserById, useUpdateUser } from './hook/useUser';
import { RadioGroupItem, RadioGroup } from '@/components/ui/radio-group';

const UserEditPage = () => {
  const { id: userId } = useParams();
  const { isPending, error, user } = useGetUserById(userId);
  const { isPending: pendingUpdate, updatedUser } = useUpdateUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  async function submitHandler(e) {
    e.preventDefault();
    try {
      await updatedUser({ id: userId, data: { name, email, isAdmin } });
      toast.success('User updated!', { position: 'top-center' });
      navigate('/admin/user-list');
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message, {
        position: 'top-center',
      });
    }
  }

  return (
    <div>
      <div className='flex w-full justify-center'>
        <Link to='/admin/user-list' className='mr-auto'>
          <Button size='lg'>
            <ChevronLeft />
            Go Back
          </Button>
        </Link>

        <h2 className=' flex-1 text-center font-semibold text-xl'>Edit User</h2>
      </div>

      <div className='w-150 mx-auto'>
        {isPending ? (
          <Spinner />
        ) : error ? (
          <Message>{error.message}</Message>
        ) : (
          <form onSubmit={submitHandler}>
            <FieldSet>
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

                <Field orientation='horizontal'>
                  <Button size='lg' disabled={pendingUpdate} type='submit'>
                    Update
                  </Button>
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserEditPage;
