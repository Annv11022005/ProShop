import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useToggle from '@/lib/handleToggle';
import { useOrderHistory } from '../order/hooks/useOrders';

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
import { useProfileMutation } from './hooks/useProfile';
import { toast } from 'sonner';
import { setCredentials } from './authSlice';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Message } from '@/components/ui/Message';
import MyOrders from './components/MyOrders';

const ProfilePage = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isPassword, handleToggle] = useToggle(false);
  const [isConfirmPassword, handleToggleConfirm] = useToggle(false);

  const dispatch = useDispatch();

  const { isPending, profileUser } = useProfileMutation();
  const { isPending: pendingMyOrder, error, myOrders } = useOrderHistory();

  if (!userInfo) return <Spinner />;

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

  return (
    <Row template='lg:grid-cols-[1fr_2fr]' className='gap-3'>
      <Col fluid>
        <h2 className='w-full text-center mb-2 uppercase font-semibold'>
          Reset Information
        </h2>
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
