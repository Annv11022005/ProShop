import { AlertCircleIcon, BadgeCheckIcon } from 'lucide-react';

import { Alert } from './alert';

export function Message({ children, variant = 'danger' }) {
  if (variant === 'danger') {
    return (
      <Alert variant='destructive' className='max-w-md border-destructive'>
        <AlertCircleIcon />
        {children}
      </Alert>
    );
  } else if (variant === 'success') {
    <Alert
      variant='destructive'
      className='max-w-md text-success border-success'
    >
      <BadgeCheckIcon />
      {children}
    </Alert>;
  }
}
