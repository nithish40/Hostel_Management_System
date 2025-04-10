// middleware.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const path = req.nextUrl.pathname;
  
  // Check for auth token with proper logging
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  console.log('Middleware path:', path);
  console.log('Token:', token ? 'exists' : 'null');
  if (token) console.log('User role:', token.role);

  // Define public and protected paths
  const publicPaths = ['/login', '/register', '/', '/api/auth/session'];
  const isPublicPath = publicPaths.some(pp => path === pp || path.startsWith(pp));
  
  const adminPaths = ['/admin'];
  const isAdminPath = adminPaths.some(ap => path.startsWith(ap));
  
  const studentPaths = ['/dashboard', '/menu', '/outpass', '/issues'];
  const isStudentPath = studentPaths.some(sp => path.startsWith(sp));

  // Redirect logic
  if (!token && (isStudentPath || isAdminPath)) {
    // Redirect to login if trying to access protected route without token
    console.log('Redirecting to login: No token found');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (token) {
    // If user is logged in and trying to access login/register, redirect to appropriate dashboard
    if (path === '/login' || path === '/register') {
      if (token.role === 'admin') {
        console.log('Redirecting admin from login/register to admin dashboard');
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      } else {
        console.log('Redirecting student from login/register to student dashboard');
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
    
    // If admin tries to access student routes
    if (token.role === 'admin' && isStudentPath) {
      console.log('Redirecting admin from student route to admin dashboard');
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    
    // If student tries to access admin routes
    if (token.role === 'student' && isAdminPath) {
      console.log('Redirecting student from admin route to student dashboard');
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
  };