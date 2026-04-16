import React from 'react';
import { useNavigate } from "react-router-dom";

export default function Addquiz() {
  const navigate = useNavigate();
  const questions = Array.from({ length: 2 });
  
  const [form, setForm] = React.useState({
    topic: "",
    questions: Array.from({ length: 2 }, () => ({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 1,
    })),
   });
   
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showPreview, setShowPreview] = React.useState(false);
   
  // Handle changes here
  const handleChange = (e) => {
    const {name,value} = e.target;
    
    // Topic
    if (name === "topic") {
      setForm({ ...form, topic: value });
      return;
    }

    const updatedQuestions = [...form.questions];

    // question-0
    if (name.startsWith("question-")) {
      const index = Number(name.split("-")[1]);
      updatedQuestions[index].question = value;
    }

    // option-0-1
    else if (name.startsWith("option-")) {
      const [_, qIndex, optIndex] = name.split("-");
      updatedQuestions[qIndex].options[optIndex - 1] = value;
    }

    // correct-0
    else if (name.startsWith("correct-")) {
      const index = Number(name.split("-")[1]);
      updatedQuestions[index].correctAnswer = Number(value);
    }

    setForm({ ...form, questions: updatedQuestions });
  };

  const handelsubmit = async (e) => {
    if (e) e.preventDefault();
    // Handle form submission logic here

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/addquiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      
      console.log("Redirecting to dashboard...");
      navigate("/dashboard");
      
      setError("");
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
    
  };


  return (
    <div className="min-h-screen p-6 bg-gray-100">
      
      {/* Container */}
      <div className="max-w-4xl p-6 mx-auto bg-white shadow-lg rounded-xl">
        
        <form onSubmit={handelsubmit}>
          {/* Title */}
          <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
            Add Quiz
          </h2>

            {/* Topic Input */}
            <div className="mb-6">
            <label className="block mb-1 font-medium text-gray-700">
                Topic Name
            </label>
            <input
                type="text"
                name="topic"
                onChange={handleChange}
                placeholder="Enter topic..."
                className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
            </div>

            {/* Questions */}
            <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-2">
            {questions.map((_, i) => (
                <div
                key={i}
                className="p-4 transition border rounded-lg bg-gray-50 hover:shadow-md"
                >
                <h3 className="mb-3 text-lg font-semibold text-blue-600">
                    Question {i + 1}
                </h3>

                {/* Question */}
                <div className="mb-3">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                    Question
                    </label>
                    <input
                    type="text"
                    name={`question-${i}`}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
                    required
                    />
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {[1, 2, 3, 4].map((opt) => (
                    <div key={opt}>
                        <label className="block mb-1 text-sm text-gray-600">
                        Option {opt}
                        </label>
                        <input
                        type="text"
                        name={`option-${i}-${opt}`}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
                        required
                        />
                    </div>
                    ))}
                </div>

                {/* Correct Answer */}
                <div className="mt-3">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                    Correct Answer
                    </label>
                    <select
                    name={`correct-${i}`}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-green-500"
                    >
                    {[1, 2, 3, 4].map((opt) => (
                        <option key={opt} value={opt}>
                        Option {opt}
                        </option>
                    ))}
                    </select>
                </div>
                </div>
            ))}
            </div>
            
            {error && <p className="text-red-500">{error}</p>}
            
            {/* Submit Button */}
            <div className="mt-6 text-center">
            {/* <button
                type="submit"
                className="px-6 py-2 font-semibold text-white transition bg-blue-600 rounded-md hover:bg-blue-700"
                
            >
                {loading ? "Adding Quiz..." : "Add Quiz"}
            </button> */}
            <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="px-6 py-2 mr-3 text-white bg-gray-600 rounded-md"
              >
                Preview & Submit
              </button>
            </div>
        </form>
        {showPreview && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    
    <div className="w-[90%] max-w-3xl max-h-[80vh] overflow-y-auto p-6 bg-white rounded-lg">
      
      <h2 className="mb-4 text-xl font-bold">Quiz Preview</h2>

      <p className="mb-4 font-semibold">Topic: {form.topic}</p>

      {form.questions.map((q, i) => (
        <div key={i} className="p-3 mb-4 border rounded">
          
          <p className="font-medium">
            Q{i + 1}: {q.question || "Not filled"}
          </p>

          <ul className="mt-2">
            {q.options.map((opt, j) => (
              <li
                key={j}
                className={`p-1 ${
                  q.correctAnswer === j + 1
                    ? "text-green-600 font-semibold"
                    : ""
                }`}
              >
                {j + 1}. {opt || "Empty"}
              </li>
            ))}
          </ul>

        </div>
      ))}

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => setShowPreview(false)}
          className="px-4 py-2 bg-gray-400 rounded"
        >
          Close
        </button>

        <button
          onClick={handelsubmit}
          className="px-4 py-2 text-white bg-blue-600 rounded"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Confirm & Submit"}
        </button>
      </div>

    </div>
  </div>
)}
      </div>
    </div>
  );
}