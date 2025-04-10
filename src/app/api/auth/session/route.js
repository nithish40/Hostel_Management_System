import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

export async function GET() {
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.json({ user: null });
  }
  // console.log(session);
  return NextResponse.json({ user: session.user });
}
