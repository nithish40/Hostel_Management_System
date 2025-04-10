import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
    try {
      await dbConnect();
      
      const data = await request.json();
      const { name, email, password, roomNumber, hostelBlock } = data;
      
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      
      if (existingUser) {
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
      }
      
      // Special condition for admin creation (for development only)
      // Use email like admin@hostel.com to create an admin
      const isAdmin = email.includes('admin@hostel.com');
      
      // Create user
      const user = await User.create({
        name,
        email,
        password,
        role: isAdmin ? 'admin' : 'student',
        roomNumber: isAdmin ? 'N/A' : roomNumber,
        hostelBlock: isAdmin ? 'N/A' : hostelBlock
      });
      
      // Don't send password in response
      const userWithoutPassword = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        roomNumber: user.roomNumber,
        hostelBlock: user.hostelBlock
      };
      
      return NextResponse.json(userWithoutPassword, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  