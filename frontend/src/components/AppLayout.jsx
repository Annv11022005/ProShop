import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Header from './Header';
import Footer from './Footer';

function AppLayout() {
  return (
    <div className='grid min-h-screen grid-rows-[auto_1fr_auto]'>
      <Header />
      <main className='bg-background px-4 sm:px-8 lg:px-12 pb-16 pt-6 sm:pt-10'>
        <div className='mx-auto flex max-w-7xl flex-col gap-8'>
          <Outlet />
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default AppLayout;
