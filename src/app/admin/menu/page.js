import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import AdminSidebar from '@/components/admin/Sidebar';
import MenuEditor from '@/components/admin/MenuEditor';

export default async function AdminMenuPage() {
  const user = await requireAuth('admin');
  
  if (!user) {
    redirect('/login');
  }
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Food Menu Management</h1>
        <MenuEditor />
      </div>
    </div>
  );
}
