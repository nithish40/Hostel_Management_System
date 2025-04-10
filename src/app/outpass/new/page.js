import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import Sidebar from '@/components/Sidebar';
import OutpassList from '@/components/student/OutpassForm';

export default async function OutpassPage() {
  const session = await getServerSession();
  console.log(session);
  // Middleware should handle this, but adding as a fallback
  if (!session?.user) {
    redirect('/login');
  }
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Outpass Requests</h1>
          <Link href="/outpass/new" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">
            New Request
          </Link>
        </div>
        
        <OutpassList />
      </div>
    </div>
  );
}
