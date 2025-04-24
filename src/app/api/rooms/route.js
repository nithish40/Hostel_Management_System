import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Room from "@/models/room";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const roomType = searchParams.get("roomType");

    // Initialize the query
    const query = { available: true };
    if (roomType) query.roomType = roomType;
    console.log(query);

    // Find the rooms based on the query
    const rooms = await Room.find(query);
    console.log(rooms);

    // Calculate available beds
    let totalAvailableBeds = 0;
    const roomsWithAvailability = rooms.map((room) => {
      const availableBeds = room.capacity - room.occupants.length;
      totalAvailableBeds += availableBeds; // Add to the overall available beds count
      return {
        ...room.toObject(),
        availableBeds,
      };
    });

    // Add the total available beds to the response
    const response = {
      rooms: roomsWithAvailability,
      totalAvailableBeds,
    };
    console.log(response);
    return NextResponse.json(response);
  } catch (error) {
    console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
