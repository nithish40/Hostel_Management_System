"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

export default function RoomBooking() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRoom, setUserRoom] = useState(null);
  const [totalAvailableBeds, setTotalAvailableBeds] = useState(0); // Track total available beds
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const roomType = watch("roomType");

  // Fetch available rooms when roomType changes
  useEffect(() => {
    if (!roomType || userRoom) return;

    const fetchRooms = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/rooms", {
          params: { roomType, available: true },
        });
        const fetchedRooms = response.data.rooms;
        // Calculate total available beds across all rooms
        const availableBeds = fetchedRooms.reduce((acc, room) => {
          return acc + (room.capacity - room.occupants.length);
        }, 0);

        setRooms(fetchedRooms);
        setTotalAvailableBeds(availableBeds);
        console.log(rooms);
      } catch (error) {
        toast.error("Failed to load rooms");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [roomType, userRoom]);
  const onSubmit = async (data) => {
    if (userRoom) return; // Prevent booking if already booked

    try {
      await axios.post("/api/rooms/book", {
        roomId: data.roomId,
      });

      toast.success("Room booked successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.error || "Booking failed");
    }
  };

  return (
    <div className="text-black max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Hostel Room Booking</h1>

      {userRoom ? (
        <div className="space-y-3 text-black">
          <h2 className="text-lg font-semibold text-green-600">
            You have already booked a room:
          </h2>
          <p>
            <strong>Block:</strong> {userRoom.block}
          </p>
          <p>
            <strong>Room Number:</strong> {userRoom.roomNo}
          </p>
          <p>
            <strong>Room Type:</strong> {userRoom.roomType}
          </p>
          <p>
            <strong>Occupants:</strong> {userRoom.occupants.length} /{" "}
            {userRoom.capacity}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Room Type</label>
            <select
              {...register("roomType", { required: true })}
              className="w-full p-2 border rounded"
              disabled={userRoom}
              defaultValue=""
            >
              <option value="">Select Room Type</option>
              <option value="AC Room">AC Room</option>
              <option value="Non-AC Room">Non-AC Room</option>
              <option value="Delux Room">Deluxe Room</option>
            </select>
            {errors.roomType && (
              <p className="text-red-500 text-sm">Room type is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Available Rooms
            </label>
            {loading ? (
              <p>Loading available rooms...</p>
            ) : rooms.length > 0 ? (
              <select
                {...register("roomId", { required: true })}
                className="w-full p-2 border rounded"
                disabled={userRoom}
              >
                {rooms.map((room) => (
                  <option
                    key={room._id}
                    value={room._id}
                    disabled={room.occupants.length >= room.capacity}
                  >
                    {room.block} - {room.roomNumber} ({room.roomType}) -{" "}
                    {room.capacity - room.occupants.length} beds left
                  </option>
                ))}
              </select>
            ) : (
              <p>No rooms available for selected type</p>
            )}
            {errors.roomId && (
              <p className="text-red-500 text-sm">Please select a room</p>
            )}
          </div>

          <div className="text-sm text-gray-600 mt-2">
            <strong>Total Available Beds: </strong>
            {totalAvailableBeds}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={loading || rooms.length === 0 || userRoom}
          >
            {loading ? "Processing..." : "Book Room"}
          </button>
        </form>
      )}
    </div>
  );
}
