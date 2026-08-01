import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setCredentials } from './authSlice';
import { useVerify } from './hooks/useAuth';

import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { ChevronLeft, RefreshCwIcon } from 'lucide-react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

const OTPRegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  const { verifyUser, isPending } = useVerify();

  const [OTP, setOTP] = useState();

  function VerifyHandler(e) {
    e.preventDefault();

    verifyUser(
      {
        email,
        otp: OTP,
      },
      {
        onSuccess: (data) => {
          dispatch(setCredentials(data));
          navigate('/');
          toast.success('Register successfully', { position: 'top-center' });
        },
        onError: (err) =>
          toast.error(err.response?.data?.message, { position: 'top-center' }),
      },
    );
  }

  return (
    <div className='flex'>
      <Button size='lg' onClick={() => navigate('/register')}>
        <ChevronLeft />
        Go Back
      </Button>
      <form onSubmit={VerifyHandler} className='max-w-md mx-auto'>
        <Card>
          <CardHeader>
            <CardTitle>Verify your register</CardTitle>
            <CardDescription>
              Enter the verification code we sent to your email address:{' '}
              <span className='font-medium'>{email}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Field>
              <div className='flex items-center justify-between'>
                <FieldLabel htmlFor='otp-verification'>
                  Verification code
                </FieldLabel>
                <Button variant='outline' size='xs' type='button'>
                  <RefreshCwIcon />
                  Resend Code
                </Button>
              </div>
              <InputOTP
                maxLength={6}
                id='otp-verification'
                required
                value={OTP}
                onChange={(value) => setOTP(value)}
              >
                <InputOTPGroup className='*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl'>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator className='mx-2' />
                <InputOTPGroup className='*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl'>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </Field>
          </CardContent>
          <CardFooter>
            <Field>
              <Button disabled={isPending} type='submit' className='w-full'>
                Verify
              </Button>
              <div className='text-sm text-muted-foreground'>
                Having trouble signing in?{' '}
                <a
                  href='#'
                  className='underline underline-offset-4 transition-colors hover:text-primary'
                >
                  Contact support
                </a>
              </div>
            </Field>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default OTPRegisterPage;
