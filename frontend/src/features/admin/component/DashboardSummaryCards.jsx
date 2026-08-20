import { formatCurrency } from '@/lib/utils';
import { MoreHorizontal, TrendingUp, TrendingDown } from 'lucide-react';

export default function DashboardSummaryCards({ summary }) {
  if (!summary) return null;

  const { revenue, orders, newCustomers, averageOrderValue } = summary;

  const cards = [
    {
      id: 'revenue',
      title: 'Revenue (30 days)',
      value: formatCurrency(revenue?.current),
      changePercent: revenue?.changePercent,
      suffix: 'compared to the previous period',
    },
    {
      id: 'orders',
      title: 'Orders',
      value: orders?.current?.toLocaleString('vi-VN') ?? 0,
      changePercent: orders?.changePercent,
      suffix: '',
    },
    {
      id: 'newCustomers',
      title: 'New Customers',
      value: newCustomers?.current?.toLocaleString('vi-VN') ?? 0,
      changePercent: newCustomers?.changePercent,
      suffix: '',
    },
    {
      id: 'averageOrderValue',
      title: 'Average Order Value',
      value: formatCurrency(averageOrderValue?.current),
      changePercent: averageOrderValue?.changePercent,
      suffix: '',
    },
  ];

  return (
    <div className='relative'>
      {/* Top right icon */}
      <div className='absolute -top-10 right-0 text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded-md transition-colors'>
        <MoreHorizontal className='w-5 h-5' />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {cards.map((card) => {
          const isPositive = card.changePercent >= 0;
          const isNeutral =
            card.changePercent === null || card.changePercent === 0;

          return (
            <div
              key={card.id}
              className='p-5 border border-border rounded-xl bg-card text-card-foreground shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between'
            >
              <p className='text-sm font-medium text-muted-foreground mb-2'>
                {card.title}
              </p>
              <div className='space-y-1.5'>
                <h3 className='text-2xl font-bold tracking-tight text-foreground underline-offset-2'>
                  {card.value}
                </h3>

                {card.changePercent !== undefined &&
                  card.changePercent !== null && (
                    <div className='flex items-center gap-1 text-xs font-semibold'>
                      {isPositive ? (
                        <span className='flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400'>
                          <TrendingUp className='w-3.5 h-3.5 inline-block' />
                          <span>{Math.abs(card.changePercent)}%</span>
                        </span>
                      ) : isNeutral ? (
                        <span className='text-muted-foreground'>0%</span>
                      ) : (
                        <span className='flex items-center gap-0.5 text-rose-600 dark:text-rose-400'>
                          <TrendingDown className='w-3.5 h-3.5 inline-block' />
                          <span>{Math.abs(card.changePercent)}%</span>
                        </span>
                      )}
                      {card.suffix && (
                        <span className='text-muted-foreground font-normal ml-0.5'>
                          {card.suffix}
                        </span>
                      )}
                    </div>
                  )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
