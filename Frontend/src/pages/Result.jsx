// import React from "react";
// import { useParams, useNavigate, Outlet, useLocation } from "react-router-dom";
// import API from "../config/api";

// export default function Result() {

//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Function to capitalize first letter
//   const capitalizeFirstLetter = (str) => {
//     if (!str) return "";
//     return str.charAt(0).toUpperCase() + str.slice(1);
//   };
  
//   return (
//     <div className="min-h-screen p-6 bg-gray-100">

//       {/* Container */}
//       <div className="max-w-4xl p-6 mx-auto bg-white shadow-lg rounded-xl">

//         <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Results</h2>

//          <div className="p-4 transition border rounded-lg bg-gray-50 hover:shadow-md">
//           {/* <h2>gkfwkfkw</h2>
//           <h1>jbhnjj</h1> */}
//           <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">
//               Results for{" "}
//               <span className="text-blue-600">
//                 {capitalizeFirstLetter(slug)}
//               </span>
//             </h2>
//          </div>
//       </div>
//     </div>
//   )
// }
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../config/api";

export default function Result() {
  const { slug } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/quiz/${slug}/results`); // Adjust endpoint as per your backend
        setResults(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl">Loading results...</p>
      </div>
    );
  }

  if (error || results.length === 0) {
    return (
      <div className="min-h-screen py-10 bg-gray-50">
        <div className="max-w-4xl px-6 mx-auto text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-800">No Results Yet</h2>
          <p className="mb-8 text-gray-600">You haven't attempted any quiz in {capitalizeFirstLetter(slug)} yet.</p>
          <button 
            onClick={() => window.history.back()}
            className="px-8 py-3 text-white transition bg-blue-600 rounded-2xl hover:bg-blue-700"
          >
            ← Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 bg-gray-50">
      <div className="max-w-5xl px-6 mx-auto">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800">Quiz Results</h1>
          <p className="mt-2 text-xl text-gray-600">
            {capitalizeFirstLetter(slug)}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-4">
          <div className="p-6 text-center bg-white shadow rounded-3xl">
            <p className="text-gray-500">Total Attempts</p>
            <p className="mt-2 text-5xl font-bold text-blue-600">{results.length}</p>
          </div>
          <div className="p-6 text-center bg-white shadow rounded-3xl">
            <p className="text-gray-500">Best Score</p>
            <p className="mt-2 text-5xl font-bold text-green-600">
              {Math.max(...results.map(r => r.score || 0))}%
            </p>
          </div>
          <div className="p-6 text-center bg-white shadow rounded-3xl">
            <p className="text-gray-500">Average Score</p>
            <p className="mt-2 text-5xl font-bold text-orange-600">
              {Math.round(results.reduce((a, b) => a + (b.score || 0), 0) / results.length)}%
            </p>
          </div>
          <div className="p-6 text-center bg-white shadow rounded-3xl">
            <p className="text-gray-500">Last Attempt</p>
            <p className="mt-2 text-5xl font-bold text-purple-600">2d ago</p>
          </div>
        </div>

        {/* Attempt History */}
        <div className="p-8 bg-white shadow-xl rounded-3xl">
          <h2 className="mb-6 text-2xl font-semibold">Attempt History</h2>
          
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="flex flex-col items-center justify-between p-6 md:flex-row bg-gray-50 rounded-2xl">
                <div>
                  <p className="text-lg font-semibold">{result.quizTitle || "Quiz"}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(result.date).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-10 mt-4 md:mt-0">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-green-600">{result.score}%</p>
                    <p className="text-sm text-gray-500">Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">{result.correct}/{result.total}</p>
                    <p className="text-sm text-gray-500">Correct</p>
                  </div>
                  <button className="px-6 py-3 text-white transition bg-blue-600 rounded-2xl hover:bg-blue-700">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}