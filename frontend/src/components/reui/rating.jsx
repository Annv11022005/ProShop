import { useState } from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { StarIcon } from 'lucide-react';

const ratingVariants = cva('flex items-center', {
  variants: {
    size: {
      sm: 'gap-1.5',
      default: 'gap-2',
      lg: 'gap-2.5',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const starVariants = cva('', {
  variants: {
    size: {
      sm: 'w-4 h-4',
      default: 'w-5 h-5',
      lg: 'w-6 h-6',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const valueVariants = cva('text-muted-foreground w-5', {
  variants: {
    size: {
      sm: 'text-xs',
      default: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

function Rating({
  rating = 0,
  maxRating = 5,
  size,
  className,
  starClassName,
  showValue = false,
  editable = false,
  onRatingChange,
  ...props
}) {
  const [hoveredRating, setHoveredRating] = useState(null);
  const displayRating =
    editable && hoveredRating !== null ? hoveredRating : rating;

  const handleStarClick = (starRating) => {
    if (editable && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleKeyDown = (e, starRating) => {
    if (!editable) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleStarClick(starRating);
    }
  };

  const handleStarMouseEnter = (starRating) => {
    if (editable) {
      setHoveredRating(starRating);
    }
  };

  const handleStarMouseLeave = () => {
    if (editable) {
      setHoveredRating(null);
    }
  };

  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= maxRating; i++) {
      const filled = displayRating >= i;
      const partiallyFilled = displayRating > i - 1 && displayRating < i;
      const fillPercentage = partiallyFilled
        ? (displayRating - (i - 1)) * 100
        : 0;

      const starContent = (
        <>
          {/* Background star (empty) */}
          <StarIcon
            data-slot='rating-star-empty'
            className={cn(starVariants({ size }), 'text-muted-foreground/30')}
          />

          {/* Filled star */}
          <div
            className='absolute inset-0 overflow-hidden'
            style={{
              width: filled ? '100%' : `${fillPercentage}%`,
            }}
          >
            <StarIcon
              data-slot='rating-star-filled'
              className={cn(
                starVariants({ size }),
                'fill-yellow-400 text-yellow-400',
              )}
            />
          </div>
        </>
      );

      if (editable) {
        stars.push(
          <button
            key={i}
            type='button'
            role='radio'
            aria-checked={Math.round(displayRating) === i}
            aria-label={`Rate ${i} of ${maxRating} stars`}
            className={cn(
              'relative cursor-pointer p-0.5 rounded-xs transition-transform hover:scale-110 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
            )}
            onClick={() => handleStarClick(i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onMouseEnter={() => handleStarMouseEnter(i)}
            onMouseLeave={handleStarMouseLeave}
          >
            {starContent}
          </button>,
        );
      } else {
        stars.push(
          <div key={i} className='relative'>
            {starContent}
          </div>,
        );
      }
    }

    return stars;
  };

  return (
    <div
      data-slot='rating'
      role={editable ? 'radiogroup' : 'img'}
      aria-label={
        editable
          ? 'Product rating selection'
          : `Rating: ${displayRating} of ${maxRating} stars`
      }
      className={cn(ratingVariants({ size }), className)}
      {...props}
    >
      <div className='flex items-center gap-0.5'>{renderStars()}</div>
      {showValue && (
        <span
          data-slot='rating-value'
          className={cn(valueVariants({ size }), starClassName)}
        >
          {displayRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export { Rating };