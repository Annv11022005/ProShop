import { useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';

const INITIAL_ITEMS = [
  {
    id: 'leather-jacket',
    name: 'Leather Biker Jacket',
    image:
      'https://images.unsplash.com/photo-1762160766742-90dbea704e70?auto=format&fit=crop&w=320&h=400&q=80',
    color: 'Black',
    size: 'M',
    qty: 1,
    price: 248.0,
    originalPrice: null,
  },
  {
    id: 'tank-set',
    name: 'Ribbed Tank Set',
    image:
      'https://images.unsplash.com/photo-1763499390053-c7067878efd6?auto=format&fit=crop&w=320&h=400&q=80',
    color: 'Chalk',
    size: 'S',
    qty: 1,
    price: 86.0,
    originalPrice: 118.0,
  },
];

const DELIVERY_FEE = 12.0;
const TAX_RATE = 0.086;
const VALID_PROMOS = { SPRING15: 18.0 };

const formatMoney = (value) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

// Component: CartItemRow
// Hiển thị 1 sản phẩm trong đơn hàng, có nút xoá
function CartItemRow({ item, onRemove }) {
  return (
    <div className='flex w-full items-start gap-3'>
      <div className='relative size-16 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100'>
        <img
          src={item.image}
          alt={item.name}
          className='absolute inset-0 h-full w-full object-cover'
          loading='lazy'
        />
      </div>

      <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
        <div className='truncate text-sm font-medium text-neutral-900'>
          {item.name}
        </div>
        <p className='flex min-w-0 items-center gap-1.5 text-sm text-neutral-500'>
          <span className='shrink-0'>{item.color}</span>
          <span
            aria-hidden='true'
            className='size-1 shrink-0 rounded-full bg-neutral-300'
          />
          <span className='shrink-0'>{item.size}</span>
          <span
            aria-hidden='true'
            className='size-1 shrink-0 rounded-full bg-neutral-300'
          />
          <span className='shrink-0'>Qty {item.qty}</span>
        </p>
      </div>

      <div className='flex shrink-0 flex-col items-end gap-1'>
        <span className='text-sm font-medium tabular-nums text-neutral-900'>
          {formatMoney(item.price)}
        </span>
        {item.originalPrice && (
          <span className='text-xs tabular-nums text-neutral-400 line-through'>
            {formatMoney(item.originalPrice)}
          </span>
        )}
        <button
          type='button'
          onClick={() => onRemove(item.id)}
          aria-label={`Xoá ${item.name}`}
          className='rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700'
        >
          <Trash2 className='size-4' aria-hidden='true' />
        </button>
      </div>
    </div>
  );
}

// Component: PromoCodeField
function PromoCodeField({ appliedCode, discount, onApply }) {
  const [value, setValue] = useState(appliedCode || '');
  const [errorMsg, setErrorMsg] = useState('');

  const handleApply = () => {
    const code = value.trim().toUpperCase();
    if (!code) return;

    if (VALID_PROMOS[code]) {
      setErrorMsg('');
      onApply(code, VALID_PROMOS[code]);
    } else {
      setErrorMsg('Mã không hợp lệ hoặc đã hết hạn');
      onApply(null, 0);
    }
  };

  return (
    <div className='flex w-full flex-col gap-2'>
      <label
        htmlFor='promo-code'
        className='text-sm font-medium text-neutral-900'
      >
        Mã giảm giá
      </label>
      <div className='flex gap-2'>
        <input
          id='promo-code'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          placeholder='Nhập mã...'
          className='w-full min-w-0 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400'
        />
        <button
          type='button'
          onClick={handleApply}
          className='shrink-0 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50'
        >
          Áp dụng
        </button>
      </div>
      {errorMsg && <p className='text-sm text-red-500'>{errorMsg}</p>}
      {!errorMsg && appliedCode && discount > 0 && (
        <p className='text-sm text-neutral-500'>
          <strong className='text-neutral-900'>{appliedCode}</strong> đã giảm{' '}
          {formatMoney(discount)}.
        </p>
      )}
    </div>
  );
}

// Component: SummaryLine
function SummaryLine({ label, value, emphasis = false }) {
  return (
    <div className='flex w-full items-center gap-3 py-1'>
      <div
        className={`flex-1 truncate text-sm ${
          emphasis
            ? 'font-semibold text-emerald-600'
            : 'font-normal text-neutral-900'
        }`}
      >
        {label}
      </div>
      <span
        className={`shrink-0 text-sm font-medium tabular-nums ${
          emphasis ? 'font-semibold text-emerald-600' : 'text-neutral-900'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

// Component chính: OrderSummary
export default function OrderSummary() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [promo, setPromo] = useState({ code: 'SPRING15', discount: 18.0 });

  const handleRemoveItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApplyPromo = (code, discount) => {
    setPromo({ code, discount });
  };

  const { subtotal, tax, total } = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );
    const tax = subtotal * TAX_RATE;
    const total = subtotal + DELIVERY_FEE + tax - (promo.discount || 0);
    return { subtotal, tax, total };
  }, [items, promo.discount]);

  return (
    <aside
      className='flex w-full max-w-md flex-col gap-6 rounded-2xl border border-neutral-200 p-5'
      aria-label='Order summary'
    >
      <div className='flex items-start justify-between gap-4'>
        <div className='min-w-0'>
          <h2 className='text-base font-semibold text-neutral-900'>
            Order Summary
          </h2>
          <p className='mt-0.5 text-sm text-neutral-500'>
            {items.length} {items.length === 1 ? 'item' : 'items'} shipping to
            Home
          </p>
        </div>
      </div>

      <div className='flex w-full flex-col gap-4'>
        {items.length > 0 ? (
          items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onRemove={handleRemoveItem}
            />
          ))
        ) : (
          <p className='text-sm text-neutral-500'>Giỏ hàng trống.</p>
        )}
      </div>

      <div className='h-px w-full bg-neutral-200' />

      <PromoCodeField
        appliedCode={promo.code}
        discount={promo.discount}
        onApply={handleApplyPromo}
      />

      <div className='h-px w-full bg-neutral-200' />

      <div className='flex w-full flex-col'>
        <SummaryLine label='Subtotal' value={formatMoney(subtotal)} />
        <SummaryLine label='Delivery' value={formatMoney(DELIVERY_FEE)} />
        <SummaryLine label='Estimated Tax' value={formatMoney(tax)} />
        {promo.discount > 0 && (
          <SummaryLine
            label='Discount'
            value={`-${formatMoney(promo.discount)}`}
            emphasis
          />
        )}
      </div>

      <div className='flex flex-col gap-3 rounded-xl border border-dashed border-neutral-300 bg-white p-4'>
        <div className='flex min-w-0 items-start justify-between gap-4'>
          <div className='min-w-0'>
            <div className='text-base font-semibold text-neutral-900'>
              Total
            </div>
            <p className='text-sm text-neutral-500'>
              Delivery, promo, and tax included.
            </p>
          </div>
          <span className='shrink-0 text-2xl leading-none font-semibold tabular-nums text-neutral-900'>
            {formatMoney(total)}
          </span>
        </div>
        <div className='flex min-w-0 items-center justify-between gap-3 border-t border-dashed border-neutral-200 pt-3'>
          <span className='truncate text-xs text-neutral-500'>
            Charged after review
          </span>
          <span className='inline-flex h-5 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 text-xs font-medium text-emerald-700'>
            Ready to place
          </span>
        </div>
      </div>
    </aside>
  );
}
