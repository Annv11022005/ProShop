import {
  ArrowRight,
  CircleCheck,
  CreditCard,
  Download,
  LifeBuoy,
  Mail,
  Printer,
  Truck,
} from 'lucide-react';

const ORDER = {
  orderId: 'HLD-2026-18042',
  receiptId: 'RCT-2026-018042',
  date: 'May 18, 2026',
  customerEmail: 'jordan@example.com',
};

const SHIP_TO = {
  name: 'Jordan Reeves',
  lines: [
    '180 Bedford Avenue',
    'Apt 4F',
    'Brooklyn, NY 11211',
    'United States',
  ],
};

const BILL_TO = SHIP_TO;

const PAYMENT = {
  method: 'Visa · 4242',
  expiry: 'Expires 04 / 28',
  chargedAt: 'Charged May 18, 2026 at 9:42 AM',
};

const ITEMS = [
  {
    id: 'field-shell-jacket',
    brand: 'Halden',
    name: 'Field Shell Jacket',
    variant: 'Olive · M · Qty 1',
    price: '$185.00',
    unitPrice: null,
    image:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=160&h=160&q=80',
  },
  {
    id: 'compass-down-vest',
    brand: 'Halden',
    name: 'Compass Down Vest',
    variant: 'Slate · M · Qty 1',
    price: '$228.00',
    unitPrice: null,
    image:
      'https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&w=160&h=160&q=80',
  },
  {
    id: 'linen-field-shirt',
    brand: 'Halden',
    name: 'Linen Field Shirt',
    variant: 'Sand · M · Qty 2',
    price: '$256.00',
    unitPrice: '$128.00 each',
    image:
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=160&h=160&q=80',
  },
];

const PRICE_ROWS = [
  { label: 'Subtotal', value: '$669.00' },
  { label: 'Shipping', value: '$12.00' },
  { label: 'Discount (WELCOME15)', value: '-$100.35', emphasis: 'success' },
  { label: 'Estimated Tax', value: '$51.27' },
];

const TOTAL = { label: 'Total', value: '$631.92' };

const SHIPPING = {
  eta: 'Arrives May 22, 2026 to May 25, 2026',
  carrier: 'UPS Ground · Standard, 3 - 5 business days',
};

// Component: ReceiptHeader
function ReceiptHeader({ receiptId }) {
  return (
    <header className='mb-6 flex flex-wrap items-center justify-between gap-4 '>
      <div className='flex flex-wrap items-center gap-2'>
        <button
          type='button'
          aria-label={`Download receipt ${receiptId} as PDF`}
          className='inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90'
        >
          <Download className='size-4' aria-hidden='true' />
          Download
        </button>
        <button
          type='button'
          aria-label={`Email receipt ${receiptId}`}
          className='inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent'
        >
          <Mail className='size-4' aria-hidden='true' />
          Email
        </button>
        <button
          type='button'
          aria-label={`Print receipt ${receiptId}`}
          className='inline-flex size-8 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-accent'
        >
          <Printer className='size-4' aria-hidden='true' />
        </button>
      </div>
    </header>
  );
}

// Component: ReceiptMeta
function ReceiptMeta({ order }) {
  return (
    <div className='flex flex-wrap items-start justify-between gap-4'>
      <div className='flex min-w-0 flex-col gap-2'>
        <span className='inline-flex w-fit items-center gap-1 rounded-full bg-success px-2 py-0.5 text-xs font-medium text-white'>
          <CircleCheck className='size-3.5' aria-hidden='true' />
          Paid
        </span>
        <h1 className='text-2xl font-semibold tracking-tight text-foreground md:text-3xl'>
          Thanks For Your Order
        </h1>
        <p className='text-pretty text-sm text-muted-foreground'>
          A copy of this receipt was sent to{' '}
          <span className='font-medium text-foreground'>
            {order.customerEmail}
          </span>
          .
        </p>
      </div>

      <dl className='grid w-full grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-muted-foreground sm:w-auto sm:text-right'>
        <div className='contents'>
          <dt className='font-medium text-foreground'>Order</dt>
          <dd className='font-mono tabular-nums'>
            <a
              href='#'
              aria-label={`View order ${order.orderId} details`}
              className='underline-offset-4 transition-colors hover:text-primary hover:underline'
            >
              {order.orderId}
            </a>
          </dd>
        </div>
        <div className='contents'>
          <dt className='font-medium text-foreground'>Receipt</dt>
          <dd className='font-mono tabular-nums'>{order.receiptId}</dd>
        </div>
        <div className='contents'>
          <dt className='font-medium text-foreground'>Date</dt>
          <dd>{order.date}</dd>
        </div>
      </dl>
    </div>
  );
}

// Component: AddressBlock
function AddressBlock({ label, address }) {
  return (
    <div className='flex min-w-0 flex-col gap-2'>
      <p className='text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase'>
        {label}
      </p>
      <address className='text-sm leading-snug text-foreground not-italic'>
        <p className='font-medium'>{address.name}</p>
        {address.lines.map((line) => (
          <p key={line} className='text-muted-foreground'>
            {line}
          </p>
        ))}
      </address>
    </div>
  );
}

