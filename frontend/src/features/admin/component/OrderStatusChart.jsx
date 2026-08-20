import { Spinner } from '@/components/ui/spinner';
import { useOrderStatusBreakdown } from '../hook/useAnalytics';

const STATUS_CONFIG = {
  PaidAndDelivered: {
    label: 'Đã giao',
    color: '#008700', // Green matching screenshot
    order: 1,
  },
  PaidNotDelivered: {
    label: 'Chờ giao',
    color: '#2563eb', // Blue
    order: 2,
  },
  Unpaid: {
    label: 'Chưa thanh toán',
    color: '#eab308', // Yellow/Amber
    order: 3,
  },
  Cancelled: {
    label: 'Đã hủy',
    color: '#ef4444', // Red
    order: 4,
  },
};

export default function OrderStatusChart() {
  const { isPending, error, statusBreakdown } = useOrderStatusBreakdown();

  const dataList = statusBreakdown || [];
  const totalCount = dataList.reduce((acc, item) => acc + (item.count || 0), 0);

  // Format and order items
  const items = dataList
    .map((item) => {
      const config = STATUS_CONFIG[item.status] || {
        label: item.status,
        color: '#6b7280',
        order: 99,
      };
      const pct = totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0;
      return {
        key: item.status,
        label: config.label,
        color: config.color,
        count: item.count || 0,
        pct,
        order: config.order,
      };
    })
    .sort((a, b) => a.order - b.order);

  // SVG Donut metrics
  const radius = 70;
  const strokeWidth = 28;
  const circumference = 2 * Math.PI * radius;

  let cumulativePct = 0;
  const segments = items.map((item) => {
    const dashLen = (item.pct / 100) * circumference;
    const offset = (cumulativePct / 100) * circumference;
    cumulativePct += item.pct;

    return {
      ...item,
      dashLen,
      offset,
    };
  });

  return (
    <div className='p-5 border border-border rounded-xl bg-card text-card-foreground shadow-2xs flex flex-col justify-between h-full'>
      {/* Card Title */}
      <h2 className='text-lg font-semibold tracking-tight text-foreground mb-4'>
        Trạng thái đơn hàng
      </h2>

      {/* Donut Chart Area */}
      <div className='flex-1 flex flex-col items-center justify-center min-h-[220px]'>
        {isPending ? (
          <Spinner />
        ) : error ? (
          <p className='text-sm text-destructive font-medium'>
            {error.message || 'Lỗi tải trạng thái đơn'}
          </p>
        ) : (
          <div className='flex flex-col items-center gap-6 w-full'>
            {/* Donut SVG */}
            <div className='relative w-48 h-48 flex items-center justify-center'>
              <svg
                viewBox='0 0 200 200'
                className='w-full h-full transform -rotate-90'
              >
                {/* Background Ring if empty */}
                {totalCount === 0 && (
                  <circle
                    cx='100'
                    cy='100'
                    r={radius}
                    fill='none'
                    stroke='currentColor'
                    className='text-muted/40'
                    strokeWidth={strokeWidth}
                  />
                )}

                {/* Segments */}
                {segments.map(
                  (seg) =>
                    seg.pct > 0 && (
                      <circle
                        key={seg.key}
                        cx='100'
                        cy='100'
                        r={radius}
                        fill='none'
                        stroke={seg.color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${seg.dashLen} ${circumference - seg.dashLen}`}
                        strokeDashoffset={-seg.offset}
                        className='transition-all duration-500 ease-out hover:opacity-90'
                      />
                    )
                )}
              </svg>
            </div>

            {/* Legend List */}
            <div className='w-full grid grid-cols-1 gap-2.5 px-2 text-sm font-medium'>
              {items.map((item) => (
                <div
                  key={item.key}
                  className='flex items-center gap-2.5 text-foreground'
                >
                  <span
                    className='w-3 h-3 rounded-xs shrink-0 inline-block'
                    style={{ backgroundColor: item.color }}
                  />
                  <span className='truncate text-muted-foreground font-normal'>
                    {item.label}
                  </span>
                  <span className='text-muted-foreground font-semibold'>·</span>
                  <span className='font-bold text-foreground'>{item.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
