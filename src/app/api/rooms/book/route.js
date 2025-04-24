import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Room from "@/models/room";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request) {
  try {
    await dbConnect();
    console.log("hi this is boaz");

    const user = await getCurrentUser();
    const { roomId } = await request.json();
    console.log("the below is roomid");
    console.log(roomId);

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
    console.log(room.occupants.length);
    // Check capacity
    if (room.occupants.length >= room.capacity) {
      return NextResponse.json({ error: "Room is full" }, { status: 400 });
    }

    // Update Room
    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      { $addToSet: { occupants: user.id } },
      { new: true }
    );

    // Check if the room is updated correctly
    if (!updatedRoom) {
      return NextResponse.json(
        { error: "Room update failed" },
        { status: 500 }
      );
    }
    // Update User
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      {
        roomNumber: updatedRoom.toObject().roomNumber, // Ensure roomNo exists in Room model

        hostelBlock: updatedRoom.block, // Ensure block exists in Room model
        roomType: updatedRoom.toObject().roomType, // Ensure roomType exists in Room model
      },
      { new: true }
    );

    // Check if user update is successful
    if (!updatedUser) {
      return NextResponse.json(
        { error: "User update failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Room booked successfully",
      room: updatedRoom,
      user: updatedUser,
    });
  } catch (error) {
    console.error(error); // Log error to console for better debugging
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
