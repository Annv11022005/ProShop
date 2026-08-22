import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  EyeIcon,
  EyeOffIcon,
  Loader2,
  MoveLeft,
  RefreshCw,
} from 'lucide-react';

import AuthHeroImage from './components/AuthHeroImage';
import BrandMark from './components/BrandMark';
import GridBackground from './components/GridBackground';
import useToggle from '@/lib/handleToggle';
import { useForgotPassword, useResetPassword } from './hooks/useAuth';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

const resetSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Please enter a valid email address' }),
    otp: z
      .string()
      .min(1, { message: 'OTP is required' })
      .length(6, { message: 'OTP must be 6 digits' }),
    newPassword: z
      .string()
      .min(1, { message: 'New password is required' })
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailFromUrl = searchParams.get('email') || '';

  const { resetPasswordUser, isPending: isResetPending } = useResetPassword();
  const { forgotPasswordUser, isPending: isResendPending } =
    useForgotPassword();

  const [isPassword, handleTogglePassword] = useToggle(false);
  const [isConfirmPassword, handleToggleConfirm] = useToggle(false);
  const [countdown, setCountdown] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
    mode: 'onTouched',
    defaultValues: {
      email: emailFromUrl,
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (emailFromUrl) {
      setValue('email', emailFromUrl);
    }
  }, [emailFromUrl, setValue]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendOTP = () => {
    // eslint-disable-next-line react-hooks/incompatible-library
    const currentEmail = watch('email');
    if (!currentEmail) {
      toast.error('Please enter your email address first', {
        position: 'top-center',
      });
      return;
    }

    forgotPasswordUser(
      { email: currentEmail },
      {
        onSuccess: (res) => {
          toast.success(
            res?.message || 'New OTP has been sent to your email!',
            {
              position: 'top-center',
            },
          );
          setCountdown(60);
        },
        onError: (err) => {
          toast.error(
            err.response?.data?.message || 'Failed to resend OTP code',
            {
              position: 'top-center',
            },
          );
        },
      },
    );
  };

  function onSubmit(data) {
    resetPasswordUser(
      {
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword,
      },
      {
        onSuccess: (resData) => {
          toast.success(
            resData?.message ||
              'The password has been successfully updated. Please log in.',
            { position: 'top-center' },
          );
          navigate('/login');
        },
        onError: (err) => {
          const serverMessage =
            err.response?.data?.message || 'Failed to reset password';
          toast.error(serverMessage, { position: 'top-center' });

          if (serverMessage.toLowerCase().includes('otp')) {
            setError('otp', {
              type: 'server',
              message: serverMessage,
            });
          } else if (serverMessage.toLowerCase().includes('email')) {
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
              title='Reset Password'
              subtitle='Enter the OTP sent to your email and your new password.'
            />
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
                      disabled={isResetPending || isResendPending}
                      className='rounded-lg'
                      placeholder='Enter your email'
                      aria-invalid={!!errors.email}
                      {...register('email')}
                    />
                    {errors.email && (
                      <FieldError>{errors.email.message}</FieldError>
                    )}
                  </Field>

                  <Field data-invalid={!!errors.otp}>
                    <div className='flex items-center justify-between'>
                      <FieldLabel htmlFor='otp' className='text-md'>
                        OTP Code
                      </FieldLabel>
                      <button
                        type='button'
                        onClick={handleResendOTP}
                        disabled={
                          countdown > 0 || isResendPending || isResetPending
                        }
                        className='text-xs text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 font-medium'
                      >
                        <RefreshCw
                          className={cn(
                            'h-3 w-3',
                            isResendPending && 'animate-spin',
                          )}
                        />
                        {countdown > 0
                          ? `Resend in ${countdown}s`
                          : 'Resend Code'}
                      </button>
                    </div>
                    <Controller
                      control={control}
                      name='otp'
                      render={({ field }) => (
                        <div className='flex justify-center my-1'>
                          <InputOTP
                            maxLength={6}
                            id='otp'
                            disabled={isResetPending}
                            value={field.value}
                            onChange={(val) => field.onChange(val)}
                          >
                            <InputOTPGroup className='*:data-[slot=input-otp-slot]:h-10 *:data-[slot=input-otp-slot]:w-9 sm:*:data-[slot=input-otp-slot]:h-11 sm:*:data-[slot=input-otp-slot]:w-10 *:data-[slot=input-otp-slot]:text-lg'>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator className='mx-1 sm:mx-2' />
                            <InputOTPGroup className='*:data-[slot=input-otp-slot]:h-10 *:data-[slot=input-otp-slot]:w-9 sm:*:data-[slot=input-otp-slot]:h-11 sm:*:data-[slot=input-otp-slot]:w-10 *:data-[slot=input-otp-slot]:text-lg'>
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      )}
                    />
                    {errors.otp && (
                      <FieldError className='text-center'>
                        {errors.otp.message}
                      </FieldError>
                    )}
                  </Field>

                  <Field data-invalid={!!errors.newPassword}>
                    <FieldLabel htmlFor='newPassword' className='text-md'>
                      New Password
                    </FieldLabel>
                    <InputGroup className='rounded-lg'>
                      <InputGroupInput
                        id='newPassword'
                        type={isPassword ? 'text' : 'password'}
                        placeholder='Enter at least 8 characters'
                        disabled={isResetPending}
                        aria-invalid={!!errors.newPassword}
                        {...register('newPassword')}
                      />
                      <InputGroupAddon align='inline-end'>
                        <InputGroupButton
                          type='button'
                          onClick={handleTogglePassword}
                          aria-label={
                            isPassword ? 'Hide password' : 'Show password'
                          }
                        >
                          {isPassword ? (
                            <EyeOffIcon className='h-4 w-4' />
                          ) : (
                            <EyeIcon className='h-4 w-4' />
                          )}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    {errors.newPassword && (
                      <FieldError>{errors.newPassword.message}</FieldError>
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
                        placeholder='Re-enter new password'
                        disabled={isResetPending}
                        aria-invalid={!!errors.confirmPassword}
                        {...register('confirmPassword')}
                      />
                      <InputGroupAddon align='inline-end'>
                        <InputGroupButton
                          type='button'
                          onClick={handleToggleConfirm}
                          aria-label={
                            isConfirmPassword
                              ? 'Hide password'
                              : 'Show password'
                          }
                        >
                          {isConfirmPassword ? (
                            <EyeOffIcon className='h-4 w-4' />
                          ) : (
                            <EyeIcon className='h-4 w-4' />
                          )}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    {errors.confirmPassword && (
                      <FieldError>{errors.confirmPassword.message}</FieldError>
                    )}
                  </Field>

                  <Field className='mx-auto w-full max-w-52'>
                    <Button
                      size='lg'
                      type='submit'
                      disabled={isResetPending}
                      className='w-full'
                    >
                      {isResetPending ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Updating...
                        </>
                      ) : (
                        'Update Password'
                      )}
                    </Button>

                    <Link
                      className='flex items-center gap-2 text-muted-foreground text-sm justify-center mt-6 hover:underline hover:italic transition-colors hover:text-foreground'
                      to='/login'
                    >
                      <MoveLeft size={16} />
                      Back To Login
                    </Link>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </form>
          </div>
          <AuthHeroImage srcLight='/screen.png' srcDark='/screenDark.png' />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
