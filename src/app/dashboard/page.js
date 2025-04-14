import Link from "next/link";
import { getServerSession } from "next-auth/next";
import Sidebar from "@/components/Sidebar";
import mongoose from "mongoose";
import User from "@/models/User";
import { authOptions } from "@/lib/auth"; // Adjust path if needed
import dbConnect from "@/lib/mongodb"; // Custom helper (recommended)

export default async function DashboardPage() {
  // Ensure DB is connected
  await dbConnect();

  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  let userData = null;

  if (email) {
    try {
      userData = await User.findOne({ email }).lean();
    } catch (error) {
      console.error("Failed to fetch user from DB:", error);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">
          Welcome, {userData?.name || "Student"}!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/outpass/new"
                className="block bg-blue-500 hover:bg-blue-600 text-white text-center py-2 px-4 rounded-md"
              >
                Request Outpass
              </Link>
              <Link
                href="/issues/new"
                className="block bg-green-500 hover:bg-green-600 text-white text-center py-2 px-4 rounded-md"
              >
                Report an Issue
              </Link>
              <Link
                href="/menu"
                className="block bg-purple-500 hover:bg-purple-600 text-white text-center py-2 px-4 rounded-md"
              >
                View Food Menu
              </Link>
            </div>
          </div>

          {/* User Information */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-black text-xl font-semibold mb-4">
              Your Information
            </h2>
            <div className="text-black space-y-2">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {userData?.name || "N/A"}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {userData?.email || "N/A"}
              </p>
              <p>
                <span className="font-medium">Room:</span>{" "}
                {userData?.hostelBlock || "N/A"}-{userData?.roomNumber || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
