import axios from "axios";
import React, { useContext, useReducer } from "react";
// import { REACT_APP_QUIZ_TOKEN } from "../../key";
const QuizContext = React.createContext();
const initialState = {
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  loading: false,
  error: null,
  quizFinished: false,
};

const quizReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, questions: action.payload };
    case "FETCH_ERROR":
      return { ...state, error: action.payload };
    case "NEXT_QUESTION":
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        quizFinished: state.currentQuestionIndex + 1 >= state.questions.length,
      };
    case "INCREASE_SCORE":
      return { ...state, score: state.score + 1 };
    case "RESET_QUIZ":
      return { ...initialState, questions: state.questions };
    default:
      return state;
  }
};

export const QuizProvider = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const fetchQuestions = async (category, difficulty, limit = 10) => {
    dispatch({ type: "FETCH_START" });

    try {
      const response = await axios.get(`https://quizapi.io/api/v1/questions`, {
        params: {
          apiKey: process.env.REACT_APP_QUIZ_TOKEN,
          category,
          difficulty,
          limit,
        },
      });
      
      console.log(response.data);
      
      dispatch({ type: "FETCH_SUCCESS", payload: response.data });
    } catch (error) {
      console.error(error);
      dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
  };
  return (
    <QuizContext.Provider value={{ ...state, fetchQuestions, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);
