import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/features/authentication/authSlice';
import { useLogout } from '@/features/authentication/hooks/useAuth';

import { Button } from './ui/button';
import {
  LogIn,
  LogOutIcon,
  ShoppingCart,
  Store,
  TicketPercent,
  UserIcon,
} from 'lucide-react';
import Search from './Search';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

import NotificationDropdown from '@/features/authentication/components/NotificationDropdown';

const Header = () => {
  const { logoutUser, isPending } = useLogout();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const avatar = userInfo?.name.charAt(0).toUpperCase();

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

        <div className='flex items-center gap-3 action'>
          <Link to='/cart'>
            <Button size='lg' className=' relative'>
              <ShoppingCart /> Cart
              {userInfo && cartItems.length > 0 && (
                <span className='buble'>{cartItems.length}</span>
              )}
            </Button>
          </Link>

          {userInfo && <NotificationDropdown />}

          {userInfo && !userInfo.isAdmin ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant='outline'
                    size='lg'
                    className='rounded-full w-9 h-9'
                  >
                    {avatar}
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

                <Link to='/coupon'>
                  <DropdownMenuItem>
                    <TicketPercent />
                    Coupon
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
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant='outline'
                    size='lg'
                    className='rounded-full w-9 h-9'
                  >
                    {avatar}
                  </Button>
                }
              />
              <DropdownMenuContent>
                <Link to='/admin'>
                  <DropdownMenuItem>
                    <Store />
                    Manager
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
          ) : (
            <Link to='/login'>
              <Button size='lg'>
                <LogIn /> Sign in
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
