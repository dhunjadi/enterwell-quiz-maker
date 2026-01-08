import { useForm, useFieldArray } from "react-hook-form";
import { getQuestions, postQuiz } from "../services/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { newQuizValidationSchema, type FormFields } from "../../validations";
import { useNavigate } from "react-router";

const NewQuizPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data } = useQuery({ queryKey: ["questions"], queryFn: getQuestions });

  const { mutate: createNewQuiz } = useMutation({
    mutationFn: postQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
    onError: (error) => {
      console.error("Failed to delete quiz", error);
    },
  });

  console.log(data);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(newQuizValidationSchema),
  });

  const {
    fields: questionsFields,
    append: addQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "questions",
  });

  console.log(errors);

  const onSubmit = (data: FormFields) => {
    console.log(data);
    createNewQuiz(data);
    navigate("/");
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="Quiz name" {...register("name")} />
        {errors.name?.message && <p>{errors.name.message}</p>}
        {questionsFields.map((question, i) => (
          <div key={question.id}>
            <input
              type="text"
              placeholder={`Question ${i + 1}`}
              {...register(`questions.${i}.question` as const)}
            />
            {errors.questions?.[i]?.question?.message && (
              <p>{errors.questions?.[i]?.question.message}</p>
            )}

            <input
              type="text"
              placeholder={`Answer ${i + 1}`}
              {...register(`questions.${i}.answer` as const)}
            />
            {errors.questions?.[i]?.answer?.message && (
              <p>{errors.questions?.[i]?.answer.message}</p>
            )}

            <button type="button" onClick={() => removeQuestion(i)}>
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => addQuestion({ question: "", answer: "" })}
        >
          Add question
        </button>

        {errors.questions?.message && <p>{errors.questions?.message}</p>}

        <button type="submit">Create new quiz</button>
      </form>
    </div>
  );
};

export default NewQuizPage;
