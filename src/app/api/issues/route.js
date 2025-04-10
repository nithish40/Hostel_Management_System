import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Issue from '@/models/Issue';
import { getCurrentUser } from '@/lib/auth';
import User from '@/models/User';

export async function GET(request) {
  try {
    await dbConnect();
    const user = await getCurrentUser();
    console.log("after get")
    // console.log(user);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // const { searchParams } = new URL(request.url);
    // const id = searchParams.get('id');
    
    // if (id) {
    //   const issue = await Issue.findById(id).populate('User', 'name email roomNumber hostelBlock');
      
    //   if (!issue) {
    //     return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    //   }
    //   if (user.role !== 'admin' && issue.student._id.toString() !== user.id) {
    //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    //   }
      
    //   return NextResponse.json(issue);
    // }
    
    let issues;
    console.log("before if ")
    if (user.role === 'admin') {
      issues = await Issue.find().sort({ createdAt: -1 });
    } else {
      issues = await Issue.find({ student: user.name }).sort({ createdAt: -1 });
    }
    console.log("gfj", issues);
    return NextResponse.json(issues);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const user = await getCurrentUser();
    console.log(user.role);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // if (user.role !== 'student') {
    //   return NextResponse.json({ error: 'Only students can report issues' }, { status: 403 });
    // }
    
    const data = await request.json();
    console.log(data);
    const issue = await Issue.create({
      student: user.name,
      title: data.title,
      description: data.description,
      category: data.category,
    });
    console.log(issue);
    
    return NextResponse.json(issue, { status: 201 });
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
      return NextResponse.json({ error: 'Only admins can update issue status' }, { status: 403 });
    }
    
    const data = await request.json();
    const { id, status, adminRemarks } = data;
    
    const issue = await Issue.findById(id);
    
    if (!issue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }
    
    issue.status = status;
    issue.adminRemarks = adminRemarks || '';
    
    await issue.save();
    
    return NextResponse.json(issue);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
