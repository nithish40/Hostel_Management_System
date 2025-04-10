import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import Sidebar from '@/components/Sidebar';
import IssueForm from '@/components/student/IssueForm';

export default async function NewIssuePage() {
  const user = await requireAuth('student');
  
  if (!user) {
    redirect('/login');
  }
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="flex items-center mb-6">
          <Link href="/issues" className="text-blue-500 hover:text-blue-700 mr-4">
            &larr; Back to Issues
          </Link>
          <h1 className="text-2xl font-bold">Report New Issue</h1>
        </div>
        
        <IssueForm />
      </div>
    </div>
  );
}
