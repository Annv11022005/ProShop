import LoginForm from '@/features/authentication/LoginForm';

const LoginScreen = () => {
  return (
    <div className='w-150 mx-auto h-full'>
      <h2 className=' text-3xl font-bold text-primary/80 '>Sign In</h2>
      <LoginForm />
    </div>
  );
};

export default LoginScreen;
