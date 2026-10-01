import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useGetOrderDetail } from './hooks/useOrders';
import { useGetSellerAddress } from '@/features/address/hooks/useAddress';
import InvoiceHeader from './components/invoice/InvoiceHeader';
import InvoiceMeta from './components/invoice/InvoiceMeta';
import InvoiceParties from './components/invoice/InvoiceParties';
import InvoiceItemsTable from './components/invoice/InvoiceItemsTable';
import InvoiceSummary from './components/invoice/InvoiceSummary';
import InvoiceFooter from './components/invoice/InvoiceFooter';
import { Spinner } from '@/components/ui/spinner';
import { Message } from '@/components/AlertMessage';

export default function OrderDetail({ order: propOrder }) {
  const { id: paramOrderId } = useParams();
  const orderId = propOrder?._id || paramOrderId;

  const {
    order: fetchedOrder,
    isPending: pendingOrder,
    error: orderError,
  } = useGetOrderDetail(paramOrderId && !propOrder ? paramOrderId : null);

  const { sellerAddress } = useGetSellerAddress();

  const order = propOrder || fetchedOrder;

  const handlePrint = () => {
    window.print();
  };

  if (pendingOrder) {
    return (
      <div className='flex min-h-[60vh] w-full items-center justify-center py-16'>
        <Spinner className='size-8 text-primary' />
      </div>
    );
  }

  if (orderError) {
    return (
      <div className='max-w-2xl mx-auto py-12 px-4'>
        <Message>{orderError?.message || 'Failed to load order invoice details'}</Message>
      </div>
    );
  }

  if (!order) {
    return (
      <div className='max-w-2xl mx-auto py-12 px-4 text-center'>
        <Message>Order not found</Message>
      </div>
    );
  }

  return (
    <main className='min-h-screen w-full bg-background print:bg-white print:text-black py-6 sm:py-10'>
      <div className='mx-auto w-full max-w-4xl px-4 sm:px-6'>
        {/* Action Header (Hidden during print) */}
        <InvoiceHeader orderId={order._id} onPrint={handlePrint} />

        {/* Printable Invoice Container */}
        <div
          id='printable-invoice'
          className='flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 sm:p-10 text-card-foreground shadow-sm print:border-none print:shadow-none print:p-0 print:m-0'
        >
          {/* 1. Meta / Status & ID */}
          <InvoiceMeta order={order} />

          {/* 2. Parties: Seller (Admin Address) & Customer (Ship To) */}
          <InvoiceParties order={order} sellerAddress={sellerAddress} />

          {/* Divider */}
          <div className='h-px w-full bg-border/80' />

          {/* 3. Items Table */}
          <InvoiceItemsTable items={order.orderItems} />

          {/* 4. Financial Summary */}
          <InvoiceSummary order={order} />

          {/* 5. Policy, Warranty & Footer */}
          <InvoiceFooter sellerAddress={sellerAddress} />
        </div>
      </div>
    </main>
  );
}
