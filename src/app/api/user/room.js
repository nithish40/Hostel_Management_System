// // pages/api/user/room.js
// import { getServerSession } from "next-auth/next";
// import dbConnect from "@/lib/db";
// import User from "@/models/User";
// import Room from "@/models/room";
// import { authOptions } from "../auth/[...nextauth]";

// export default async function handler(req, res) {
//   const session = await getServerSession(req, res, authOptions);

//   if (!session) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }

//   await dbConnect();

//   const user = await User.findOne({ email: session.user.email }).populate(
//     "room"
//   );

//   if (!user || !user.room) {
//     return res.status(200).json({ room: null });
//   }

//   return res.status(200).json({ room: user.room });
// }
