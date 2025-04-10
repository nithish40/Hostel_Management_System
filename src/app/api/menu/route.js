import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Menu from '@/models/Menu';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const day = searchParams.get('day');
    const weekNumber = searchParams.get('weekNumber');
    
    let query = {};
    
    if (day) {
      query.day = day.toLowerCase();
    }
    
    if (weekNumber) {
      query.weekNumber = parseInt(weekNumber);
    }
    
    const menu = await Menu.find(query);
    
    return NextResponse.json(menu);
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
    
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Only admins can update menu' }, { status: 403 });
    }
    
    const data = await request.json();
    
    // Check if menu for this day and week already exists
    const existingMenu = await Menu.findOne({ 
      day: data.day.toLowerCase(),
      weekNumber: data.weekNumber
    });
    
    if (existingMenu) {
      existingMenu.meals = data.meals;
      existingMenu.updatedAt = new Date();
      await existingMenu.save();
      return NextResponse.json(existingMenu);
    }
    
    const menu = await Menu.create({
      day: data.day.toLowerCase(),
      weekNumber: data.weekNumber,
      meals: data.meals
    });
    
    return NextResponse.json(menu, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
