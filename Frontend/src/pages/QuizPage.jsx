import React from "react";
import { useParams } from "react-router-dom";
import API from "../config/api";

export default function QuizPage() {
  const { quizId } = useParams();
  const [questions, setQuestions] = React.useState([]);

  React.useEffect(() => {
    API.get(`/quiz/${quizId}/questions`)
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error(err));
  }, [quizId]);

  return (
    <div className="p-6">
      <h2 className="mb-4 text-xl font-bold">Quiz</h2>

      {questions.length === 0 ? (
        <p>No questions found</p>
      ) : (
        questions.map((q, i) => (
          <div key={q._id} className="p-4 mb-4 bg-white rounded shadow">
            
            <p className="font-semibold">
              Q{i + 1}: {q.question}
            </p>

            <ul className="mt-2">
              {q.options.map((opt, j) => (
                <li key={j} className="p-1">
                  {j + 1}. {opt}
                </li>
              ))}
            </ul>

          </div>
        ))
      )}
    </div>
  );
}