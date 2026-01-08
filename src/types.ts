export type Question = {
  id: number | string;
  question: string;
  answer: string;
};

export type Quiz = {
  id: number | string;
  name: string;
  questions: Question[];
};

export type NewQuiz = {
  name: string;
  questions: Omit<Question, "id">[];
};
