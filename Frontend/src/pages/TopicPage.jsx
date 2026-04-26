import React from "react";
import { useParams , useNavigate, Outlet } from "react-router-dom";
import API from "../config/api";

export default function TopicPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  console.log(slug);
  const [quizzes, setQuizzes] = React.useState([]);
  React.useEffect(() => {
    fetch(`${API}/quiz/topic/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
        setQuizzes(data);
        } else {
        console.error("API Error:", data);
        setQuizzes([]);
        }
       });
  }, [slug]);
  
  console.log("quizzes:", quizzes);

  return (
    <div className="p-6">
      <h2 className="mb-4 text-xl font-bold">Quizzes</h2>

      {quizzes.length === 0 ? (
        <p>No quizzes found</p>
      ) : (
        quizzes.map((quiz) => (
          <div 
            key={quiz._id} 
            className="p-4 mb-3 bg-white rounded shadow" 
            onClick={() => navigate(`/topic/${slug}/quiz/${quiz._id}`)}>
            {quiz.title}
          </div>
        ))
      )}
      <Outlet />
    </div>
  );
}