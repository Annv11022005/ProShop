export default function GridBackground() {
  return (
    <div
      aria-hidden='true'
      className='pointer-events-none absolute inset-0 overflow-hidden'
    >
      <svg
        className='absolute inset-x-[-10%] inset-y-[-8%] h-[116%] w-[120%] fill-none stroke-gray-400/10 mask-[radial-gradient(72%_64%_at_50%_48%,black,rgba(0,0,0,0.7),transparent)] dark:stroke-gray-500/10'
        aria-hidden='true'
      >
        <defs>
          <pattern
            id='auth-grid'
            width='40'
            height='40'
            patternUnits='userSpaceOnUse'
          >
            <path d='M.5 40V.5H40' />
          </pattern>
        </defs>
        <rect width='100%' height='100%' fill='url(#auth-grid)' />
      </svg>
    </div>
  );
}
