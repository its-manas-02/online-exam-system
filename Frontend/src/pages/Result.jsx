
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faClock, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import API from "../config/api";

export default function Result() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailedView, setDetailedView] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Fetch quiz results
  useEffect(() => {
    let timeoutId;
    const fetchResults = async () => {
      timeoutId = setTimeout(() => {
        console.error("⏱️ TIMEOUT: API took too long");
        setLoading(false);
      }, 10000);

      try {
        console.log("🔍 Fetching results for slug:", slug);
        const res = await API.get(`/quiz/${slug}/results`);
        console.log("✅ API Response:", res.data);
        clearTimeout(timeoutId);
        
        const resultsData = Array.isArray(res.data) ? res.data : [];
        console.log("📦 Processing data:", resultsData);
        setResults(resultsData);
        setError(null);
      } catch (err) {
        clearTimeout(timeoutId);
        console.error("❌ Error:", err);
        setError(err.response?.data?.message || "Failed to load results");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchResults();
    return () => clearTimeout(timeoutId);
  }, [slug]);

  const fetchDetailedReview = async (resultId) => {
    try {
      setLoadingDetails(true);
      const res = await API.get(`/result/${resultId}/review`);
      setDetailedView(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load detailed review");
    } finally {
      setLoadingDetails(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-xl text-gray-600">Loading results for <strong>{slug}</strong>...</p>
        </div>
      </div>
    );
  }

  if (error || results.length === 0) {
    return (
      <div className="min-h-screen py-10 bg-gray-50">
        <div className="max-w-4xl px-6 mx-auto text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-800">
            {error ? "Error Loading Results" : "No Results Yet"}
          </h2>
          <p className="mb-8 text-gray-600">
            {error || "You haven't attempted this quiz yet."}
          </p>
          <button 
            onClick={() => navigate(-1)}
            className="px-8 py-3 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Show detailed view
  if (detailedView) {
    return (
      <div className="min-h-screen py-10 bg-gray-50">
        <div className="max-w-5xl px-6 mx-auto">
          <button
            onClick={() => setDetailedView(null)}
            className="flex items-center gap-2 px-4 py-2 mb-6 text-blue-600 hover:text-blue-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Attempts
          </button>

          <div className="p-8 mb-8 bg-white shadow-lg rounded-2xl">
            <h1 className="mb-4 text-3xl font-bold text-gray-800">{detailedView.quizTitle}</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="p-4 rounded-lg bg-blue-50">
                <p className="text-sm text-gray-600">Score</p>
                <p className="text-2xl font-bold text-blue-600">{detailedView.score}/{detailedView.total}</p>
              </div>
              <div className="p-4 rounded-lg bg-green-50">
                <p className="text-sm text-gray-600">Percentage</p>
                <p className="text-2xl font-bold text-green-600">{detailedView.percentage}%</p>
              </div>
              <div className="p-4 rounded-lg bg-purple-50">
                <p className="text-sm text-gray-600">Time Taken</p>
                <p className="text-2xl font-bold text-purple-600">{detailedView.timeTaken}s</p>
              </div>
              <div className="p-4 rounded-lg bg-orange-50">
                <p className="text-sm text-gray-600">Submitted</p>
                <p className="text-sm font-bold text-orange-600">{new Date(detailedView.submittedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {detailedView.details.map((detail, index) => {
              const isCorrect = detail.isCorrect;
              return (
                <div
                  key={index}
                  className={`p-6 border-2 rounded-2xl ${
                    isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`flex-shrink-0 text-2xl ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      <FontAwesomeIcon icon={isCorrect ? faCheckCircle : faTimesCircle} />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-gray-800">
                        Question {index + 1}. {detail.question}
                      </p>
                      <p className={`text-sm font-medium mt-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </p>
                    </div>
                  </div>

                  <div className="ml-12 space-y-2">
                    {detail.options.map((option, optIdx) => {
                      const optIndex = optIdx + 1;
                      const isUserAnswer = optIndex === detail.userAnswerIndex;
                      const isCorrectAnswer = optIndex === detail.correctAnswerIndex;

                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-lg border-2 ${
                            isCorrectAnswer ? 'bg-green-100 border-green-400' : 
                            isUserAnswer && !isCorrect ? 'bg-red-100 border-red-400' : 
                            'bg-gray-100 border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 font-bold text-gray-700">{String.fromCharCode(65 + optIdx)}</span>
                            <span className="flex-1 text-gray-800">{option}</span>
                            {isCorrectAnswer && <span className="px-2 py-1 text-xs font-bold text-green-700 bg-green-200 rounded">Correct</span>}
                            {isUserAnswer && !isCorrect && <span className="px-2 py-1 text-xs font-bold text-red-700 bg-red-200 rounded">Your Answer</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 bg-gray-50">
      <div className="max-w-5xl px-6 mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 mb-6 text-blue-600 hover:text-blue-800"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Topic
        </button>

        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800">Quiz Results</h1>
          <p className="mt-2 text-xl text-gray-600">{capitalizeFirstLetter(slug)}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-4">
          <div className="p-6 text-center transition bg-white shadow rounded-3xl hover:shadow-lg">
            <p className="text-gray-500">Total Attempts</p>
            <p className="mt-2 text-5xl font-bold text-blue-600">{results.length}</p>
          </div>
          <div className="p-6 text-center transition bg-white shadow rounded-3xl hover:shadow-lg">
            <p className="text-gray-500">Best Score</p>
            <p className="mt-2 text-5xl font-bold text-green-600">
              {Math.max(...results.map(r => Math.round((r.score / r.total) * 100) || 0))}%
            </p>
          </div>
          <div className="p-6 text-center transition bg-white shadow rounded-3xl hover:shadow-lg">
            <p className="text-gray-500">Average Score</p>
            <p className="mt-2 text-5xl font-bold text-orange-600">
              {Math.round(results.reduce((a, b) => a + Math.round((b.score / b.total) * 100), 0) / results.length)}%
            </p>
          </div>
          <div className="p-6 text-center transition bg-white shadow rounded-3xl hover:shadow-lg">
            <p className="text-gray-500">Latest Attempt</p>
            <p className="mt-2 text-lg font-bold text-purple-600">
              {new Date(results[0].createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="p-8 bg-white shadow-xl rounded-3xl">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">Attempt History</h2>
          
          <div className="space-y-4">
            {results.map((result, index) => {
              const percentage = Math.round((result.score / result.total) * 100);
              const isPassed = percentage >= 60;

              return (
                <div key={index} className="overflow-hidden transition border-2 border-gray-200 rounded-2xl hover:shadow-lg">
                  <div className="flex flex-col items-start justify-between p-6 md:flex-row md:items-center bg-gray-50 hover:bg-gray-100">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">Attempt {results.length - index}</p>
                      <p className="mt-1 text-sm text-gray-600">
                        {new Date(result.createdAt).toLocaleDateString()} at {new Date(result.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-8 mt-4 md:mt-0">
                      <div className="text-center">
                        <div className={`text-4xl font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                          {percentage}%
                        </div>
                        <p className="mt-1 text-xs text-gray-600">Score</p>
                      </div>

                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{result.score}</div>
                        <p className="mt-1 text-xs text-gray-600">of {result.total}</p>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-purple-600">
                          <FontAwesomeIcon icon={faClock} />
                          {result.timeTaken}s
                        </div>
                        <p className="mt-1 text-xs text-gray-600">Time</p>
                      </div>

                      <button
                        onClick={() => fetchDetailedReview(result._id)}
                        disabled={loadingDetails}
                        className="px-6 py-2 font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap"
                      >
                        {loadingDetails ? 'Loading...' : 'View Details'}
                      </button>
                    </div>
                  </div>

                  <div className={`px-6 py-2 ${isPassed ? 'bg-green-100' : 'bg-red-100'}`}>
                    <p className={`text-sm font-semibold ${isPassed ? 'text-green-700' : 'text-red-700'}`}>
                      {isPassed ? '✓ Passed' : '✗ Failed'} - Need 60% to pass
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-8 mt-12 bg-white shadow-xl rounded-3xl">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">Performance Trend</h2>
          <div className="flex items-end justify-center h-48 gap-4">
            {results.reverse().map((result, index) => {
              const percentage = Math.round((result.score / result.total) * 100);
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className="relative flex items-end h-40">
                    <div
                      className={`w-12 rounded-t-lg transition-all ${
                        percentage >= 60 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ height: `${percentage}%` }}
                      title={`Attempt ${index + 1}: ${percentage}%`}
                    ></div>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-gray-700">{percentage}%</p>
                  <p className="text-xs text-gray-500">Attempt {index + 1}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
