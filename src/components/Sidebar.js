'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { FaHome, FaUtensils, FaClipboardList, FaTools, FaSignOutAlt } from 'react-icons/fa';

export default function Sidebar() {
  const pathname = usePathname();
  
  const isActive = (path) => {
    return pathname === path ? 'bg-blue-700' : '';
  };
  
  return (
    <div className="bg-blue-800 text-white w-64 min-h-screen flex flex-col">
      <div className="p-4 text-xl font-bold border-b border-blue-700">
        Hostel Management
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard" className={`flex items-center p-3 rounded-md hover:bg-blue-700 ${isActive('/dashboard')}`}>
              <FaHome className="mr-3" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/menu" className={`flex items-center p-3 rounded-md hover:bg-blue-700 ${isActive('/menu')}`}>
              <FaUtensils className="mr-3" />
              Food Menu
            </Link>
          </li>
          <li>
            <Link href="/outpass" className={`flex items-center p-3 rounded-md hover:bg-blue-700 ${isActive('/outpass')}`}>
              <FaClipboardList className="mr-3" />
              Outpass
            </Link>
          </li>
          <li>
            <Link href="/issues" className={`flex items-center p-3 rounded-md hover:bg-blue-700 ${isActive('/issues')}`}>
              <FaTools className="mr-3" />
              Issues
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 border-t border-blue-700">
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center w-full p-3 rounded-md hover:bg-blue-700"
        >
          <FaSignOutAlt className="mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
