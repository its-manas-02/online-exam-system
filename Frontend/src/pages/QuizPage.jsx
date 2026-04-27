import React from "react";
import { useParams } from "react-router-dom";
import API from "../config/api";


export default function QuizPage() {
  const { quizSlug } = useParams();

  const [quizData, setQuizData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching quiz with slug:", quizSlug); // ← Debug ke liye

        const res = await fetch(`${API}/quiz/${quizSlug}`); 
        // ↑↑↑↑ Apna exact backend URL yahan daal (API baseURL use kar raha hai toh usko use kar)

        const data = await res.json();

        console.log("API Response:", data);   // ← Yeh console mein dekh lena important hai

        if (res.ok) {
          setQuizData(data);
        } else {
          setError(data.message || "Failed to load quiz");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Network error or server is down");
      } finally {
        setLoading(false);
      }
    };

    if (quizSlug) {
      fetchQuiz();
    }
  }, [quizSlug]);

  if (loading) return <div className="p-10 text-lg text-center">Loading quiz...</div>;
  
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;

  if (!quizData) return <div className="p-10">Quiz not found</div>;

  // Ab yahan questions safely nikaal rahe hain
  const questions = quizData.questions || quizData; // agar direct array aa raha ho

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h1 className="mb-2 text-3xl font-bold">{quizData.title || "Untitled Quiz"}</h1>

      {!Array.isArray(questions) || questions.length === 0 ? (
        <p className="py-10 text-center text-gray-500">No questions available in this quiz.</p>
      ) : (
        <div className="mt-8 space-y-10">
          {questions.map((q, index) => (
            <div key={q._id || index} className="p-6 bg-white border shadow rounded-2xl">
              <h3 className="mb-5 text-xl font-semibold">
                Question {index + 1}: {q.question}
              </h3>

              <div className="grid gap-3">
                {Array.isArray(q.options) && q.options.map((option, i) => (
                  <div
                    key={i}
                    className="p-4 transition border cursor-pointer rounded-xl hover:bg-blue-50"
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}