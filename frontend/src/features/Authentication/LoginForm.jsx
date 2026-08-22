import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { setCredentials } from './authSlice';
import { useLogin } from './hooks/useAuth';
import useToggle from '@/lib/handleToggle';

import { toast } from 'sonner';
import LoginWithThird from './components/LoginWithThird';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import GridBackground from './components/GridBackground';
import AuthHeroImage from './components/AuthHeroImage';
import BrandMark from './components/BrandMark';
import DividerWithLabel from './components/DividerWithLabel';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),
});

function LoginForm() {
  const { loginUser, isPending } = useLogin();
  const [isPassword, handleToggle] = useToggle(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });

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

  function onSubmit(data) {
    loginUser(
      { email: data.email, password: data.password },
      {
        onSuccess: (resData) => {
          dispatch(setCredentials(resData));
          navigate(redirect);
        },
        onError: (err) => {
          const serverMessage =
            err.response?.data?.message || 'Invalid email or password';
          toast.error(serverMessage, { position: 'top-center' });
          setError('password', {
            type: 'server',
            message: serverMessage,
          });
        },
      },
    );
  }

  return (
    <div className='relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-background px-4 py-6 sm:px-8 sm:py-10 lg:px-10'>
      <GridBackground />
      <div className='relative z-10 flex w-full items-center justify-center'>
        <div className='mx-auto grid w-full max-w-304 items-center justify-center gap-8 lg:grid-cols-[minmax(0,400px)_minmax(0,450px)] lg:gap-24 xl:grid-cols-[minmax(0,420px)_minmax(0,490px)] xl:gap-28'>
          <div className='mx-auto flex w-full max-w-90 flex-col gap-6'>
            <BrandMark title='Sign in to ProShop' subtitle='Welcome back !' />
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <FieldSet>
                <FieldGroup>
                  <Field data-invalid={!!errors.email}>
                    <FieldLabel htmlFor='email' className='text-md'>
                      Email address
                    </FieldLabel>
                    <Input
                      id='email'
                      type='email'
                      className='rounded-lg'
                      placeholder='Enter your email'
                      aria-invalid={!!errors.email}
                      {...register('email')}
                    />
                    {errors.email && (
                      <FieldError>{errors.email.message}</FieldError>
                    )}
                  </Field>

                  <Field data-invalid={!!errors.password}>
                    <FieldLabel htmlFor='password' className='text-md'>
                      Password
                    </FieldLabel>
                    <InputGroup className='rounded-lg'>
                      <InputGroupInput
                        id='password'
                        type={isPassword ? 'text' : 'password'}
                        placeholder='Enter your password'
                        aria-invalid={!!errors.password}
                        {...register('password')}
                      />
                      <InputGroupAddon
                        className='cursor-pointer'
                        align='inline-end'
                        onClick={handleToggle}
                      >
                        {!isPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </InputGroupAddon>
                    </InputGroup>
                    {errors.password && (
                      <FieldError>{errors.password.message}</FieldError>
                    )}
                    <button
                      className='text-xs font-medium text-muted-foreground text-end hover:underline hover:italic'
                      onClick={() => navigate('/forgot-password')}
                    >
                      Forgot Password?
                    </button>
                  </Field>

                  <Field className='mx-auto max-w-20'>
                    <Button size='lg' disabled={isPending} type='submit'>
                      Sign In
                    </Button>
                  </Field>

                  <DividerWithLabel label='Or continue with' />

                  <LoginWithThird />

                  <Field className='text-center'>
                    <p className='text-sm text-muted-foreground italic'>
                      New customer?{' '}
                      <Link
                        to={
                          redirect
                            ? `/register?redirect=${redirect}`
                            : '/register'
                        }
                        className='underline hover:text-primary hover:font-medium'
                      >
                        Register
                      </Link>
                    </p>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </form>
          </div>
          <AuthHeroImage
            srcLight='https://images.unsplash.com/photo-1743657166981-8d8e11d03c3e?auto=format&fit=crop&w=1080&h=1500&q=80'
            srcDark='https://images.unsplash.com/photo-1651065567117-ac52c1a62e21?auto=format&fit=crop&w=1080&h=1500&q=80'
          />
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
