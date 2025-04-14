import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Room from "@/models/room";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request) {
  try {
    await dbConnect();
    const user = await getCurrentUser();
    const { roomId } = await request.json();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user already has a room
    const existingUser = await User.findById(user.id);
    if (existingUser.roomNo) {
      return NextResponse.json(
        { error: "You already have a room allocated" },
        { status: 400 }
      );
    }

    const room = await Room.findById(roomId);
    if (!room || !room.available) {
      return NextResponse.json(
        { error: "Room is no longer available" },
        { status: 400 }
      );
    }

    // Check capacity
    if (room.occupants.length >= room.capacity) {
      return NextResponse.json({ error: "Room is full" }, { status: 400 });
    }

    // Update Room
    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      { $addToSet: { occupants: user.id } },
      { new: true }
    ).populate("occupants", "name email");

    // Update User
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      {
        roomNo: updatedRoom.roomNo,
        block: updatedRoom.block,
        roomType: updatedRoom.roomType,
      },
      { new: true }
    );

    return NextResponse.json({
      message: "Room booked successfully",
      room: updatedRoom,
      user: updatedUser,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
