import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import NewQuizPage from "./pages/NewQuizPage";
import { EditQuizPage } from "./pages/EditQuizPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/new" element={<NewQuizPage />} />
        <Route path="/edit/:id" element={<EditQuizPage />} />
      </Routes>
    </Router>
  );
};

export default App;
