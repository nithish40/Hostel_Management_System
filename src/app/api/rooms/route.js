import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Room from "@/models/room";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const roomType = searchParams.get("roomType");

    const query = { available: true };
    if (roomType) query.roomType = roomType;

    const rooms = await Room.find(query)
      .populate("occupants", "name email")
      .lean();

    // Add available beds count
    const roomsWithAvailability = rooms.map((room) => ({
      ...room,
      availableBeds: room.capacity - room.occupants.length,
    }));

    return NextResponse.json(roomsWithAvailability);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
