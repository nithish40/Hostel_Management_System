"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

export default function RoomAssignmentForm() {
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, usersRes] = await Promise.all([
          axios.get("/api/rooms"),
          axios.get("/api/users"),
        ]);
        setRooms(roomsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        toast.error("Failed to load data");
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      await axios.post("/api/rooms", data);
      toast.success("Room assigned successfully");
    } catch (error) {
      toast.error(error.response?.data?.error || "Assignment failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Assign Room to User</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">User</label>
          <select
            {...register("userId", { required: true })}
            className="w-full p-2 border rounded"
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Room Number</label>
          <select
            {...register("roomNo", { required: true })}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Room</option>
            {rooms.map((room) => (
              <option key={room._id} value={room.roomNo}>
                {room.block} - {room.roomNo} ({room.sharingType})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sharing Type</label>
          <select
            {...register("sharingType", { required: true })}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Type</option>
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="triple">Triple</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Block</label>
          <input
            type="text"
            {...register("block", { required: true })}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Assign Room
        </button>
      </form>
    </div>
  );
}
