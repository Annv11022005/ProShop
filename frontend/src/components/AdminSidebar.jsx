import { logout } from '@/features/authentication/authSlice';
import { useLogout } from '@/features/authentication/hooks/useAuth';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  LogOutIcon,
  MessageCircle,
  Package,
  ShoppingCart,
  Store,
  Ticket,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';

const menuItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Product', url: '/admin/product-list', icon: Package },
  { title: 'Order', url: '/admin/order-list', icon: ShoppingCart },
  { title: 'User', url: '/admin/user-list', icon: Users },
  { title: 'Coupon', url: '/admin/coupon-list', icon: Ticket },
  { title: 'Chat', url: '/admin/chat', icon: MessageCircle },
];

export function AdminSidebar() {
  const { pathname } = useLocation();
  const { logoutUser, isPending } = useLogout();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function logoutHandler() {
    logoutUser(undefined, {
      onSuccess: () => {
        dispatch(logout());
        navigate('/login');
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Đăng xuất thất bại', {
          position: 'top-center',
        });
      },
    });
  }

  return (
    <Sidebar className='border-r border-border/80 bg-card text-card-foreground shadow-2xs'>
      <SidebarContent className='p-3 space-y-4'>
        {/* Header Branding */}
        <div className='flex items-center justify-between px-3 py-3 border-b border-border/60 mb-2'>
          <div className='flex items-center gap-3'>
            <div className='w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-xs'>
              P
            </div>
            <div>
              <h2 className='font-bold text-base tracking-tight text-foreground leading-none mb-0.5'>
                ProShop
              </h2>
              <span className='text-[11px] font-semibold text-muted-foreground uppercase tracking-wider'>
                Admin Portal
              </span>
            </div>
          </div>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => navigate('/')}
            title='Return to the store page'
            className='h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer'
          >
            <Store className='w-4.5 h-4.5' />
          </Button>
        </div>

        {/* Navigation Group */}
        <SidebarGroup className='p-0'>
          <SidebarGroupContent>
            <SidebarMenu className='gap-1.5'>
              {menuItems.map((item) => {
                const isActive =
                  item.url === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(item.url);

                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.url}>
                    <Link
                      to={item.url}
                      className={`flex items-center gap-3.5 px-4 py-3 rounded-lg text-[15px] font-medium transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground font-semibold shadow-xs translate-x-0.5'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`}
                      />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className='p-3 border-t border-border/60'>
        <SidebarMenu>
          <SidebarMenuItem>
            <button
              disabled={isPending}
              onClick={logoutHandler}
              className='w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[15px] font-semibold text-rose-600 hover:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 transition-all cursor-pointer disabled:opacity-50'
            >
              <LogOutIcon className='w-5 h-5 shrink-0' />
              <span>Log Out</span>
            </button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
