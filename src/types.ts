export type Question = {
  id: string;
  question: string;
  answer: string;
};

export type Quiz = {
  id: string;
  name: string;
  questions: Question[];
};
