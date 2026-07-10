import { Button } from '../ui/button';
import { LogIn, ShoppingCart } from 'lucide-react';

const Header = () => {
  return (
    <header>
      <nav className='navbar'>
        <div className='brand'>
          <a href='/' className='text-white'>
            ProShop
          </a>
        </div>

        <div className='flex gap-3 action'>
          <Button size='lg'>
            <ShoppingCart /> Cart
          </Button>
          <Button size='lg'>
            <LogIn /> Sign in
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
