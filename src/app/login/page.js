// src/app/login/page.js
'use client';

import { useSession } from 'next-auth/react';
import AuthForm from '@/components/AuthForm';
import DbStatusChecker from '@/components/DbStatusChecker';

export default function LoginPage() {
  const { status } = useSession();
  
  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="mb-4">
        {/* <DbStatusChecker /> */}
      </div>
      <AuthForm mode="login" />
    </div>
  );
}
