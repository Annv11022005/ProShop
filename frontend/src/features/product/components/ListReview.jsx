import { Rating } from '@/components/reui/rating';

const ListReview = ({ name, rating, createAt, comment }) => {
  const initial = name?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className='flex gap-4 py-5 border-b border-border last:border-none'>
      <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold'>
        {initial}
      </div>

      <div className='flex min-w-0 flex-col gap-1.5'>
        <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
          <span className='text-sm font-medium'>{name}</span>
          {createAt && (
            <span className='text-xs text-muted-foreground'>{createAt}</span>
          )}
        </div>

        <Rating rating={rating} size='sm' />

        <p className='text-sm leading-relaxed text-muted-foreground'>
          {comment}
        </p>
      </div>
    </div>
  );
};

export default ListReview;
