import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { useRevenueAnalytics } from '../hook/useAnalytics';

function formatYLabel(val) {
  if (val === 0) return '0';
  if (val >= 1_000_000_000) {
    return `${(val / 1_000_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}tỷ`;
  }
  if (val >= 1_000_000) {
    return `${Math.round(val / 1_000_000)}tr`;
  }
  if (val >= 1_000) {
    return `${Math.round(val / 1_000)}k`;
  }
  return String(val);
}

function getSmoothPath(points) {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cp1x = curr.x + (next.x - curr.x) / 2;
    const cp1y = curr.y;
    const cp2x = curr.x + (next.x - curr.x) / 2;
    const cp2y = next.y;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
  }
  return d;
}

export default function RevenueChart() {
  const [period, setPeriod] = useState('7d');
  const [hoverIndex, setHoverIndex] = useState(null);

  const { isPending, error, revenueData } = useRevenueAnalytics({ period });

  const periods = [
    { key: '7d', label: '7 ngày' },
    { key: '30d', label: '30 ngày' },
    { key: '12m', label: '12 tháng' },
  ];

  const labels = revenueData?.labels || [];
  const revenues = revenueData?.revenue || [];

  // Chart SVG bounds
  const svgWidth = 600;
  const svgHeight = 260;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 35;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Calculate Y domain
  const rawMax = Math.max(...revenues, 10_000_000);
  const rawMin = 0;
  // Nice max rounding
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)));
  const yMax = Math.ceil(rawMax / (magnitude / 2)) * (magnitude / 2);
  const yTicksCount = 5;
  const yTicks = Array.from({ length: yTicksCount }, (_, i) =>
    Math.round(yMax - (i * yMax) / (yTicksCount - 1))
  );

  // Map data to SVG coordinates
  const points = revenues.map((val, idx) => {
    const x =
      labels.length > 1
        ? paddingLeft + (idx / (labels.length - 1)) * chartWidth
        : paddingLeft + chartWidth / 2;
    const y =
      paddingTop + chartHeight - ((val - rawMin) / (yMax - rawMin || 1)) * chartHeight;
    return { x, y, val, label: labels[idx] };
  });

  const linePathD = getSmoothPath(points);
  const areaPathD =
    points.length > 0
      ? `${linePathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
      : '';

  // X-axis ticks filter to avoid overcrowding
  const step = Math.max(1, Math.floor(labels.length / 7));

  return (
    <div className='p-5 border border-border rounded-xl bg-card text-card-foreground shadow-2xs flex flex-col h-full'>
      {/* Card Header */}
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-lg font-semibold tracking-tight text-foreground'>
          Doanh thu theo ngày
        </h2>
        <div className='flex items-center gap-1.5 bg-muted/60 p-1 rounded-lg border border-border/50'>
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                period === p.key
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Body */}
      <div className='relative flex-1 min-h-[240px] flex items-center justify-center'>
        {isPending ? (
          <Spinner />
        ) : error ? (
          <p className='text-sm text-destructive font-medium'>
            {error.message || 'Khôi phục dữ liệu thất bại'}
          </p>
        ) : (
          <div className='w-full h-full relative select-none'>
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className='w-full h-full overflow-visible'
              onMouseLeave={() => setHoverIndex(null)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const mouseX = ((e.clientX - rect.left) / rect.width) * svgWidth;
                if (points.length > 0) {
                  let closestIdx = 0;
                  let minDiff = Infinity;
                  points.forEach((pt, i) => {
                    const diff = Math.abs(pt.x - mouseX);
                    if (diff < minDiff) {
                      minDiff = diff;
                      closestIdx = i;
                    }
                  });
                  setHoverIndex(closestIdx);
                }
              }}
            >
              <defs>
                <linearGradient id='revenueGradient' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor='#2563eb' stopOpacity='0.25' />
                  <stop offset='100%' stopColor='#2563eb' stopOpacity='0.01' />
                </linearGradient>
              </defs>

              {/* Gridlines and Y Labels */}
              {yTicks.map((tickVal, i) => {
                const y =
                  paddingTop +
                  chartHeight -
                  ((tickVal - rawMin) / (yMax - rawMin || 1)) * chartHeight;
                return (
                  <g key={`y-${i}`}>
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={svgWidth - paddingRight}
                      y2={y}
                      stroke='currentColor'
                      className='text-border/60'
                      strokeDasharray={i === yTicksCount - 1 ? '' : '3 3'}
                      strokeWidth='1'
                    />
                    <text
                      x={paddingLeft - 8}
                      y={y + 4}
                      textAnchor='end'
                      className='fill-muted-foreground text-[11px] font-medium'
                    >
                      {formatYLabel(tickVal)}
                    </text>
                  </g>
                );
              })}

              {/* Area Fill */}
              {areaPathD && <path d={areaPathD} fill='url(#revenueGradient)' />}

              {/* Smooth Line */}
              {linePathD && (
                <path
                  d={linePathD}
                  fill='none'
                  stroke='#2563eb'
                  strokeWidth='3'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              )}

              {/* X Labels */}
              {points.map((pt, i) => {
                const shouldShow =
                  i === 0 ||
                  i === points.length - 1 ||
                  i % step === 0;

                if (!shouldShow) return null;

                return (
                  <text
                    key={`x-${i}`}
                    x={pt.x}
                    y={svgHeight - 8}
                    textAnchor='middle'
                    className='fill-muted-foreground text-[11px] font-medium'
                  >
                    {pt.label}
                  </text>
                );
              })}

              {/* Hover Indicator */}
              {hoverIndex !== null && points[hoverIndex] && (
                <g>
                  <line
                    x1={points[hoverIndex].x}
                    y1={paddingTop}
                    x2={points[hoverIndex].x}
                    y2={paddingTop + chartHeight}
                    stroke='#2563eb'
                    strokeWidth='1.5'
                    strokeDasharray='4 4'
                    className='opacity-70'
                  />
                  <circle
                    cx={points[hoverIndex].x}
                    cy={points[hoverIndex].y}
                    r='5.5'
                    fill='#2563eb'
                    stroke='#ffffff'
                    strokeWidth='2.5'
                  />
                </g>
              )}
            </svg>

            {/* Hover Tooltip Popup */}
            {hoverIndex !== null && points[hoverIndex] && (
              <div
                className='absolute pointer-events-none bg-popover text-popover-foreground border border-border shadow-md rounded-lg px-3 py-1.5 text-xs z-10 -translate-x-1/2 -translate-y-full mb-2 transition-all'
                style={{
                  left: `${(points[hoverIndex].x / svgWidth) * 100}%`,
                  top: `${(points[hoverIndex].y / svgHeight) * 100}%`,
                }}
              >
                <div className='font-semibold text-muted-foreground mb-0.5'>
                  {points[hoverIndex].label}
                </div>
                <div className='font-bold text-primary'>
                  {points[hoverIndex].val.toLocaleString('vi-VN')} ₫
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
