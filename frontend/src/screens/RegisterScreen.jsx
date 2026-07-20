import RegisterForm from '@/features/Authentication/RegisterForm';

const RegisterScreen = () => {
  return (
    <div className='w-150 mx-auto h-full'>
      <h2 className=' text-3xl font-bold text-primary/80 '>Sign Up</h2>
      <RegisterForm />
    </div>
  );
};

export default RegisterScreen;
