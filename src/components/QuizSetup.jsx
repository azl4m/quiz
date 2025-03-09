import axios from "axios";
import React, { useEffect, useState } from "react";
// import { REACT_APP_QUIZ_TOKEN } from "../../key";

const QuizSetup = ({ startQuiz }) => {
  const [category, setCategory] = useState("Linux");
  const [difficulty, setDifficulty] = useState("Easy");
  const [limit, setLimit] = useState(10);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://quizapi.io/api/v1/categories",
          {
            params: {
              apiKey: import.meta.env.VITE_REACT_APP_QUIZ_TOKEN,
            },
          }
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const difficulties = ["Easy", "Medium", "Hard"];
  const limits = [10, 20, 25];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-5">
          Choose Quiz Settings
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Select Category:
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {categories.length > 0 ? (
              categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))
            ) : (
              <option>Loading...</option>
            )}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Select Difficulty:
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>
                {diff}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Number of Questions:
          </label>
          <select
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {limits.map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => startQuiz(category, difficulty, limit)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizSetup;
