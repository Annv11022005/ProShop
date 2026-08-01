import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { setCredentials } from './authSlice';
import { useLogin } from './hooks/useAuth';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { EyeIcon, EyeOffIcon, MailIcon } from 'lucide-react';
import useToggle from '@/lib/handleToggle';

function LoginForm() {
  const { loginUser, isPending } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isPassword, handleToggle] = useToggle(false);

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

    loginUser(
      { email, password },
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

          <Field orientation='horizontal'>
            <Button size='lg' disabled={isPending} type='submit'>
              Sign In
            </Button>
          </Field>

          <Field>
            <p className='text-sm text-muted-foreground italic'>
              New customer?{' '}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : '/register'}
                className='underline hover:text-primary hover:font-medium'
              >
                Register
              </Link>
            </p>
          </Field>

          <div className='flex flex-col w-sm gap-3 mx-auto'>
            <Field>
              <Button
                size='lg'
                onClick={() => {
                  window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/v1/users/auth/facebook`;
                }}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                >
                  <path d='M13 9H17.5L17 11H13V20H11V11H7V9H11V7.12777C11 5.34473 11.1857 4.69816 11.5343 4.04631C11.8829 3.39446 12.3945 2.88288 13.0463 2.53427C13.6982 2.18565 14.3447 2 16.1278 2C16.6498 2 17.1072 2.05 17.5 2.15V4H16.1278C14.8041 4 14.401 4.07784 13.9895 4.29789C13.6862 4.46011 13.4601 4.68619 13.2979 4.98951C13.0778 5.40096 13 5.80407 13 7.12777V9Z'></path>
                </svg>
                Login With Facebook
              </Button>
            </Field>

            <Field>
              <Button
                size='lg'
                onClick={() => {
                  window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/v1/users/auth/google`;
                }}
              >
                <MailIcon />
                Login With google
              </Button>
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}

export default LoginForm;
