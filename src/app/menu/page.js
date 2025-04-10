import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import Sidebar from '@/components/Sidebar';
import MenuView from '@/components/student/MenuView';

export default async function MenuPage() {
  const user = await requireAuth('student');
  
  if (!user) {
    redirect('/login');
  }
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-8">
        {/* <h1 className="text-2xl font-bold mb-6">Food Menu</h1> */}
        <MenuView />
      </div>
      
    </div>
  );
}
