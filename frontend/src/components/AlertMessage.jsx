import { AlertCircleIcon, BadgeCheckIcon } from 'lucide-react';

import { Alert } from './ui/alert';

export function Message({ children, variant = 'danger' }) {
  if (variant === 'danger') {
    return (
      <Alert variant='destructive' className='max-w-md border-destructive'>
        <AlertCircleIcon />
        {children}
      </Alert>
    );
  } else if (variant === 'success') {
    return (
      <Alert
        variant='default'
        className='max-w-md text-success border-success/40 bg-success/5'
      >
        <BadgeCheckIcon className='text-success' />
        {children}
      </Alert>
    );
  }
}
