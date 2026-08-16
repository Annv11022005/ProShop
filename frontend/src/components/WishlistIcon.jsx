import { Heart } from 'lucide-react';

const WishlistIcon = ({ isActive, onClick }) => {
  return (
    <button
      type='button'
      className='w-8 h-8 flex items-center justify-center rounded-full bg-muted-foreground/20 absolute top-3 right-3 z-10 transition-colors'
      onClick={onClick}
    >
      <Heart
        size={18}
        fill={isActive ? 'currentColor' : 'none'}
        className={isActive ? 'text-primary' : 'text-white'}
      />
    </button>
  );
};

export default WishlistIcon;
