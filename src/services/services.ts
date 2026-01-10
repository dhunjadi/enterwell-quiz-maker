import axios from "axios";
import { API_URL } from "../data/constants";
import type { NewQuiz, Question, Quiz } from "../types";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getQuizzes = async (): Promise<Quiz[]> => {
  const response = await api.get(`${API_URL}/quizzes`);
  return response.data;
};

export const getQuizById = async (id: string | number): Promise<Quiz> => {
  const response = await api.get(`${API_URL}/quizzes/${id}`);
  return response.data;
};

export const putQuiz = async (id: string | number, quiz: Quiz) => {
  const response = await api.put(`${API_URL}/quizzes/${id}`, quiz);
  return response.data;
};

export const deleteQuiz = async (id: Quiz["id"]) => {
  const response = await api.delete(`${API_URL}/quizzes/${id}`);
  return response.data;
};

export const postQuiz = async (data: NewQuiz) => {
  const response = await api.post(`${API_URL}/quizzes`, data);
  return response.data;
};

export const getQuestions = async (): Promise<Question[]> => {
  const response = await api.get(`${API_URL}/questions`);
  return response.data;
};
