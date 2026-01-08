import axios from "axios";
import { API_URL } from "../constants";
import type { NewQuiz, Question, Quiz } from "../types";

export const getQuizzes = async (): Promise<Quiz[]> => {
  const response = await axios.get(`${API_URL}/quizzes`);
  return response.data;
};

export const deleteQuiz = async (id: Quiz["id"]) => {
  const response = await axios.delete(`${API_URL}/quizzes/${id}`);
  return response.data;
};

export const postQuiz = async (data: NewQuiz) => {
  const response = await axios.post(`${API_URL}/quizzes`, data);
  return response.data;
};

export const getQuestions = async (): Promise<Question[]> => {
  const response = await axios.get(`${API_URL}/questions`);
  return response.data;
};
