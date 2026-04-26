import React from "react";
import { useParams, useNavigate, Outlet, useLocation } from "react-router-dom";
import API from "../config/api";

export default function TopicPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [quizzes, setQuizzes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Check kar rahe hain ki hum quiz page pe hain ya nahi
  const isQuizPage = location.pathname.includes("/quiz/");

  React.useEffect(() => {
    setLoading(true);
    fetch(`${API}/quiz/topic/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setQuizzes(data);
        } else {
          setQuizzes([]);
        }
      })
      .catch(err => {
        console.error(err);
        setQuizzes([]);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="p-6">
      {!isQuizPage && (
        <>
          <h2 className="mb-6 text-2xl font-bold">Quizzes</h2>

          {loading ? (
            <p>Loading quizzes...</p>
          ) : quizzes.length === 0 ? (
            <p>No quizzes found for "{slug}"</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {quizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  className="p-5 transition-all bg-white border shadow-sm cursor-pointer rounded-xl hover:shadow-md"
                  onClick={() => navigate(`quiz/${quiz._id}`)}
                >
                  <h3 className="text-lg font-semibold">{quiz.title}</h3>
                  {quiz.description && (
                    <p className="mt-2 text-sm text-gray-600">{quiz.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Quiz Page Content */}
      <Outlet />
    </div>
  );
}