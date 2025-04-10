// src/app/api/db-status/route.js
import { NextResponse } from 'next/server';
import { checkConnection } from '@/lib/mongodb';

export async function GET() {
  try {
    const status = await checkConnection();
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({ 
      connected: false, 
      status: 'Error', 
      error: error.message 
    }, { status: 500 });
  }
}
