import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

const NotFoundScreen = () => {
  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8'>
      <div className='flex h-20 w-20 items-center justify-center rounded-full bg-muted/80 text-muted-foreground ring-8 ring-muted/30 mb-6'>
        <FileQuestion className='h-10 w-10 text-primary' aria-hidden='true' />
      </div>

      <span className='text-sm font-semibold tracking-wider uppercase text-primary mb-2'>
        404 Error
      </span>
      <h1 className='text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl'>
        Page Not Found
      </h1>
      <p className='mt-4 max-w-md text-base text-muted-foreground'>
        Sorry, we couldn&apos;t find the page you are looking for. It might have
        been moved, deleted, or never existed.
      </p>

      <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
        <button
          type='button'
          onClick={() => window.history.back()}
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'gap-2 rounded-xl',
          )}
        >
          <ArrowLeft className='h-4 w-4' />
          Go Back
        </button>

        <Link
          to='/'
          className={cn(buttonVariants({ variant: 'default' }), 'gap-2 rounded-xl')}
        >
          <Home className='h-4 w-4' />
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundScreen;
