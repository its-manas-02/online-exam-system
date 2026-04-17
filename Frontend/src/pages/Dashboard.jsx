import React from "react";
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const [topics, setTopics] = React.useState([]);
  const navigate = useNavigate();
  React.useEffect(() => {
    fetch("http://localhost:5000/api/topics")
      .then(res => res.json())
      .then(data => setTopics(data))
      .catch(err => console.error(err));
  }, []);
    
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
            
            <div className="p-4 transition border rounded-lg bg-gray-50 hover:shadow-md">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {topics.map((topic) => (
                  <div
                    key={topic._id}
                    onClick={() => navigate(`/topic/${topic.slug}`)}
                    className="p-6 text-center transition bg-white shadow-md cursor-pointer rounded-xl hover:shadow-lg"
                  >{topic.name}</div>
                ))}
              </div>
            </div>
          </div>
         {/* )} */}
        
      </div>
    </div>
  ); 

}
