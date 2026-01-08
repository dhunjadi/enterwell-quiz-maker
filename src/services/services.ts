import axios from "axios";
import { API_URL } from "../constants";
import type { Quiz } from "../types";

export const getQuizzes = async (): Promise<Quiz[]> => {
  const response = await axios.get(`${API_URL}/quizzes`);
  return response.data;
};
