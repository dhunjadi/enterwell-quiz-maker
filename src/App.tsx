import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import QuizActionsPage from "./pages/QuizActionsPage";
import PlayQuizPage from "./pages/PlayQuizPage";
import { appRoutes } from "./data/appRoutes";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path={appRoutes.home} element={<HomePage />} />
        <Route path={appRoutes.new} element={<QuizActionsPage />} />
        <Route
          path={`${appRoutes.edit}/:quizId`}
          element={<QuizActionsPage />}
        />
        <Route path={`${appRoutes.play}/:quizId`} element={<PlayQuizPage />} />
      </Routes>
    </Router>
  );
};

export default App;
