import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import SessionProvider from '@/components/SessionProvider';
import Header from '@/components/Header';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Hostel Management System',
  description: 'A comprehensive hostel management system for students and administrators',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Header />
          <main>{children}</main>
          <ToastContainer position="top-right" autoClose={3000} />
        </SessionProvider>
      </body>
    </html>
  );
}
