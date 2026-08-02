import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';

const LoginWithThird = () => {
  return (
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
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
          >
            <path d='M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z'></path>
          </svg>
          Login With google
        </Button>
      </Field>
    </div>
  );
};

export default LoginWithThird;
