// import mongoose from "mongoose";

// const RoomSchema = new mongoose.Schema({
//   roomNo: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   block: {
//     type: String,
//     required: true,
//   },
//   roomType: {
//     type: String,
//     enum: ["AC", "Non-AC", "Deluxe"],
//     required: true,
//   },
//   capacity: {
//     type: Number,
//     required: true,
//   },
//   occupants: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//   ],
//   available: {
//     type: Boolean,
//     default: true,
//   },
// });

// // Update availability before saving
// RoomSchema.pre("save", function (next) {
//   this.available = this.occupants.length < this.capacity;
//   next();
// });

// export default mongoose.models.Room || mongoose.model("Room", RoomSchema);

const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  roomType: {
    type: String,
    enum: ["AC Room", "Non-AC Room", "Deluxe Room"],
    required: true,
  },
  block: { type: String, required: true },
  capacity: { type: Number, required: true },
  available: { type: Boolean, default: true },
  occupants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.models.Room || mongoose.model("Room", roomSchema);
