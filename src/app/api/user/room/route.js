import { NextResponse } from "next/server";

// Dummy data - replace this with your DB logic
const mockUserRoom = {
  block: "A",
  roomNo: "101",
  roomType: "AC Room",
  occupants: ["user1", "user2"],
  capacity: 3,
};

// GET /api/user/room
export async function GET(request) {
  try {
    // In real app, get the user session (auth) and fetch their room from DB
    // const session = await getServerSession(authOptions);
    // const room = await Room.findOne({ occupants: session.user.id });

    // Just mock response for now
    return NextResponse.json({ room: mockUserRoom });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch room" },
      { status: 500 }
    );
  }
}
