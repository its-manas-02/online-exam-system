import React from 'react';

export default function Addquiz() {
  const questions = Array.from({ length: 20 });
  
  const [form, setForm] = React.useState({
    topic: "",
    questions: Array.from({ length: 20 }, () => ({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
    })),
   });
   
   const [loading, setLoading] = React.useState(false);
   
  // Handle changes here
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    setLoading(true);
    try {
        
    } catch (error) {
        
    } finally {
      setLoading(false);
    }
  };

  const handelsubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
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

            {/* Submit Button */}
            <div className="mt-6 text-center">
            <button
                type="submit"
                className="px-6 py-2 font-semibold text-white transition bg-blue-600 rounded-md hover:bg-blue-700"
                disabled={loading}
            >
                {loading ? "Adding Quiz..." : "Add Quiz"}
            </button>
            </div>
        </form>
      </div>
    </div>
  );
}