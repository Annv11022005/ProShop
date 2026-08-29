import { Outlet } from 'react-router-dom';
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';

export default function AppLayoutAdmin() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className='flex h-14 items-center gap-3 border-b border-border px-4'>
          <SidebarTrigger aria-label='Toggle sidebar' />
          <span className='font-semibold text-sm text-foreground'>
            Admin Dashboard
          </span>
        </header>
        <div className='p-4'>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
