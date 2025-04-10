import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Outpass from '@/models/Outpass';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request) {
  try {
    await dbConnect();
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      const outpass = await Outpass.findById(id).populate('student', 'name email roomNumber hostelBlock');
      
      if (!outpass) {
        return NextResponse.json({ error: 'Outpass not found' }, { status: 404 });
      }
      
      if (user.role !== 'admin' && outpass.student._id.toString() !== user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      return NextResponse.json(outpass);
    }
    
    let outpasses;
    
    if (user.role === 'admin') {
      outpasses = await Outpass.find().sort({ createdAt: -1 }).populate('student', 'name email roomNumber hostelBlock');
    } else {
      outpasses = await Outpass.find({ student: user.id }).sort({ createdAt: -1 });
    }
    
    return NextResponse.json(outpasses);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (user.role !== 'student') {
      return NextResponse.json({ error: 'Only students can create outpass requests' }, { status: 403 });
    }
    
    const data = await request.json();
    
    const outpass = await Outpass.create({
      student: user.id,
      reason: data.reason,
      destination: data.destination,
      departureDate: data.departureDate,
      returnDate: data.returnDate,
    });
    
    return NextResponse.json(outpass, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Only admins can update outpass status' }, { status: 403 });
    }
    
    const data = await request.json();
    const { id, status, adminRemarks } = data;
    
    const outpass = await Outpass.findById(id);
    
    if (!outpass) {
      return NextResponse.json({ error: 'Outpass not found' }, { status: 404 });
    }
    
    outpass.status = status;
    outpass.adminRemarks = adminRemarks || '';
    
    await outpass.save();
    
    return NextResponse.json(outpass);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
