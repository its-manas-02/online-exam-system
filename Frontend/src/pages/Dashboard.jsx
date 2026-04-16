import React from "react";

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
      <div className="flex-1 min-h-screen p-6 bg-gray-100">
        {/* {user?.role === "student" && ( */}
          <div className="max-w-5xl p-6 mx-auto bg-white shadow-lg rounded-xl">
            
            <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Test Topics</h2>

            <div className="p-4 transition border rounded-lg">
              <h2>gkfwkfkw</h2>
              <h1>jbhnjj</h1>
            </div>
          </div>
         {/* )} */}
        
      </div>
    </div>
  ); 

}
