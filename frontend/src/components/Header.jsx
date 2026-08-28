import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/features/authentication/authSlice';
import { useLogout } from '@/features/authentication/hooks/useAuth';
import { cn } from '@/lib/utils';

import { Button, buttonVariants } from './ui/button';
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
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const { logoutUser, isPending } = useLogout();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const avatar = userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : '';

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
        <Link to='/' className='brand'>
          <div className='mark'>
            <div className='glyph'></div>
          </div>
          <span>ProShop</span>
        </Link>

        <div>
          <Search />
        </div>

        <div className='flex items-center gap-3 action'>
          <ThemeToggle />

          <Link
            to='/cart'
            className={cn(buttonVariants({ size: 'lg' }), 'relative')}
          >
            <ShoppingCart /> Cart
            {userInfo && cartItems.length > 0 && (
              <span className='buble'>{cartItems.length}</span>
            )}
          </Link>

          {userInfo && <NotificationDropdown />}

          {userInfo && !userInfo.isAdmin ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant='outline'
                    size='lg'
                    aria-label='Open user menu'
                    className='rounded-full w-9 h-9'
                  >
                    {avatar}
                  </Button>
                }
              />
              <DropdownMenuContent>
                <DropdownMenuItem render={<Link to='/profile' />}>
                  <UserIcon />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem render={<Link to='/coupon' />}>
                  <TicketPercent />
                  Coupon
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
          ) : userInfo && userInfo.isAdmin ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant='outline'
                    size='lg'
                    aria-label='Open admin menu'
                    className='rounded-full w-9 h-9'
                  >
                    {avatar}
                  </Button>
                }
              />
              <DropdownMenuContent>
                <DropdownMenuItem render={<Link to='/admin' />}>
                  <Store />
                  Manager
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
            <Link to='/login' className={buttonVariants({ size: 'lg' })}>
              <LogIn /> Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
