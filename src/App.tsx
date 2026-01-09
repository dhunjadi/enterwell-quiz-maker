import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import QuizActionsPage from "./pages/QuizActionsPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/new" element={<QuizActionsPage />} />
        <Route path="/edit/:quizId" element={<QuizActionsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
