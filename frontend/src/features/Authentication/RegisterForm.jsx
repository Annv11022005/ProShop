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
  InputGroupButton,
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
      .min(1, 'Name is required')
      .min(2, 'Name must be at least 2 characters')
      .trim(),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address')
      .trim(),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

function RegisterForm() {
  const [isPassword, handleToggle] = useToggle(false);
  const [isConfirmPassword, handleToggleConfirm] = useToggle(false);

  const { registerUser, isPending } = useRegister();

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
      {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      },
      {
        onSuccess: (resData) => {
          toast.success('Registration successful. Please verify your email.');
          navigate(`/otp-register?email=${encodeURIComponent(data.email)}`);
        },
        onError: (err) => {
          const serverMessage =
            err.response?.data?.message || 'Registration failed';
          toast.error(serverMessage, { position: 'top-center' });
          setError('email', {
            type: 'server',
            message: serverMessage,
          });
        },
      },
    );
  }

  return (
    <div className='relative flex min-h-[calc(100vh-10rem)] w-full items-center justify-center p-4 md:p-8 overflow-hidden'>
      <GridBackground />

      <div className='relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-card/60 shadow-2xl backdrop-blur-xl transition-all duration-300'>
        <div className='grid grid-cols-1 md:grid-cols-2'>
          <div className='flex flex-col justify-between p-8 md:p-10 lg:p-12'>
            <div>
              <BrandMark />

              <div className='mt-8 mb-8'>
                <h1 className='text-2xl font-bold tracking-tight text-foreground md:text-3xl'>
                  Create an account
                </h1>
                <p className='mt-2 text-sm text-muted-foreground'>
                  Enter your information below to create your account
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <FieldSet className='w-full'>
                  <FieldGroup>
                    <Field data-invalid={!!errors.name}>
                      <FieldLabel htmlFor='name' className='text-md'>
                        Name
                      </FieldLabel>
                      <Input
                        id='name'
                        type='text'
                        autoComplete='name'
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
                        autoComplete='email'
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
                          autoComplete='new-password'
                          placeholder='Enter password (min 6 characters)'
                          aria-invalid={!!errors.password}
                          {...register('password')}
                        />
                        <InputGroupAddon align='inline-end'>
                          <InputGroupButton
                            type='button'
                            size='icon-xs'
                            aria-label={
                              isPassword ? 'Hide password' : 'Show password'
                            }
                            onClick={handleToggle}
                          >
                            {!isPassword ? <EyeOffIcon /> : <EyeIcon />}
                          </InputGroupButton>
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
                          autoComplete='new-password'
                          placeholder='Confirm your password'
                          aria-invalid={!!errors.confirmPassword}
                          {...register('confirmPassword')}
                        />
                        <InputGroupAddon align='inline-end'>
                          <InputGroupButton
                            type='button'
                            size='icon-xs'
                            aria-label={
                              isConfirmPassword
                                ? 'Hide confirm password'
                                : 'Show confirm password'
                            }
                            onClick={handleToggleConfirm}
                          >
                            {!isConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>
                      {errors.confirmPassword && (
                        <FieldError>{errors.confirmPassword.message}</FieldError>
                      )}
                    </Field>

                    <Field className='pt-2'>
                      <Button size='lg' className='w-full' disabled={isPending} type='submit'>
                        {isPending ? 'Signing up...' : 'Sign up'}
                      </Button>
                    </Field>

                    <Field className='text-center'>
                      <p className='text-sm text-muted-foreground'>
                        Already have an account?{' '}
                        <Link
                          to={redirect ? `/login?redirect=${redirect}` : '/login'}
                          className='font-medium text-primary hover:underline'
                        >
                          Login
                        </Link>
                      </p>
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </form>
            </div>
          </div>

          <div className='hidden md:block'>
            <AuthHeroImage
              srcLight='https://images.unsplash.com/photo-1743657166981-8d8e11d03c3e?auto=format&fit=crop&w=1080&h=1500&q=80'
              srcDark='https://images.unsplash.com/photo-1651065567117-ac52c1a62e21?auto=format&fit=crop&w=1080&h=1500&q=80'
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
