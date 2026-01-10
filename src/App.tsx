import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import QuizActionsPage from "./pages/QuizActionsPage";
import PlayQuizPage from "./pages/PlayQuizPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/new" element={<QuizActionsPage />} />
        <Route path="/edit/:quizId" element={<QuizActionsPage />} />
        <Route path="/play/:quizId" element={<PlayQuizPage />} />
      </Routes>
    </Router>
  );
};

export default App;
