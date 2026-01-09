import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { getQuestions, postQuiz } from "../services/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { newQuizValidationSchema, type FormFields } from "../../validations";
import { useNavigate } from "react-router";

const NewQuizPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: existingQuestions } = useQuery({
    queryKey: ["questions"],
    queryFn: getQuestions,
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

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(newQuizValidationSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      questions: [],
    },
  });

  const questions = useWatch({
    control,
    name: "questions",
    defaultValue: [],
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
    const dataToSubmit = {
      ...data,
      questions: data.questions.map(({ reuse: _, ...rest }) => rest),
    };

    createNewQuiz(dataToSubmit);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="Quiz name" {...register("name")} />
        {errors.name?.message && <p>{errors.name.message}</p>}

        {questionsFields.map((field, i) => {
          const question = questions[i];

          return (
            <div key={field.id}>
              {question?.reuse ? (
                <select
                  value=""
                  onChange={(e) => {
                    const usedQuestion = existingQuestions?.find(
                      (question) => question.id.toString() === e.target.value
                    );

                    setValue(
                      `questions.${i}.question`,
                      usedQuestion?.question ?? ""
                    );
                    setValue(
                      `questions.${i}.answer`,
                      usedQuestion?.answer ?? ""
                    );
                    setValue(`questions.${i}.reuse`, false);
                  }}
                >
                  <option value="">Select existing question</option>
                  {existingQuestions?.map((question) => (
                    <option key={question.id} value={question.id}>
                      {question.question}
                    </option>
                  ))}
                </select>
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

        <button disabled={questions.some((q) => q.reuse)} type="submit">
          Create new quiz
        </button>
      </form>
    </div>
  );
};

export default NewQuizPage;
