import React from "react";
import { useParams } from "react-router-dom";

export default function TopicPage() {
  const { slug } = useParams();
  console.log(slug);
  const [quizzes, setQuizzes] = React.useState([]);

  React.useEffect(() => {
    fetch(`http://localhost:5000/api/quiz/topic/${slug}`)
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

      {quizzes.map((quiz) => (
        <div key={quiz._id} className="p-4 mb-3 bg-white rounded shadow">
          {quiz.title}
        </div>
      ))}
    </div>
  );
}