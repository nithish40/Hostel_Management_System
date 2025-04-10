import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import Sidebar from '@/components/Sidebar';
import IssuesList from '@/components/student/IssuesList';

export default async function IssuesPage() {
  const user = await requireAuth('student');
  
  if (!user) {
    redirect('/login');
  }
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Reported Issues</h1>
          <Link href="/issues/new" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">
            Report New Issue
          </Link>
        </div>
        
        <IssuesList />
      </div>
    </div>
  );
}
