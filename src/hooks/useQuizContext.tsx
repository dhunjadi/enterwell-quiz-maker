import { useContext } from "react";
import { QuizContext } from "../context/QuizContext";

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("Context not found");
  }
  return context;
};
