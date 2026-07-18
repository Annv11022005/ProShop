import { cn } from '@/lib/utils';
import { Loader2Icon } from 'lucide-react';

function Spinner({ className, ...props }) {
  return (
    <Loader2Icon
      data-slot='spinner'
      role='status'
      aria-label='Loading'
      className={cn('size-12 animate-spin w-full text-center', className)}
      {...props}
    />
  );
}

export { Spinner };
