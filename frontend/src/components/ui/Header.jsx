import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Button } from '../ui/button';
import { LogIn, ShoppingCart } from 'lucide-react';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);

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
            <Button size='lg' className=' relative'>
              <ShoppingCart /> Cart
              {cartItems.length > 0 && (
                <span className='buble'>{cartItems.length}</span>
              )}
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
