import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../config/api';
import { Link } from 'react-router-dom';

export default function MyQuiz() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyQuizzes = async () => {
      try {
        setLoading(true);
        const response = await API.get('/my-quizzes');
        setQuizzes(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching my quizzes:', err);
        setError('Failed to load your quizzes');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyQuizzes();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Loading your quizzes...</div>
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
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">My Quizzes</h2>

        {quizzes.length > 0 ? (
          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md transition hover:bg-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{quiz.title}</h3>
                    {quiz.topic && (
                      <p className="text-sm text-gray-600 mt-1">
                        Topic: <span className="font-medium text-blue-600">{quiz.topic.name}</span>
                      </p>
                    )}
                    <div className="flex gap-4 mt-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <span className="font-semibold text-orange-600">{quiz.questionCount}</span> Questions
                      </span>
                      <span className="text-gray-500">
                        Created: {new Date(quiz.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/quiz/${quiz.slug}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap ml-4"
                  >
                    View Quiz
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-600 text-lg mb-4">You haven't created any quizzes yet</p>
            <Link
              to="/addquiz"
              className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Create Your First Quiz
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
