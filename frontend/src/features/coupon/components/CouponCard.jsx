import { Button } from '@/components/ui/button';
import { Clock, ShoppingBag, Ticket } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const CouponCard = ({ coupon }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      toast.error(e);
    }
  };

  return (
    <article
      aria-labelledby={`${coupon.id}-name`}
      className='flex flex-col gap-2 rounded-2xl border bg-muted/50 p-2'
    >
      <header className='px-2 pt-1'>
        <div className='text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground'>
          {coupon.category}
        </div>
      </header>

      <div className='flex grow flex-col gap-3 rounded-xl border border-border bg-card p-3.5 shadow-sm'>
        <div className='flex flex-col gap-0.5'>
          <div className='flex flex-wrap items-center gap-x-2.5 gap-y-1'>
            <h2
              id={`${coupon.id}-name`}
              className='text-2xl font-semibold tracking-tight text-primary'
            >
              {coupon.title}
            </h2>
            {coupon.badge && (
              <span
                className={`inline-flex h-5 min-w-5 items-center justify-center rounded-sm px-1.5 text-xs font-medium text-white ${coupon.badge.color}`}
              >
                {coupon.badge.label}
              </span>
            )}
          </div>
          <p className='text-sm text-muted-foreground'>{coupon.subtitle}</p>
        </div>

        <p className='text-sm leading-snug text-card-foreground/90'>
          {coupon.description}
        </p>

        <div className='mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-muted-foreground'>
          <span className='inline-flex items-center gap-1.5'>
            <ShoppingBag className='size-3.5' aria-hidden='true' />
            <strong className='font-medium text-primary'>
              {coupon.minSpend
                ? `Tối thiểu ${coupon.minSpend}`
                : 'Không giới hạn'}
            </strong>
          </span>
          <span aria-hidden='true' className='size-1 rounded-full bg-border' />
          <span className='inline-flex items-center gap-1.5'>
            <Clock className='size-3.5' aria-hidden='true' />
            <strong className='font-medium text-primary'>
              {coupon.expiry}
            </strong>
          </span>
        </div>
      </div>

      <footer className='flex flex-row items-center justify-between gap-2 px-2 pb-1'>
        <span className='select-all font-mono text-sm font-semibold tracking-[0.14em] text-primary'>
          {coupon.code}
        </span>
        <Button
          onClick={handleCopy}
          aria-label={`Copy coupon ${coupon.code}`}
          variant={copied ? 'outline' : 'default'}
        >
          <Ticket className='size-3.5' aria-hidden='true' />
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </footer>
    </article>
  );
};

export default CouponCard;
