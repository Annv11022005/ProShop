import React, { useState } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  XCircle,
  Eye,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { useGetAllReturns } from '@/features/returns/hooks/useReturns';
import ReturnReviewModal from './ReturnReviewModal';

const STATUS_TABS = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING_APPROVAL', label: 'Awaiting Review' },
  { key: 'APPROVED', label: 'Approved' },
  { key: 'RETURNING', label: 'In Transit' },
  { key: 'RECEIVED', label: 'Received' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'REJECTED', label: 'Rejected' },
];

const STATUS_BADGES = {
  PENDING_APPROVAL: {
    label: 'Awaiting Review',
    className: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300',
    icon: Clock,
  },
  APPROVED: {
    label: 'Approved',
    className: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300',
    icon: CheckCircle2,
  },
  RETURNING: {
    label: 'In Transit',
    className: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300',
    icon: Truck,
  },
  RECEIVED: {
    label: 'Received',
    className: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300',
    icon: PackageCheck,
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300',
    icon: CheckCircle2,
  },
  REJECTED: {
    label: 'Rejected',
    className: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300',
    icon: XCircle,
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/60 dark:text-gray-300',
    icon: XCircle,
  },
};

export default function ReturnListPage() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [page, setPage] = useState(1);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const { isPending, error, data, refetch } = useGetAllReturns({
    page,
    limit: 15,
    status: activeTab,
  });

  const returns = data?.returns || [];
  const pendingCount = data?.pendingCount || 0;

  const handleOpenReview = (doc) => {
    setSelectedReturn(doc);
    setOpenModal(true);
  };

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground flex items-center gap-2'>
            <RotateCcw className='w-6 h-6 text-primary' />
            Return & Exchange Management
          </h1>
          <p className='text-xs text-muted-foreground mt-1'>
            Review, approve, and manage customer product return and exchange requests.
          </p>
        </div>

        {pendingCount > 0 && (
          <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200 border border-amber-300 text-xs font-semibold'>
            <span className='w-2 h-2 rounded-full bg-amber-500 animate-pulse'></span>
            {pendingCount} request{pendingCount !== 1 ? 's' : ''} awaiting review
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className='flex items-center gap-1.5 overflow-x-auto pb-2 border-b scrollbar-none'>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            type='button'
            onClick={() => {
              setActiveTab(tab.key);
              setPage(1);
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Table */}
      {isPending ? (
        <div className='py-20 flex justify-center'>
          <Spinner />
        </div>
      ) : error ? (
        <div className='p-4 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200'>
          Failed to load return requests: {error.message}
        </div>
      ) : returns.length === 0 ? (
        <div className='py-16 text-center border rounded-2xl bg-card'>
          <RotateCcw className='w-10 h-10 mx-auto text-muted-foreground/40 mb-3' />
          <h3 className='font-semibold text-sm text-foreground'>
            No return requests found
          </h3>
          <p className='text-xs text-muted-foreground mt-1'>
            There are currently no return requests matching this filter.
          </p>
        </div>
      ) : (
        <div className='border rounded-2xl bg-card overflow-hidden shadow-xs'>
          <Table>
            <TableHeader>
              <TableRow className='bg-muted/40'>
                <TableHead className='w-[100px] text-xs font-bold'>Case ID</TableHead>
                <TableHead className='text-xs font-bold'>Customer</TableHead>
                <TableHead className='text-xs font-bold'>Order</TableHead>
                <TableHead className='text-xs font-bold'>Resolution</TableHead>
                <TableHead className='text-xs font-bold'>Reason</TableHead>
                <TableHead className='text-xs font-bold'>Refund Amount</TableHead>
                <TableHead className='text-xs font-bold'>Status</TableHead>
                <TableHead className='text-xs font-bold'>Submitted</TableHead>
                <TableHead className='text-right text-xs font-bold'>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {returns.map((doc) => {
                const badge = STATUS_BADGES[doc.status] || STATUS_BADGES.PENDING_APPROVAL;
                const BadgeIcon = badge.icon;
                const isRefund = doc.type === 'RETURN_REFUND';

                return (
                  <TableRow key={doc._id} className='hover:bg-muted/30 transition-colors'>
                    <TableCell className='font-mono font-bold text-xs'>
                      #{doc._id.slice(-6).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div className='text-xs font-semibold text-foreground'>
                        {doc.user?.name || 'Customer'}
                      </div>
                      <div className='text-[11px] text-muted-foreground'>
                        {doc.user?.email}
                      </div>
                    </TableCell>
                    <TableCell className='font-mono text-xs text-primary font-medium'>
                      #{doc.order?._id ? doc.order._id.slice(-6).toUpperCase() : doc.order?.slice?.(-6)?.toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <span className='inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-primary/10 text-primary'>
                        {isRefund ? 'Refund' : 'Exchange'}
                      </span>
                    </TableCell>
                    <TableCell className='text-xs max-w-[150px] truncate' title={doc.reason}>
                      {doc.reason}
                    </TableCell>
                    <TableCell className='text-xs font-bold text-foreground'>
                      {doc.refundAmount ? formatCurrency(doc.refundAmount) : '-'}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.className}`}
                      >
                        <BadgeIcon className='w-3 h-3' />
                        {badge.label}
                      </span>
                    </TableCell>
                    <TableCell className='text-xs text-muted-foreground whitespace-nowrap'>
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className='text-right'>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => handleOpenReview(doc)}
                        className='text-xs h-8 px-2.5 font-semibold border-primary/30 text-primary hover:bg-primary/5'
                      >
                        <Eye className='w-3.5 h-3.5 mr-1' />
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Review Modal */}
      <ReturnReviewModal
        returnDoc={selectedReturn}
        open={openModal}
        onOpenChange={setOpenModal}
        onSuccess={() => {
          refetch();
        }}
      />
    </div>
  );
}
