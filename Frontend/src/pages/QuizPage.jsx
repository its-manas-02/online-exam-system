import React from 'react';
import { useParams } from 'react-router-dom';
import API from '../config/api';


export default function QuizPage() {
  const { quizSlug } = useParams();
  const storageKey = `quiz_${quizSlug}`;
  const TOTAL_TIME = 60;

  //reactHooks
  const [timeLeft, setTimeLeft] = React.useState(TOTAL_TIME); // seconds
  const [quiz, setQuiz] = React.useState(null);
  const [questions, setQuestions] = React.useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  // const [selectedAnswers, setSelectedAnswers] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [answers, setAnswers] = React.useState([]);
  const saveRef = React.useRef();
  React.useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`${API}/quiz/${quizSlug}`);
        const data = await res.json();

        if (res.ok) {
          setQuiz(data);
          setQuestions(data.questions || []);
        } else {
          console.error("Error:", data.message);
        }
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizSlug]);

  React.useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(); // ⏱ auto submit
      return;
    }

    const timer = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        clearInterval(timer);
        handleSubmit();
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);
  
  React.useEffect(() => {
    const handler = () => {
      alert("Quiz opened in another tab!");
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  React.useEffect(() => {
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      const parsed = JSON.parse(saved);
      setAnswers(parsed.answers || []);
      setTimeLeft(parsed.timeLeft || TOTAL_TIME);
    }
  }, [quizSlug]);

  React.useEffect(() => {
    const data = {
      answers,
      timeLeft,
    };

    localStorage.setItem(storageKey, JSON.stringify(data));
  }, [answers, timeLeft]);

  const handleOptionSelect = (questionId, option) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleSelect = (qIndex, optionIndex) => {
    const updated = [...answers];
    updated[qIndex] = optionIndex;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    alert("Time up! Submitting quiz...");
    localStorage.removeItem(storageKey); // 🧹 clear saved state

    // submit logic here
    try {
      const res = await fetch(`${API}/quiz/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          quizId: quiz._id,
          answers,
          timeLeft,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      localStorage.removeItem(storageKey);

      alert(`Score: ${data.score}/${data.total}`);

    } catch (err) {
      console.error(err);
      alert("Failed to submit");
    }
  };

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  if (loading) return <div className="p-10 text-xl text-center">Loading quiz...</div>;
  if (!quiz || questions.length === 0) {
    return <div className="p-10 text-center text-red-600">Quiz not found or no questions available.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  
  return (
    <div className="max-w-3xl p-6 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{quiz.title}</h1>
        <p className="mt-2 text-gray-600">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>

        <span className={`px-3 py-1 rounded-lg text-white ${
          timeLeft <= 10 ? "bg-red-500" : "bg-blue-500"
        }`}>
          ⏱ {formatTime(timeLeft)}
        </span>
        
        {/* Progress Bar */}
        <div className="w-full h-2 mt-4 bg-gray-200 rounded-full">
          <div 
            className="h-2 transition-all duration-300 bg-blue-600 rounded-full"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="p-8 bg-white shadow-lg rounded-2xl">
        <h2 className="mb-6 text-xl font-semibold">
          {currentQuestionIndex + 1}. {currentQuestion.question}
        </h2>

        <div className="space-y-4">
          {currentQuestion.options && currentQuestion.options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionSelect(currentQuestion._id, option)}
              className={`p-5 border-2 rounded-xl cursor-pointer transition-all text-lg
                ${answers[currentQuestion._id] === option
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
            >
              {option}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={goToPrevious}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-3 font-medium transition bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded-xl"
        >
          ← Previous
        </button>

        {currentQuestionIndex === questions.length - 1 ? (
          <button 
            className="px-8 py-3 font-medium text-white transition bg-green-600 hover:bg-green-700 rounded-xl"
            onClick={() => handleSubmit()}
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={goToNext}
            className="px-8 py-3 font-medium text-white transition bg-blue-600 hover:bg-blue-700 rounded-xl"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}