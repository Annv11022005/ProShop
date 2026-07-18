import { AlertCircleIcon } from 'lucide-react';

import { Alert } from './alert';

export function Message({ children }) {
  return (
    <Alert variant='destructive' className='max-w-md'>
      <AlertCircleIcon />
      {children}
    </Alert>
  );
}
