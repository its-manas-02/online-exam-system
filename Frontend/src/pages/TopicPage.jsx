import React from "react";
import { useParams, useNavigate, Outlet, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import API from "../config/api";

export default function TopicPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [quizzes, setQuizzes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

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

  const handleQuizClick = (quiz) => {
    navigate(`quiz/${quiz.slug}`);
  };

  return (
    <div className="flex-1 min-h-screen p-6 bg-gray-100">
      <div className="max-w-5xl p-6 mx-auto bg-white shadow-lg rounded-xl">
        {!isQuizPage && (
          <>
            <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Quizzes</h2>

            <div className="p-4 transition border rounded-lg bg-gray-50 hover:shadow-md">
              {loading ? (
                <p>Loading quizzes...</p>
              ) : quizzes.length === 0 ? (
                <p>No quizzes found for "{slug}"</p>
              ) : (
                  <div className="grid grid-cols-1 gap-4 ">
                    {quizzes.map((quiz) => (
                    <div
                        key={quiz._id}
                        className="p-5 transition-all bg-white border shadow-sm cursor-pointer rounded-xl hover:shadow-md"
                        onClick={() => handleQuizClick(quiz)}
                      >
                        <h3 className="text-lg font-semibold">{quiz.title}</h3>
                        {quiz.description && (
                          <p className="mt-2 text-sm text-gray-600">{quiz.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Quiz Page Content */}
      <Outlet />
    </div>
  );
}