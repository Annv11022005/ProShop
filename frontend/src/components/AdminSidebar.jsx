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
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  LogOutIcon,
  MessageCircle,
  MoveLeft,
  Package,
  ShoppingCart,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';

const menuItems = [
  { title: 'Product', url: '/admin/product-list', icon: Package },
  { title: 'Order', url: '/admin/order-list', icon: ShoppingCart },
  { title: 'User', url: '/admin/user-list', icon: Users },
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
        toast(err.response?.data?.message, { position: 'top-center' });
      },
    });
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className='text-xl text-primary uppercase w-full flex items-center gap-10 mb-10'>
            <Button size='sm' onClick={() => navigate('/')}>
              <MoveLeft />
            </Button>
            Admin
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    render={
                      <Link
                        to={item.url}
                        className='flex items-center gap-5 w-[75%] mx-auto'
                      />
                    }
                    isActive={pathname === item.url}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              disabled={isPending}
              onClick={logoutHandler}
              className='p-2 flex items-center gap-4 text-red-500'
            >
              <LogOutIcon />
              Log out
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
