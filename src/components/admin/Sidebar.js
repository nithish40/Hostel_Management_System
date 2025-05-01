"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  FaHome,
  FaUtensils,
  FaClipboardList,
  FaTools,
  FaSignOutAlt,
} from "react-icons/fa";
import { FaBed } from "react-icons/fa";

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path ? "bg-blue-700" : "";
  };

  return (
    <div className="bg-blue-800 text-white w-64 min-h-screen flex flex-col">
      <div className="p-4 text-xl font-bold border-b border-blue-700">
        Hostel Admin Panel
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/admin/dashboard"
              className={`flex items-center p-3 rounded-md hover:bg-blue-700 ${isActive(
                "/admin/dashboard"
              )}`}
            >
              <FaHome className="mr-3" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/admin/menu"
              className={`flex items-center p-3 rounded-md hover:bg-blue-700 ${isActive(
                "/admin/menu"
              )}`}
            >
              <FaUtensils className="mr-3" />
              Manage Menu
            </Link>
          </li>
          <li>
            <Link
              href="/admin/outpass"
              className={`flex items-center p-3 rounded-md hover:bg-blue-700 ${isActive(
                "/admin/outpass"
              )}`}
            >
              <FaClipboardList className="mr-3" />
              Outpass Requests
            </Link>
          </li>
          <li>
            <Link
              href="/admin/issues"
              className={`flex items-center p-3 rounded-md hover:bg-blue-700 ${isActive(
                "/admin/issues"
              )}`}
            >
              <FaTools className="mr-3" />
              Manage Issues
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-blue-700">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center w-full p-3 rounded-md hover:bg-blue-700"
        >
          <FaSignOutAlt className="mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
