import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/features/Authentication/authSlice';
import { useLogout } from '@/hooks/useAuth';

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

        <div className='flex gap-3 action'>
          <NavLink to='/cart'>
            <Button size='lg' className=' relative'>
              <ShoppingCart /> Cart
              {userInfo && cartItems.length > 0 && (
                <span className='buble'>{cartItems.length}</span>
              )}
            </Button>
          </NavLink>
          {userInfo ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant='outline' size='lg'>
                    {userInfo.name}
                  </Button>
                }
              />
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <UserIcon />
                  Profile
                </DropdownMenuItem>
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
