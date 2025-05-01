import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/db";
import Student from "@/models/studentModel"; // Adjust if it's `User`
import Room from "@/models/roomModel"; // Room model import
import dbConnect from "@/lib/mongodb";

export async function PUT(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const { studentId, roomNumber, hostelBlock } = body;

    // Ensure all required fields are provided
    if (!studentId || !roomNumber || !hostelBlock) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Find the room based on roomNumber and hostelBlock
    const room = await Room.findOne({ roomNumber, hostelBlock });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Check if the room is available
    if (room.occupied >= room.capacity) {
      return NextResponse.json(
        { error: "Room is fully occupied" },
        { status: 400 }
      );
    }

    // Assign the room to the student
    const student = await Student.findByIdAndUpdate(
      studentId,
      {
        roomNumber,
        hostelBlock,
      },
      { new: true }
    );

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Update the room occupancy count
    await Room.findByIdAndUpdate(room._id, { $inc: { occupied: 1 } });

    return NextResponse.json({
      message: "Room assigned successfully",
      student,
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
