import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return <p className="p-4">Please login to view profile</p>;
  }

  return (
    <div className="max-w-md p-6 mx-auto mt-10 bg-white rounded shadow">
      <h2 className="mb-4 text-xl font-semibold">Profile</h2>

      {/* Avatar */}
      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-xl text-white bg-blue-500 rounded-full">
        {user.username?.charAt(0).toUpperCase()}
      </div>

      {/* User Info */}
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone}</p>

      {/* Add more fields if you have */}
    </div>
  );
}