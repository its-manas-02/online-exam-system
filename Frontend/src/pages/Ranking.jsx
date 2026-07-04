import React, { useState, useEffect } from 'react';
import API from '../config/api';

export default function Ranking() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        const response = await API.get('/rankings');
        setRankings(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching rankings:', err);
        setError('Failed to load rankings');
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Loading rankings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Container */}
      <div className="max-w-4xl p-6 mx-auto bg-white shadow-lg rounded-xl">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Rankings</h2>

        <div className="p-4 transition border rounded-lg bg-gray-50">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-200 rounded-lg">
              <span className="w-12 text-lg font-semibold">Rank</span>
              <span className="flex-1 text-lg font-semibold">Name</span>
              <span className="w-24 text-lg font-semibold text-right">Total Score</span>
              <span className="w-32 text-lg font-semibold text-right">Avg Score</span>
            </div>
            <hr className="my-2" />

            {/* Rankings List */}
            {rankings.length > 0 ? (
              <div className="space-y-2">
                {rankings.map((entry, index) => (
                  <div
                    key={entry._id}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition ${
                      index === 0
                        ? 'bg-yellow-100 border-2 border-yellow-400'
                        : index === 1
                        ? 'bg-gray-300 border-2 border-gray-400'
                        : index === 2
                        ? 'bg-orange-100 border-2 border-orange-400'
                        : 'hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    <span className="w-12 text-lg font-semibold">{entry.rank}</span>
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-gray-800">{entry.username}</p>
                      <p className="text-sm text-gray-600">{entry.email}</p>
                    </div>
                    <span className="w-24 text-lg font-semibold text-right text-blue-600">
                      {entry.totalScore}
                    </span>
                    <span className="w-32 text-lg font-semibold text-right text-green-600">
                      {entry.averageScore}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                No rankings available yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}