import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import AdminSidebar from '@/components/admin/Sidebar';
import AdminIssuesList from '@/components/admin/IssuesList';

export default async function AdminIssuesPage() {
  const user = await requireAuth('admin');
  
  if (!user) {
    redirect('/login');
  }
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Issue Management</h1>
        <AdminIssuesList />
      </div>
    </div>
  );
}
