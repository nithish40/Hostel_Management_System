import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // Assuming you're using next-auth for session management
import { authOptions } from "@/lib/auth"; // Your auth configuration
import dbConnect from "@/lib/mongodb";
import Room from "@/models/room"; // Mongoose model or Prisma model

// GET /api/user/room
export async function GET(request) {
  try {
    await dbConnect(); // Ensure DB connection

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user room data from DB (replace with your logic)
    const room = await Room.findOne({ occupants: session.user.id }).exec();

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ room });
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { error: "Failed to fetch room" },
      { status: 500 }
    );
  }
}
