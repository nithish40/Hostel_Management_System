'use client';

import { useSession } from 'next-auth/react';
import AuthForm from '@/components/AuthForm';

export default function RegisterPage() {
  const { status } = useSession();
  
  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  // Middleware will handle redirects if user is already authenticated
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 py-8">
      <AuthForm mode="register" />
    </div>
  );
}
