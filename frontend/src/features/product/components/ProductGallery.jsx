import { cn } from '@/lib/utils';

export default function ProductGallery({
  images,
  productName,
  selectedIndex,
  onSelectImage,
}) {
  return (
    <div className='lg:sticky lg:top-6'>
      <div className='flex gap-3 sm:gap-4'>
        {/* Thumbnails */}
        <div className='flex shrink-0 flex-col gap-2'>
          {images.map((image, index) => (
            <button
              key={image}
              type='button'
              onClick={() => onSelectImage(index)}
              className={cn(
                'relative size-14 overflow-hidden rounded-md border sm:size-16',
                'focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-ring',
                selectedIndex === index
                  ? 'border-foreground'
                  : 'border-border hover:border-foreground/40',
              )}
            >
              <img
                src={image}
                alt={`${productName} ${index + 1}`}
                className='absolute inset-0 h-full w-full object-cover'
              />
            </button>
          ))}
        </div>

        {/* Main image */}
        <div className='relative aspect-square flex-1 overflow-hidden rounded-md bg-muted'>
          <img
            src={images[selectedIndex]}
            alt={productName}
            className='absolute inset-0 h-full w-full object-cover'
          />
        </div>
      </div>
    </div>
  );
}
