import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useToggle from '@/lib/handleToggle';
import { useOrderHistory } from '../order/hooks/useOrders';
import { setCredentials } from './authSlice';
import { useProfileMutation } from './hooks/useProfile';
import MyOrders from './components/MyOrders';
import { useNavigate } from 'react-router-dom';
import {
  useDeleteAddress,
  useGetAllAddress,
  useGetDefaultAddress,
  useUpdateDefaultAddress,
} from '../address/hooks/useAddress';

import { Button } from '@/components/ui/button';
import Col from '@/components/ui/Col';
import { FieldGroup, FieldSet, Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import Row from '@/components/ui/Row';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Message } from '@/components/ui/Message';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

const ProfilePage = () => {
  const [open, setOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const {
    isPending: pendingDelete,
    // error: errDelete,
    deletedAddress,
  } = useDeleteAddress();

  const { isPending: pendingGet, allAddress } = useGetAllAddress();

  const {
    isPending: pendingDefault,
    error: errDefault,
    currentAddress,
    refetch,
  } = useGetDefaultAddress();

  const {
    isPending: pendingUp,
    error: errUp,
    replaceDefaultAddress,
  } = useUpdateDefaultAddress();

  const [isPassword, handleToggle] = useToggle(false);
  const [isConfirmPassword, handleToggleConfirm] = useToggle(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isPending, profileUser } = useProfileMutation();
  const { isPending: pendingMyOrder, error, myOrders } = useOrderHistory();

  if (!userInfo || pendingDefault || pendingGet) return <Spinner />;

  if (errDefault) {
    return <Message>Failed to load address, try again later</Message>;
  }

  if (errUp) {
    return <Message>{errUp?.message}</Message>;
  }

  async function submitHandler(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Password do not match');
    } else {
      try {
        const res = await profileUser({
          _id: userInfo._id,
          name,
          email,
          password,
        });

        dispatch(setCredentials(res));
        toast.success('Profile update successfully');
        setPassword('');
        setConfirmPassword('');
      } catch (err) {
        toast.error(err?.data?.message || err.error || 'update fail');
      }
    }
  }

  function updateDefaultAddressHandler(id) {
    replaceDefaultAddress(id, {
      onSuccess: () => {
        toast.success('Set as default address', {
          position: 'top-center',
        });
        refetch();
        setOpen(false);
      },
      onError: (err) =>
        toast(err.response?.data?.message, { position: 'top-center' }),
    });
  }

  function deleteAddressHandler(id) {
    deletedAddress(id, {
      onSuccess: () => {
        toast.success('Address deleted', {
          position: 'top-center',
        });
        refetch();
      },
      onError: (err) =>
        toast(err.response?.data?.message, { position: 'top-center' }),
    });
  }

  return (
    <Row template='lg:grid-cols-[1fr_2fr]' className='gap-3'>
      <Col fluid>
        <h2 className='w-full text-center mb-2 uppercase font-semibold'>
          Reset Information
        </h2>

        <Card className='rounded-none'>
          <CardHeader>
            <CardTitle className='font-semibold'>
              Shipping Address Default
            </CardTitle>
            <CardDescription>
              {allAddress?.length === 0
                ? 'You do not have any addresses.'
                : 'Manage your saved shipping addresses.'}
              {currentAddress && (
                <>
                  {currentAddress.name}, {currentAddress.phone},
                  {currentAddress.address}, {currentAddress.city},{' '}
                  {currentAddress.postalCode}, {currentAddress.country}
                </>
              )}
            </CardDescription>
            <CardAction className='my-auto'>
              <Button
                variant='link'
                onClick={() => {
                  if (!currentAddress) {
                    navigate('/shipping', { state: { action: 'create' } });
                  } else {
                    setOpen(true);
                  }
                }}
              >
                {!currentAddress ? 'Create Address' : 'Change Address'}
              </Button>
            </CardAction>
          </CardHeader>

          <CardFooter>
            <Button
              onClick={() =>
                navigate('/shipping', { state: { action: 'create' } })
              }
            >
              Create New Address
            </Button>
          </CardFooter>
        </Card>

        <CommandDialog
          open={open}
          onOpenChange={setOpen}
          className='sm:max-w-160 p-3'
        >
          <Command>
            <CommandList>
              <CommandGroup heading='Shipping Address'>
                {allAddress.map((addr) => (
                  <div
                    key={addr._id}
                    className='flex flex-row gap-3 items-center'
                  >
                    <CommandItem
                      disabled={pendingUp}
                      onSelect={() => updateDefaultAddressHandler(addr._id)}
                      className='p-2 mb-2 text-sm font-medium w-125'
                    >
                      {addr.name}, {addr.phone}, {addr.address}, {addr.city},{' '}
                      {addr.postalCode}, {addr.country}
                    </CommandItem>
                    <Button
                      variant='outline'
                      size='sm'
                      className='text-xs'
                      onClick={() => {
                        navigate('/shipping', {
                          state: { action: 'update', address: addr },
                        });
                        setOpen(false);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      className='text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200'
                      disabled={pendingDelete}
                      onClick={() => deleteAddressHandler(addr._id)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </CommandDialog>

        <form onSubmit={submitHandler}>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='name' className='text-md'>
                  Name
                </FieldLabel>
                <Input
                  id='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type='text'
                  placeholder='Enter name'
                />
              </Field>
              <Field>
                <FieldLabel htmlFor='email' className='text-md'>
                  Email address
                </FieldLabel>
                <Input
                  id='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type='email'
                  placeholder='Enter Email'
                />
              </Field>
              <Field>
                <FieldLabel htmlFor='password' className='text-md'>
                  Password
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={isPassword ? 'text' : 'password'}
                    placeholder='Enter password'
                  />
                  <InputGroupAddon
                    className='cursor-pointer'
                    align='inline-end'
                    onClick={handleToggle}
                  >
                    {!isPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </InputGroupAddon>
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel htmlFor='confirmPassword' className='text-md'>
                  Confirm Password
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id='confirmPassword'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type={isConfirmPassword ? 'text' : 'password'}
                    placeholder='Enter confirm password'
                  />
                  <InputGroupAddon
                    className='cursor-pointer'
                    align='inline-end'
                    onClick={handleToggleConfirm}
                  >
                    {!isConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </InputGroupAddon>
                </InputGroup>
              </Field>

              <Field orientation='horizontal'>
                <Button size='lg' type='submit' disabled={isPending}>
                  {isPending ? <Spinner /> : 'Update'}
                </Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </Col>

      <Col fluid>
        <h2 className='w-full text-center mb-2 uppercase font-semibold'>
          My Orders
        </h2>
        {pendingMyOrder ? (
          <Spinner />
        ) : error ? (
          <Message>{error.message}</Message>
        ) : (
          <MyOrders orders={myOrders} />
        )}
      </Col>
    </Row>
  );
};

export default ProfilePage;
