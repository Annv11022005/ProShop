import { Link, NavLink } from 'react-router-dom';
import { Button } from '../ui/button';
import { LogIn, ShoppingCart } from 'lucide-react';

const Header = () => {
  return (
    <header>
      <nav className='navbar'>
        <div className='brand'>
          <div className='mark'>
            <div className='glyph'></div>
          </div>
          <Link href='/'>ProShop</Link>
        </div>

        <div className='flex gap-3 action'>
          <NavLink to='/cart'>
            <Button size='lg'>
              <ShoppingCart /> Cart
            </Button>
          </NavLink>
          <NavLink to='/login'>
            <Button size='lg'>
              <LogIn /> Sign in
            </Button>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Header;
