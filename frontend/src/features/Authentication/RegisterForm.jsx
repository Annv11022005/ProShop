import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { setCredentials } from './authSlice';
import { useRegister } from '@/hooks/useAuth';

import useToggle from '@/lib/handleToggle';

import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { toast } from 'sonner';

function RegisterForm() {
  const { registerUser, isPending } = useRegister();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isPassword, handleToggle] = useToggle(false);
  const [isConfirmPassword, handleToggleConfirm] = useToggle(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  function submitHandler(e) {
    e.preventDefault();

    registerUser(
      { name, email, password },
      {
        onSuccess: (data) => {
          dispatch(setCredentials(data));
          navigate(redirect);
        },
        onError: (err) => {
          toast(err.response?.data?.message, { position: 'top-center' });
        },
      },
    );
  }

  return (
    <form onSubmit={submitHandler}>
      <FieldSet className='w-full m-3'>
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
            <Button size='lg' disabled={isPending} type='submit'>
              Sign up
            </Button>
          </Field>

          <Field>
            <p className='text-sm text-muted-foreground italic'>
              I already have an account?{' '}
              <Link
                to={redirect ? `/login?redirect=${redirect}` : '/login'}
                className='underline hover:text-primary hover:font-medium'
              >
                Login
              </Link>
            </p>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}

export default RegisterForm;
