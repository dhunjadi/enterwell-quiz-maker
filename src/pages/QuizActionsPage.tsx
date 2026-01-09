import { useForm, useFieldArray, useWatch } from "react-hook-form";
import {
  getQuestions,
  getQuizById,
  postQuiz,
  putQuiz,
} from "../services/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { newQuizValidationSchema, type FormFields } from "../../validations";
import { useLocation, useNavigate, useParams } from "react-router";
import type { Quiz } from "../types";

const QuizActionsPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { quizId } = useParams();
  const isEdit = pathname.includes("edit");

  const { data: existingQuestions } = useQuery({
    queryKey: ["questions"],
    queryFn: getQuestions,
  });

  const { data: quizBeingEdited } = useQuery({
    queryKey: ["quiz-being-edited", quizId],
    queryFn: () => getQuizById(quizId || ""),
    enabled: isEdit && !!quizId,
  });

  const { mutate: createNewQuiz } = useMutation({
    mutationFn: postQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      navigate("/");
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error("Failed to create quiz", error);
    },
  });

  const { mutate: updateQuiz } = useMutation({
    mutationFn: ({ id, quiz }: { id: string | number; quiz: Quiz }) =>
      putQuiz(id, quiz),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      navigate("/");
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error("Failed to update quiz", error);
    },
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(newQuizValidationSchema),
    mode: "onTouched",
    values:
      isEdit && quizBeingEdited
        ? {
            name: quizBeingEdited.name,
            questions: quizBeingEdited.questions.map((q) => ({
              ...q,
              reuse: false,
            })),
          }
        : undefined,
    defaultValues: {
      name: "",
      questions: [],
    },
  });

  const questions = useWatch({
    control,
    name: "questions",
  });

  const {
    fields: questionsFields,
    append: addQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "questions",
  });

  const onSubmit = (data: FormFields) => {
    const questionsToSubmit = data.questions.map((q) => ({
      ...(q.id ? { id: q.id } : {}),
      question: q.question,
      answer: q.answer,
    }));

    const dataToSubmit = {
      name: data.name,
      questions: questionsToSubmit,
    };

    if (isEdit && quizId) {
      updateQuiz({
        id: quizId,
        quiz: { ...dataToSubmit, id: quizId },
      });
    } else {
      createNewQuiz(dataToSubmit);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input type="text" placeholder="Quiz name" {...register("name")} />
          {errors.name?.message && <p>{errors.name.message}</p>}
        </div>

        {questionsFields.map((field, i) => {
          const isReusing = questions?.[i]?.reuse;

          return (
            <div key={field.id}>
              {isReusing ? (
                <div>
                  <label>Select an existing question:</label>
                  <select
                    value=""
                    onChange={(e) => {
                      const selected = existingQuestions?.find(
                        (q) => q.id?.toString() === e.target.value
                      );

                      if (selected) {
                        setValue(`questions.${i}.id`, selected.id);
                        setValue(`questions.${i}.question`, selected.question);
                        setValue(`questions.${i}.answer`, selected.answer);
                        setValue(`questions.${i}.reuse`, false);
                      }
                    }}
                  >
                    <option value="">Select existing question</option>
                    {existingQuestions?.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.question}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder={`Question ${i + 1}`}
                    {...register(`questions.${i}.question`)}
                  />
                  {errors.questions?.[i]?.question?.message && (
                    <p>{errors.questions[i]?.question?.message}</p>
                  )}

                  <input
                    type="text"
                    placeholder={`Answer ${i + 1}`}
                    {...register(`questions.${i}.answer`)}
                  />
                  {errors.questions?.[i]?.answer?.message && (
                    <p>{errors.questions[i]?.answer?.message}</p>
                  )}
                </>
              )}

              <label>
                <input type="checkbox" {...register(`questions.${i}.reuse`)} />
                Reuse old question
              </label>

              <button type="button" onClick={() => removeQuestion(i)}>
                Remove
              </button>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() =>
            addQuestion({ question: "", answer: "", reuse: false })
          }
        >
          Add question
        </button>

        {errors.questions?.message && <p>{errors.questions.message}</p>}

        <button disabled={questions?.some((q) => q.reuse)} type="submit">
          {isEdit ? "Update quiz" : "Save quiz"}
        </button>
      </form>

      <button onClick={() => navigate("/")} type="button">
        Go back
      </button>
    </div>
  );
};

export default QuizActionsPage;
