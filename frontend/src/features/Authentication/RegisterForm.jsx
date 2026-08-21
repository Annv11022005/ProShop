import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from './hooks/useAuth';
import useToggle from '@/lib/handleToggle';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { toast } from 'sonner';
import GridBackground from './components/GridBackground';
import AuthHeroImage from './components/AuthHeroImage';
import BrandMark from './components/BrandMark';

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'Name is required' })
      .min(2, { message: 'Name must be at least 2 characters' }),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Please enter a valid email address' }),
    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

function RegisterForm() {
  const { registerUser, isPending } = useRegister();
  const [isPassword, handleToggle] = useToggle(false);
  const [isConfirmPassword, handleToggleConfirm] = useToggle(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
  });

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
    registerUser(
      { name: data.name, email: data.email, password: data.password },
      {
        onSuccess: () => {
          navigate(`/register/verify?email=${encodeURIComponent(data.email)}`);
        },
        onError: (err) => {
          const serverMessage =
            err.response?.data?.message || 'Failed to register account';
          toast.error(serverMessage, { position: 'top-center' });
          if (
            serverMessage.toLowerCase().includes('already exists') ||
            serverMessage.toLowerCase().includes('email')
          ) {
            setError('email', {
              type: 'server',
              message: serverMessage,
            });
          }
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
            <BrandMark
              title='Sign up to ProShop'
              subtitle='Create your account!'
            />

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <FieldSet className='w-full'>
                <FieldGroup>
                  <Field data-invalid={!!errors.name}>
                    <FieldLabel htmlFor='name' className='text-md'>
                      Name
                    </FieldLabel>
                    <Input
                      id='name'
                      type='text'
                      className='rounded-lg'
                      placeholder='Enter your full name'
                      aria-invalid={!!errors.name}
                      {...register('name')}
                    />
                    {errors.name && (
                      <FieldError>{errors.name.message}</FieldError>
                    )}
                  </Field>

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
                        placeholder='Enter password (min 6 characters)'
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
                  </Field>

                  <Field data-invalid={!!errors.confirmPassword}>
                    <FieldLabel htmlFor='confirmPassword' className='text-md'>
                      Confirm Password
                    </FieldLabel>
                    <InputGroup className='rounded-lg'>
                      <InputGroupInput
                        id='confirmPassword'
                        type={isConfirmPassword ? 'text' : 'password'}
                        placeholder='Confirm your password'
                        aria-invalid={!!errors.confirmPassword}
                        {...register('confirmPassword')}
                      />
                      <InputGroupAddon
                        className='cursor-pointer'
                        align='inline-end'
                        onClick={handleToggleConfirm}
                      >
                        {!isConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </InputGroupAddon>
                    </InputGroup>
                    {errors.confirmPassword && (
                      <FieldError>{errors.confirmPassword.message}</FieldError>
                    )}
                  </Field>

                  <Field className='mx-auto max-w-20'>
                    <Button size='lg' disabled={isPending} type='submit'>
                      Sign up
                    </Button>
                  </Field>

                  <Field className='text-center'>
                    <p className='text-sm text-muted-foreground italic'>
                      Already have an account?{' '}
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

export default RegisterForm;
