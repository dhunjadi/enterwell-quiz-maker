import z from "zod";

export const newQuizValidationSchema = z.object({
  name: z.string().min(1, "Quiz must have a name"),
  questions: z
    .array(
      z.object({
        question: z.string().min(1, "Question cannot be empty"),
        answer: z.string().min(1, "Answer cannot be empty"),
        reuse: z.boolean().optional(),
      })
    )
    .min(1, "Add at least one question"),
});

export type FormFields = z.infer<typeof newQuizValidationSchema>;
