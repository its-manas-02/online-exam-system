// Frontend/src/pages/TopicPage.jsx
import React from "react";
import { useParams, useNavigate, Outlet, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faRotate, faFileLines } from '@fortawesome/free-solid-svg-icons';
import API from "../config/api";

export default function TopicPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [quizzes, setQuizzes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const isQuizPage = location.pathname.includes("/quiz/");

  // Function to capitalize first letter
  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

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
    <div className="min-h-screen bg-gray-50">
      {/* Quizzes List Page - White Card ke saath */}
      {!isQuizPage && (
        <div className="max-w-5xl p-6 mx-auto">
          <div className="p-8 bg-white shadow-lg rounded-2xl">
            <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">
              Quizzes for{" "}
              <span className="text-blue-600">
                {capitalizeFirstLetter(slug)}
              </span>
            </h2>
            
            <div className="p-4 transition border rounded-lg bg-gray-50 hover:shadow-md">
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
                <div className="grid grid-cols-1 gap-6 ">
                  {quizzes.map((quiz) => (
                    <div
                      key={quiz._id}
                      className="p-6 transition-all duration-200 bg-white border border-gray-200 shadow-sm cursor-pointer rounded-xl hover:shadow-xl"
                      onClick={() => handleQuizClick(quiz)}
                    >
                      <h3 className="text-xl font-semibold text-gray-800">{quiz.title}</h3>
                      {quiz.description && (
                        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                          {quiz.description}
                        </p>
                      )}
                      <div classname="grid grid-cols-1 gap-2 ">
                        <span className="gap-2 px-2 py-2 bg-blue-600 shadow-sm cursor-pointer rounded-xl hover:shadow-xl"><FontAwesomeIcon icon={faFileLines} /> Result</span>
                        <span className="gap-2 px-2 py-2 bg-green-600 shadow-sm cursor-pointer rounded-xl hover:shadow-xl"><FontAwesomeIcon icon={faPlay} /> Start</span>
                        <span className="gap-2 px-2 py-2 bg-red-500 shadow-sm cursor-pointer rounded-xl hover:shadow-xl"><FontAwesomeIcon icon={faRotate} /> Restart</span>
                      </div>
                      
                    </div>
                  ))}
                </div>
              )}
              </div>
          </div>
        </div>
      )}

      {/* Quiz Page - No extra white card */}
      {isQuizPage && <Outlet />}

      {/* Agar quiz nahi hai toh normal Outlet (safety ke liye) */}
      {!isQuizPage && <Outlet />}
    </div>
  );
}