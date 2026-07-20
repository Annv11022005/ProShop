import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Header from './ui/Header';
import Footer from './ui/Footer';

function AppLayout() {
  return (
    <div className='grid h-screen grid-rows-[auto_1fr_auto]'>
      <Header />
      <main className='bg-grey-50 px-12 pb-16 pt-10'>
        <div className='mx-auto flex max-w-300 flex-col gap-8'>
          <Outlet />
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default AppLayout;
