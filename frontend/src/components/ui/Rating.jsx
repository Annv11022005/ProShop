import { Star, StarHalf } from 'lucide-react';

const Rating = ({ value, text }) => {
  return (
    <div className='rating'>
      <span>
        {value >= 1 ? (
          <Star className='fill-yellow-400' />
        ) : value >= 0.5 ? (
          <StarHalf />
        ) : (
          <Star />
        )}
      </span>
      <span>
        {value >= 2 ? (
          <Star className='fill-yellow-400' />
        ) : value >= 1.5 ? (
          <StarHalf className='fill-yellow-400' />
        ) : (
          <Star />
        )}
      </span>
      <span>
        {value >= 3 ? (
          <Star className='fill-yellow-400' />
        ) : value >= 2.5 ? (
          <StarHalf className='fill-yellow-400' />
        ) : (
          <Star />
        )}
      </span>
      <span>
        {value >= 4 ? (
          <Star className='fill-yellow-400' />
        ) : value >= 3.5 ? (
          <StarHalf className='fill-yellow-400' />
        ) : (
          <Star />
        )}
      </span>
      <span>
        {value >= 5 ? (
          <Star className='fill-yellow-400' />
        ) : value >= 4.5 ? (
          <StarHalf className='fill-yellow-400' />
        ) : (
          <Star />
        )}
      </span>

      <span className='rating-text'>{text && text}</span>
    </div>
  );
};

export default Rating;
