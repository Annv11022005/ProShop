import React from 'react';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function InvoiceHeader({ orderId, onPrint }) {
  const navigate = useNavigate();

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <header className='mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden'>
      <Button
        variant='outline'
        size='sm'
        className='gap-2 text-xs font-medium cursor-pointer'
        onClick={() => navigate(orderId ? `/order/${orderId}` : -1)}
      >
        <ArrowLeft className='size-3.5' />
        Back to Order
      </Button>

      <div className='flex items-center gap-2'>
        <Button
          type='button'
          size='sm'
          className='gap-2 text-xs font-semibold cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs'
          onClick={handlePrint}
          aria-label='Download or Save as PDF'
        >
          <Download className='size-3.5' />
          Download / Save PDF
        </Button>

        <Button
          type='button'
          size='sm'
          variant='outline'
          className='gap-2 text-xs font-semibold cursor-pointer'
          onClick={handlePrint}
          aria-label='Print Invoice'
        >
          <Printer className='size-3.5' />
          Print
        </Button>
      </div>
    </header>
  );
}
