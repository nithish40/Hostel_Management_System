import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import AdminSidebar from '@/components/admin/Sidebar';

export default async function AdminDashboardPage() {
  const user = await requireAuth('admin');
  
  if (!user) {
    redirect('/login');
  }
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h2 className="text-xl font-semibold mb-2">Outpass Requests</h2>
            <p className="text-gray-600 mb-4">Manage student outpass requests</p>
            <a href="/admin/outpass" className="text-blue-500 hover:text-blue-700">View Requests &rarr;</a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <h2 className="text-xl font-semibold mb-2">Issue Management</h2>
            <p className="text-gray-600 mb-4">Handle reported maintenance issues</p>
            <a href="/admin/issues" className="text-green-500 hover:text-green-700">View Issues &rarr;</a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <h2 className="text-xl font-semibold mb-2">Food Menu</h2>
            <p className="text-gray-600 mb-4">Update and manage hostel food menu</p>
            <a href="/admin/menu" className="text-purple-500 hover:text-purple-700">Manage Menu &rarr;</a>
          </div>
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-md">
              <h3 className="text-lg font-medium text-blue-700">Pending Outpass</h3>
              <p className="text-3xl font-bold">--</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-md">
              <h3 className="text-lg font-medium text-yellow-700">Open Issues</h3>
              <p className="text-3xl font-bold">--</p>
            </div>
            <div className="p-4 bg-green-50 rounded-md">
              <h3 className="text-lg font-medium text-green-700">Resolved Issues</h3>
              <p className="text-3xl font-bold">--</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
