export default function BrandMark({ title, subtitle }) {
  return (
    <div className='flex flex-col items-center gap-3 text-center'>
      <div className='flex flex-col gap-1'>
        <h1 className='text-xl font-semibold tracking-tight text-foreground'>
          {title}
        </h1>
        <p className='text-sm text-muted-foreground'>{subtitle}</p>
      </div>
    </div>
  );
}
