import { useQuery } from "@tanstack/react-query";
import { getQuizzes } from "./services/services";

function App() {
  const { data } = useQuery({ queryKey: ["quizzes"], queryFn: getQuizzes });

  return <h1>{data?.map((quiz) => quiz.name)}</h1>;
}

export default App;
