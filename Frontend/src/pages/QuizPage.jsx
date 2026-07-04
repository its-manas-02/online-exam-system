import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import API from '../config/api';

export default function QuizPage() {
  const { quizSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const storageKey = `quiz_${quizSlug}`;
  const TOTAL_TIME = 60; // seconds

  // State Management
  const [timeLeft, setTimeLeft] = React.useState(TOTAL_TIME);
  const [quiz, setQuiz] = React.useState(null);
  const [questions, setQuestions] = React.useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [answers, setAnswers] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  // Fetch Quiz Data
  React.useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await API.get(`/quiz/${quizSlug}`);
        setQuiz(res.data);
        setQuestions(res.data.questions || []);
      } catch (err) {
        console.error("Failed to fetch quiz:", err);
        setError(err.response?.data?.message || "Failed to load quiz. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizSlug]);

  // Initialize from localStorage or restart
  React.useEffect(() => {
    if (questions.length > 0) {
      const isRestart = location.state?.restart;
      const saved = !isRestart && localStorage.getItem(storageKey);

      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAnswers(parsed.answers || {});
          setTimeLeft(parsed.timeLeft || TOTAL_TIME);
          setCurrentQuestionIndex(0);
        } catch (e) {
          console.error("Failed to parse saved quiz:", e);
          localStorage.removeItem(storageKey);
          setAnswers({});
          setTimeLeft(TOTAL_TIME);
        }
      } else {
        // Fresh start or restart
        setAnswers({});
        setTimeLeft(TOTAL_TIME);
        setCurrentQuestionIndex(0);
      }
    }
  }, [questions.length, quizSlug]);

  // Auto-save to localStorage
  React.useEffect(() => {
    const data = {
      answers,
      timeLeft,
      currentQuestionIndex,
      timestamp: Date.now(),
    };
    localStorage.setItem(storageKey, JSON.stringify(data));
  }, [answers, timeLeft, currentQuestionIndex, storageKey]);

  // Timer Logic
  React.useEffect(() => {
    if (!quiz || submitted) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quiz, submitted]);

  // Prevent quiz in multiple tabs
  React.useEffect(() => {
    const handler = () => {
      alert("⚠️ Quiz is open in another tab! Reload this page.");
      localStorage.removeItem(storageKey);
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [storageKey]);

  // Handle Answer Selection
  // Store the option index (1-4) instead of text to match backend correctAnswer format
  const handleOptionSelect = (questionId, selectedOptionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOptionIndex
    }));
  };

  // Handle Quiz Submission
  const handleSubmit = async () => {
    if (submitted) return;

    const confirmed = window.confirm("Are you sure you want to submit? You cannot change answers after submission.");
    if (!confirmed) return;

    setSubmitting(true);
    try {
      const res = await API.post("/quiz/submit", {
        quizId: quiz._id,
        answers,
        timeLeft,
      });

      setSubmitted(true);
      localStorage.removeItem(storageKey);

      // Show result modal
      alert(`✅ Quiz Submitted!\n\nScore: ${res.data.score}/${res.data.total}\nPercentage: ${Math.round((res.data.score / res.data.total) * 100)}%`);

      // Redirect to results
      setTimeout(() => {
        navigate(`/results/${quizSlug}`);
      }, 1500);

    } catch (err) {
      console.error("Submission error:", err);
      alert("❌ " + (err.response?.data?.message || "Failed to submit quiz"));
      setSubmitting(false);
    }
  };

  // Navigation Handlers
  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Format Time
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-xl text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !quiz || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md p-8 text-center bg-white rounded-lg shadow-lg">
          <p className="mb-4 text-lg font-semibold text-red-600">
            {error || "Quiz not found or no questions available"}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isAnswered = answers[currentQuestion._id] !== undefined;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-6xl p-4 mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{quiz.title}</h1>
            <div className={`px-4 py-2 rounded-lg text-white font-semibold text-lg ${
              timeLeft <= 10 ? "bg-red-500 animate-pulse" : "bg-blue-600"
            }`}>
              ⏱ {formatTime(timeLeft)}
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>Answered: {answeredCount}/{questions.length}</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 overflow-hidden bg-gray-300 rounded-full">
            <div 
              className="h-3 transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-700"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            {/* Question Card */}
            <div className="p-8 mb-6 bg-white shadow-lg rounded-2xl">
              <h2 className="mb-8 text-2xl font-semibold text-gray-800">
                {currentQuestionIndex + 1}. {currentQuestion.question}
              </h2>

              {/* Options */}
              <div className="space-y-4">
                {currentQuestion.options && currentQuestion.options.map((option, index) => {
                  const optionIndex = index + 1; // 1-4 to match backend correctAnswer
                  const isSelected = answers[currentQuestion._id] === optionIndex;
                  return (
                    <div
                      key={index}
                      onClick={() => !submitted && handleOptionSelect(currentQuestion._id, optionIndex)}
                      className={`p-5 border-2 rounded-xl cursor-pointer transition-all text-lg font-medium
                        ${isSelected
                          ? 'border-blue-600 bg-blue-50 shadow-md' 
                          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                        } ${submitted ? 'cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                        }`}>
                          {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <span className="text-gray-700">{String.fromCharCode(65 + index)}</span> {option}
                      </div>
                    </div>
                  );
                })}
              </div>

              {submitted && <p className="mt-6 text-center text-gray-500">Quiz submitted. Redirecting to results...</p>}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              <button
                onClick={goToPrevious}
                disabled={currentQuestionIndex === 0 || submitted}
                className="px-6 py-3 font-medium transition bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded-xl"
              >
                ← Previous
              </button>

              <button
                onClick={goToNext}
                disabled={currentQuestionIndex === questions.length - 1 || submitted}
                className="px-6 py-3 font-medium text-white transition bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl"
              >
                Next →
              </button>

              {currentQuestionIndex === questions.length - 1 && (
                <button 
                  onClick={handleSubmit}
                  disabled={submitted || submitting}
                  className="px-8 py-3 ml-auto font-medium text-white transition bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-xl"
                >
                  {submitting ? "Submitting..." : "Submit Quiz"}
                </button>
              )}
            </div>
          </div>

          {/* Question Navigator Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky p-6 bg-white shadow-lg rounded-2xl top-6">
              <h3 className="mb-4 font-semibold text-gray-800">Questions</h3>
              <div className="grid grid-cols-4 gap-2 lg:grid-cols-3">
                {questions.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => goToQuestion(index)}
                    disabled={submitted}
                    className={`p-2 rounded-lg font-medium text-sm transition ${
                      index === currentQuestionIndex
                        ? 'bg-blue-600 text-white shadow-md'
                        : answers[q._id]
                        ? 'bg-green-200 text-green-800 hover:bg-green-300'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } ${submitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    title={answers[q._id] ? 'Answered' : 'Unanswered'}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <div className="pt-6 mt-6 border-t-2">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">{answeredCount}</span>/{questions.length} answered
                </p>
                {answeredCount < questions.length && (
                  <p className="mt-2 text-xs text-orange-600">
                    ⚠️ {questions.length - answeredCount} question(s) remaining
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}