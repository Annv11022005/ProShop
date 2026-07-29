import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/features/authentication/authSlice';
import { useLogout } from '@/features/authentication/hooks/useAuth';

import { Button } from './ui/button';
import { LogIn, LogOutIcon, ShoppingCart, UserIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from 'sonner';
import Search from './Search';

const Header = () => {
  const { logoutUser, isPending } = useLogout();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function logoutHandler() {
    logoutUser(undefined, {
      onSuccess: () => {
        dispatch(logout());
        navigate('/login');
      },
      onError: (err) => {
        toast(err.response?.data?.message, { position: 'top-center' });
      },
    });
  }

  return (
    <header>
      <nav className='navbar'>
        <div className='brand'>
          <div className='mark'>
            <div className='glyph'></div>
          </div>
          <Link to='/'>ProShop</Link>
        </div>

        <div>
          <Search />
        </div>

        <div className='flex gap-3 action'>
          <NavLink to='/cart'>
            <Button size='lg' className=' relative'>
              <ShoppingCart /> Cart
              {userInfo && cartItems.length > 0 && (
                <span className='buble'>{cartItems.length}</span>
              )}
            </Button>
          </NavLink>
          {userInfo && !userInfo.isAdmin ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant='outline' size='lg'>
                    {userInfo.name}
                  </Button>
                }
              />
              <DropdownMenuContent>
                <Link to='/profile'>
                  <DropdownMenuItem>
                    <UserIcon />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant='destructive'
                  disabled={isPending}
                  onClick={logoutHandler}
                >
                  <LogOutIcon />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : userInfo && userInfo.isAdmin ? (
            <Button
              variant='outline'
              onClick={() => navigate('/admin/product-list')}
              size='lg'
            >
              {userInfo.name}
            </Button>
          ) : (
            <NavLink to='/login'>
              <Button size='lg'>
                <LogIn /> Sign in
              </Button>
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
