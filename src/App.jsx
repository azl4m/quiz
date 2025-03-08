import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import ResultPage from "./pages/ResultPage";
import QuizSetup from "./components/QuizSetup";
import { QuizProvider } from "./context/QuizContext";
import QuizComponent from "./components/QuizComponent";

function App() {
  return (
    <QuizProvider>
    <div className="max-w-xl mx-auto mt-10">
      <QuizComponent />
    </div>
  </QuizProvider>
    
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<Home />} />
    //     <Route path="/quiz" element={<Quiz />} />
    //     <Route path="/result" element={<ResultPage />} />
    //   </Routes>
    // </Router>
  );
}

export default App;
