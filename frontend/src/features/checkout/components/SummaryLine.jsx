export default function SummaryLine({ label, value, emphasis = false }) {
  return (
    <div className='flex w-full items-center gap-3 py-1'>
      <div
        className={`flex-1 truncate text-sm ${
          emphasis
            ? 'font-semibold text-success'
            : 'font-normal text-foreground'
        }`}
      >
        {label}
      </div>
      <span
        className={`shrink-0 text-sm font-medium tabular-nums ${
          emphasis ? 'font-semibold text-success' : 'text-foreground'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
