import { z } from "zod";

export const questionSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  question: z.string().min(1, "Question text is required"),
  answer: z.string().min(1, "Answer is required"),
  reuse: z.boolean(),
});

export const newQuizValidationSchema = z.object({
  name: z.string().min(3, "Quiz name must be at least 3 characters"),
  questions: z
    .array(questionSchema)
    .min(1, "At least one question is required"),
});

export type FormFields = z.infer<typeof newQuizValidationSchema>;
