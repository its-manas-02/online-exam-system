import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
    
  return (
    <div className="flex min-h-screen bg-gray-100">
      {user?.role === "admin" && (
        <div className="w-64 p-5 text-white bg-gray-900">
          <h2 className="mb-6 text-xl font-bold">My App</h2>

          <ul className="space-y-3">
            <li className="cursor-pointer hover:text-gray-300">Dashboard</li>
            <li className="cursor-pointer hover:text-gray-300">Users</li>
            <li className="cursor-pointer hover:text-gray-300">Settings</li>
          </ul>
        </div>
      )}

      {/* Main */}
      <div className="flex-1">
        {user?.role !== "admin" && (
        <div className="flex items-start justify-start bg-gray-300">
          <Link 
          className="px-4 text-black transition duration-200 rounded cursor-pointer hover:text-sky-700 hover:border hover:border-black hover:shadow-md hover:-translate-x-0.5"
          to="/dashboard"
          >Dashboard</Link>
          <Link
          className="px-4 text-black transition duration-200 rounded cursor-pointer hover:text-sky-700 hover:border hover:border-black hover:shadow-md hover:-translate-x-0.5"
          to="/results"
          >Results</Link>
          {/* {user?.role === "teacher" && ( */}
            <Link 
            className="px-4 text-black transition duration-200 rounded cursor-pointer hover:text-sky-700 hover:border hover:border-black hover:shadow-md hover:-translate-x-0.5"
            to="/add-quiz"
            >Add Quiz</Link>
           {/* )} */}
        </div>
        )}

        {/* Top Navbar */}
        <div className="flex items-center justify-between p-4 bg-white shadow">
          <h1 className="text-lg font-semibold">Dashboard</h1>

          <div className="flex items-center gap-4">
            <span>{user.username}</span>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
              }}
              className="px-3 py-1 text-white bg-red-500 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">

          {/* Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            
            <div className="p-5 bg-white rounded shadow">
              <h3 className="text-gray-500">Users</h3>
              <p className="text-2xl font-bold">120</p>
            </div>

            <div className="p-5 bg-white rounded shadow">
              <h3 className="text-gray-500">Orders</h3>
              <p className="text-2xl font-bold">75</p>
            </div>

            <div className="p-5 bg-white rounded shadow">
              <h3 className="text-gray-500">Revenue</h3>
              <p className="text-2xl font-bold">₹12,500</p>
            </div>

          </div>

          {/* Extra Section */}
          <div className="p-5 mt-6 bg-white rounded shadow">
            <h2 className="mb-2 text-lg font-semibold">Welcome</h2>
            <p>This is your dashboard. You are successfully logged in.</p>
          </div>

        </div>
      </div>
    </div>
  ); 

}
