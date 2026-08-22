import AuthHeroImage from './components/AuthHeroImage';
import BrandMark from './components/BrandMark';
import GridBackground from './components/GridBackground';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldError,
} from '@/components/ui/field';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Loader2, MoveLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useForgotPassword } from './hooks/useAuth';
import { toast } from 'sonner';

const forgotSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
});

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { forgotPasswordUser, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotSchema),
    mode: 'onTouched',
  });

  function onSubmit(data) {
    forgotPasswordUser(
      { email: data.email },
      {
        onSuccess: (resData) => {
          toast.success(
            resData?.message ||
              'If that email exists in our system, an OTP has been sent.',
            { position: 'top-center' },
          );
          navigate(`/reset-password?email=${encodeURIComponent(data.email)}`);
        },
        onError: (err) => {
          const message =
            err.response?.data?.message || 'Failed to send reset code';
          toast.error(message, { position: 'top-center' });
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
              title='Forgot Password !'
              subtitle='No worries, we will send you reset instructions.'
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
                      disabled={isPending}
                      className='rounded-lg'
                      placeholder='Enter your email'
                      aria-invalid={!!errors.email}
                      {...register('email')}
                    />
                    {errors.email && (
                      <FieldError>{errors.email.message}</FieldError>
                    )}
                  </Field>

                  <Field className='mx-auto w-full max-w-52'>
                    <Button
                      size='lg'
                      type='submit'
                      disabled={isPending}
                      className='w-full'
                    >
                      {isPending ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Sending OTP...
                        </>
                      ) : (
                        'Reset Password'
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

export default ForgotPasswordPage;
