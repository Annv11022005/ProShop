import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRegister } from './hooks/useAuth';

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
import GridBackground from './components/GridBackground';
import AuthHeroImage from './components/AuthHeroImage';
import BrandMark from './components/BrandMark';

function RegisterForm() {
  const { registerUser, isPending } = useRegister();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isPassword, handleToggle] = useToggle(false);
  const [isConfirmPassword, handleToggleConfirm] = useToggle(false);

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
        onSuccess: () => {
          navigate(`/register/verify?email=${encodeURIComponent(email)}`);
        },
        onError: (err) => {
          toast(err.response?.data?.message, { position: 'top-center' });
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
            <BrandMark title='Sign up to ProShop' subtitle='Welcome back !' />

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
                      className='rounded-lg'
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
                      className='rounded-lg'
                      placeholder='Enter Email'
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor='password' className='text-md'>
                      Password
                    </FieldLabel>
                    <InputGroup className='rounded-lg'>
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
                    <InputGroup className='rounded-lg'>
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

                  <Field className='mx-auto max-w-20'>
                    <Button size='lg' disabled={isPending} type='submit'>
                      Sign up
                    </Button>
                  </Field>

                  <Field className='text-center'>
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
