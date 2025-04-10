import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-6">
            Welcome to Hostel Management System
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            A comprehensive platform for managing hostel activities, outpass requests, issue reporting, and meal planning.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md">
              Login
            </Link>
            <Link href="/register" className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 font-medium py-3 px-6 rounded-md">
              Register
            </Link>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Outpass Management</h2>
            <p className="text-gray-600">
              Request and track outpass permissions with ease. Get real-time updates on approval status.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Issue Reporting</h2>
            <p className="text-gray-600">
              Report maintenance issues in your room and track their resolution status.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Food Menu</h2>
            <p className="text-gray-600">
              View the weekly food menu and stay updated with meal schedules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