// Component: PaymentBlock
function PaymentBlock({ payment }) {
  return (
    <div className='flex min-w-0 flex-col gap-2'>
      <p className='text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase'>
        Payment
      </p>
      <div className='flex flex-col gap-1 text-sm leading-snug'>
        <div className='flex items-center gap-2'>
          <div className='flex size-8 shrink-0 items-center justify-center rounded-md border border-border'>
            <CreditCard
              className='size-4 text-muted-foreground'
              aria-hidden='true'
            />
          </div>
          <div className='flex min-w-0 flex-col'>
            <span className='font-medium tabular-nums text-foreground'>
              {payment.method}
            </span>
            <span className='text-xs text-muted-foreground'>
              {payment.expiry}
            </span>
          </div>
        </div>
        <p className='text-xs text-muted-foreground'>{payment.chargedAt}</p>
      </div>
    </div>
  );
}

// Component: OrderItemRow
function OrderItemRow({ item }) {
  return (
    <article role='listitem' className='flex min-w-0 items-start gap-4'>
      <div className='relative size-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted'>
        <a
          href='#'
          aria-label={`View ${item.name}`}
          className='absolute inset-0 block'
        >
          <img
            src={item.image}
            alt={`${item.name} product photo`}
            className='absolute inset-0 size-full object-cover'
            loading='lazy'
          />
        </a>
      </div>

      <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
        <p className='text-xs font-medium tracking-wide text-muted-foreground uppercase'>
          {item.brand}
        </p>
        <h3 className='min-w-0 text-sm leading-snug font-medium text-foreground'>
          <a
            href='#'
            className='block truncate underline-offset-4 transition-colors hover:text-primary hover:underline'
          >
            {item.name}
          </a>
        </h3>
        <p className='text-xs text-muted-foreground'>{item.variant}</p>
      </div>

      <div className='flex shrink-0 flex-col items-end gap-0.5 text-sm tabular-nums'>
        <span className='font-semibold text-foreground'>{item.price}</span>
        {item.unitPrice && (
          <span className='text-xs text-muted-foreground'>
            {item.unitPrice}
          </span>
        )}
      </div>
    </article>
  );
}

// Component: PriceSummary
function PriceSummary({ rows, total }) {
  return (
    <dl className='flex flex-col gap-2 self-end text-sm sm:min-w-72'>
      {rows.map((row) => (
        <div
          key={row.label}
          className='flex items-baseline justify-between gap-4'
        >
          <dt className='text-muted-foreground'>{row.label}</dt>
          <dd
            className={`font-medium tabular-nums ${
              row.emphasis === 'success' ? 'text-success' : 'text-foreground'
            }`}
          >
            {row.value}
          </dd>
        </div>
      ))}

      <div className='my-1 h-px w-full bg-border' />

      <div className='flex items-baseline justify-between gap-4'>
        <dt className='text-base font-semibold text-foreground'>
          {total.label}
        </dt>
        <dd className='text-base font-semibold tabular-nums text-foreground'>
          {total.value}
        </dd>
      </div>
    </dl>
  );
}

// Component: ReceiptFooter
function ReceiptFooter({ shipping, orderId }) {
  return (
    <div className='flex flex-col items-start gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex min-w-0 items-start gap-3'>
        <Truck
          className='mt-0.5 size-5 shrink-0 text-muted-foreground'
          aria-hidden='true'
        />
        <div className='flex min-w-0 flex-col gap-0.5'>
          <p className='text-sm leading-snug font-medium text-foreground'>
            {shipping.eta}
          </p>
          <p className='text-xs leading-snug text-muted-foreground'>
            {shipping.carrier}
          </p>
          <a
            href='#'
            aria-label={`Track order ${orderId}`}
            className='mt-1 inline-flex w-fit items-center gap-1 text-xs font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline'
          >
            Track Shipment
            <ArrowRight className='size-3.5' aria-hidden='true' />
          </a>
        </div>
      </div>

      <a
        href='#'
        aria-label='Contact support'
        className='inline-flex items-center gap-1.5 text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline'
      >
        <LifeBuoy className='size-3.5' aria-hidden='true' />
        Need help with this order?
      </a>
    </div>
  );
}

// Component chính: ReceiptPage
export default function ReceiptPage() {
  return (
    <main className='min-h-svh w-full bg-background'>
      <section
        aria-labelledby='receipt-heading'
        className='mx-auto w-full max-w-3xl px-4 py-8 md:px-6 md:py-12'
      >
        <ReceiptHeader receiptId={ORDER.receiptId} />

        <div className='flex flex-col gap-6 rounded-xl border border-border bg-card p-5 text-card-foreground sm:p-6'>
          <ReceiptMeta order={ORDER} />

          <div className='grid grid-cols-1 gap-5 sm:grid-cols-3'>
            <AddressBlock label='Ship To' address={SHIP_TO} />
            <AddressBlock label='Bill To' address={BILL_TO} />
            <PaymentBlock payment={PAYMENT} />
          </div>

          <div className='h-px w-full bg-border' />

          <div
            role='list'
            aria-label='Ordered items'
            className='flex flex-col gap-4'
          >
            {ITEMS.map((item) => (
              <OrderItemRow key={item.id} item={item} />
            ))}
          </div>

          <div className='h-px w-full bg-border' />

          <PriceSummary rows={PRICE_ROWS} total={TOTAL} />

          <ReceiptFooter shipping={SHIPPING} orderId={ORDER.orderId} />
        </div>
      </section>
    </main>
  );
}
