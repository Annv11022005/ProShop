import { Outlet } from 'react-router-dom';
import {
  SidebarProvider,
  //   SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';

export default function AppLayoutAdmin() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        {/* <header className='flex h-14 items-center gap-2 border-b px-4'>
          <SidebarTrigger />
        </header> */}
        <div className='p-4'>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
