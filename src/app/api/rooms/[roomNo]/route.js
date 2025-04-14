import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Room from "@/models/room";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const room = await Room.findOne({ roomNo: params.roomNo }).populate(
      "users",
      "name email roomNumber hostelBlock"
    );

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(room);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
