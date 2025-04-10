import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function getSession() {
  const getServer=await getServerSession();
  // console.log(getServer,"boaz");
  return getServer;
}

export async function getCurrentUser() {
  const session = await getSession();
  // if (!session?.user) {
  //   return null;
  // }
  console.log("this is auth page");
  let user;
  try{
    // await dbConnect();
    console.log("this is try",session.user);
     user = await User.findOne({ email: session.user.email});
     console.log("after try")
    console.log(user,"in auth");
    
  }
  catch{

  }
  // console.log(session);
  if(user)
    return user;
  else
  return session.user;
  
  // return session.user;
}

export async function requireAuth(role = null) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  console.log(user);
  // if (role && user.role !== role) {
  //   if (user.role === 'admin') {
  //     redirect('/admin/dashboard');
  //   } else {
  //     redirect('/dashboard');
  //   }
  // }
  
  return user;
}
