export default function SummaryLine({ label, value, emphasis = false }) {
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
