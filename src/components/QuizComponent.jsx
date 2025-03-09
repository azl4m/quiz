import React, { useState, useEffect, useRef } from "react";
import { useQuiz } from "../context/QuizContext";
import QuizSetup from "./QuizSetup";
import correctSound from "../assets/correct.mp3";
import wrongSound from "../assets/wrong.mp3";
import backgroundMusicFile from "../assets/background-music.mp3";

const QuizComponent = () => {
  const {
    questions,
    currentQuestionIndex,
    score,
    loading,
    error,
    fetchQuestions,
    dispatch,
    quizFinished,
  } = useQuiz();

  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 15 seconds per question
  const backgroundMusic = useRef(new Audio(backgroundMusicFile));
  const correctAudio = useRef(new Audio(correctSound));
  const wrongAudio = useRef(new Audio(wrongSound));

  useEffect(() => {
    if (quizStarted) {
      backgroundMusic.current.loop = true;
      backgroundMusic.current.volume = 0.7;
      backgroundMusic.current.play();
    } else {
      backgroundMusic.current.pause();
      backgroundMusic.current.currentTime = 0;
    }
  }, [quizStarted]);

  useEffect(() => {
    if (quizFinished) {
      backgroundMusic.current.pause();
    }
  }, [quizFinished]);

  useEffect(() => {
    if (!quizStarted || quizFinished) return;

    setTimeLeft(30); 

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          dispatch({ type: "NEXT_QUESTION" });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, quizStarted, quizFinished]);

  const startQuiz = (category, difficulty, limit) => {
    fetchQuestions(category, difficulty, limit);
    setQuizStarted(true);
  };

  if (!quizStarted) {
    return <QuizSetup startQuiz={startQuiz} />;
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-blue-600 animate-pulse">
          Loading questions...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-red-600">Error: {error}</p>
      </div>
    );

  if (quizFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800">Quiz Finished!</h2>
          <p className="mt-3 text-lg font-medium text-gray-600">
            Your Score: <span className="text-blue-600">{score}</span>
          </p>
          <button
            onClick={() => {
              dispatch({ type: "RESET_QUIZ" });
              setQuizStarted(false)}}
            className="mt-5 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow transition duration-300"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (key) => {
    if (selectedAnswer !== null) return; // Prevent multiple clicks

    setSelectedAnswer(key);
    const isCorrect = currentQuestion.correct_answers[key + "_correct"] === "true";

    if (isCorrect) {
      correctAudio.current.play();
      dispatch({ type: "INCREASE_SCORE" });
    } else {
      wrongAudio.current.play();
      setShowCorrectAnswer(true);
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      setShowCorrectAnswer(false);
      dispatch({ type: "NEXT_QUESTION" });
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
        {/* Timer Display */}
        <div className="absolute top-3 right-3 text-lg font-semibold text-red-500">
          ⏳ {timeLeft}s
        </div>

        <h2 className="text-2xl font-bold text-gray-800">
          Question {currentQuestionIndex + 1}
        </h2>
        <p className="text-lg text-gray-700 mt-3">{currentQuestion?.question}</p>

        <ul className="mt-5 space-y-3">
          {Object.entries(currentQuestion?.answers || {}).map(([key, answer]) =>
            answer ? (
              <li key={key}>
                <button
                  className={`w-full py-3 px-5 rounded-lg text-gray-700 font-medium shadow transition duration-300
                    ${
                      selectedAnswer === key
                        ? currentQuestion.correct_answers[key + "_correct"] === "true"
                          ? "bg-green-500 text-white animate-bounce"
                          : "bg-red-500 text-white animate-shake"
                        : "bg-gray-200 hover:bg-blue-500 hover:text-white"
                    }
                    ${
                      showCorrectAnswer && currentQuestion.correct_answers[key + "_correct"] === "true"
                        ? "border-4 border-green-500"
                        : ""
                    }
                  `}
                  onClick={() => handleAnswer(key)}
                  disabled={selectedAnswer !== null}
                >
                  {answer}
                </button>
              </li>
            ) : null
          )}
        </ul>

        <div className="mt-5 flex justify-between items-center">
          <p className="text-lg font-semibold text-gray-800">
            Score: <span className="text-blue-600">{score}</span>
          </p>
          <button
            onClick={() => dispatch({ type: "NEXT_QUESTION" })}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition duration-300"
            
          >
            Next Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizComponent;