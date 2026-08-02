import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { setCredentials } from './authSlice';
import { useLogin } from './hooks/useAuth';
import useToggle from '@/lib/handleToggle';

import { toast } from 'sonner';
import LoginWithThird from './components/LoginWithThird';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';

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

          <LoginWithThird />
        </FieldGroup>
      </FieldSet>
    </form>
  );
}

export default LoginForm;
