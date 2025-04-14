import dbConnect from "@/lib/mongodb"; // or wherever your dbConnect file is
import Room from "@/models/room";

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;
  const { roomType, available } = req.query;

  if (method === "GET") {
    try {
      const filter = {};

      if (roomType) filter.roomType = roomType;
      if (available === "true") filter.available = true;

      const rooms = await Room.find(filter);
      res.status(200).json(rooms);
    } catch (error) {
      console.error("Error loading rooms:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
