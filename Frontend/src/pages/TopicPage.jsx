// Frontend/src/pages/TopicPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faRotate, faFileLines } from '@fortawesome/free-solid-svg-icons';
import API from "../config/api";
import { useAuth } from "../context/AuthContext";

export default function TopicPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quizzes, setQuizzes] = React.useState([]);
  const [quizResults, setQuizResults] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [loadingResults, setLoadingResults] = React.useState({});

  // Function to capitalize first letter
  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Fetch quizzes for the topic
  React.useEffect(() => {
    setLoading(true);
    API.get(`/quiz/topic/${slug}`)
      .then(res => res.data)
      .then(data => {
        if (Array.isArray(data)) {
          setQuizzes(data);
          // Fetch results for each quiz if user is logged in
          if (user) {
            data.forEach(quiz => {
              fetchQuizResults(quiz.slug);
            });
          }
        } else {
          setQuizzes([]);
        }
      })
      .catch(err => {
        console.error(err);
        setQuizzes([]);
      })
      .finally(() => setLoading(false));
  }, [slug, user]);

  // Fetch user's results for a specific quiz
  const fetchQuizResults = async (quizSlug) => {
    try {
      setLoadingResults(prev => ({ ...prev, [quizSlug]: true }));
      const response = await API.get(`/quiz/${quizSlug}/my-results`);
      setQuizResults(prev => ({ ...prev, [quizSlug]: response.data }));
    } catch (err) {
      console.error(`Error fetching results for quiz ${quizSlug}:`, err);
      setQuizResults(prev => ({ ...prev, [quizSlug]: null }));
    } finally {
      setLoadingResults(prev => ({ ...prev, [quizSlug]: false }));
    }
  };

  // Button handlers
  const handleStartQuiz = (e, quiz) => {
    e.stopPropagation();
    navigate(`/quiz/${quiz.slug}`);
  };

  const handleRestartQuiz = (e, quiz) => {
    e.stopPropagation();
    navigate(`/quiz/${quiz.slug}`, { state: { restart: true } });
  };

  const handleViewResults = (e, quiz) => {
    e.stopPropagation();
    const results = quizResults[quiz.slug];
    if (results && results.results.length > 0) {
      navigate(`/results/${quiz.slug}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Quizzes List Page */}
      <div className="max-w-5xl p-6 mx-auto">
        <div className="p-8 bg-white shadow-lg rounded-2xl">
          <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">
            Quizzes for{" "}
            <span className="text-blue-600">
              {capitalizeFirstLetter(slug)}
            </span>
          </h2>
          
          <div className="p-4 transition border rounded-lg bg-gray-50">
            {loading ? (
              <p className="py-10 text-lg text-center">Loading quizzes...</p>
            ) : quizzes.length === 0 ? (
              <p className="py-10 text-center text-gray-500">
                No quizzes found for{" "}
              <span className="font-semibold text-gray-700">
                {capitalizeFirstLetter(slug)}
              </span>
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {quizzes.map((quiz) => {
                  const quizData = quizResults[quiz.slug];
                  const isAttempted = quizData && quizData.attemptCount > 0;
                  const isLoadingResults = loadingResults[quiz.slug];

                  return (
                    <div
                      key={quiz._id}
                      className="p-6 transition-all duration-200 bg-white border-2 border-gray-200 shadow-sm rounded-xl hover:shadow-xl hover:border-blue-400"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-800">{quiz.title}</h3>
                          {quiz.description && (
                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                              {quiz.description}
                            </p>
                          )}
                        </div>
                        {isAttempted && (
                          <div className="ml-4 p-3 bg-green-50 rounded-lg text-right">
                            <p className="text-sm text-gray-600">Attempts</p>
                            <p className="text-2xl font-bold text-green-600">{quizData.attemptCount}</p>
                            <p className="text-xs text-gray-500 mt-1">Best: {quizData.bestScore}</p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-3 gap-3 mt-6">
                        {/* Result Button */}
                        <button
                          onClick={(e) => handleViewResults(e, quiz)}
                          disabled={!isAttempted || isLoadingResults}
                          className={`flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition ${
                            isAttempted
                              ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          }`}
                        >
                          <FontAwesomeIcon icon={faFileLines} />
                          <span className="hidden sm:inline">Results</span>
                        </button>

                        {/* Start Button */}
                        <button
                          onClick={(e) => handleStartQuiz(e, quiz)}
                          className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white transition bg-green-500 rounded-lg hover:bg-green-600"
                        >
                          <FontAwesomeIcon icon={faPlay} />
                          <span className="hidden sm:inline">Start</span>
                        </button>

                        {/* Restart Button */}
                        <button
                          onClick={(e) => handleRestartQuiz(e, quiz)}
                          disabled={!isAttempted}
                          className={`flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition ${
                            isAttempted
                              ? 'bg-red-500 text-white hover:bg-red-600 cursor-pointer'
                              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          }`}
                        >
                          <FontAwesomeIcon icon={faRotate} />
                          <span className="hidden sm:inline">Retake</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            </div>
        </div>
      </div>
    </div>
  );
}