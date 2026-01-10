import { useForm, useFieldArray, useWatch } from "react-hook-form";
import {
  getQuestions,
  getQuizById,
  postQuiz,
  putQuiz,
} from "../services/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { newQuizValidationSchema, type FormFields } from "../data/validations";
import { useLocation, useNavigate, useParams } from "react-router";
import type { Quiz } from "../types";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { appRoutes } from "../data/appRoutes";
import Loader from "../components/Loader";
import { useState } from "react";
import type { AxiosError } from "axios";
import ErrorModal from "../components/ErrorModal";

const QuizActionsPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { quizId } = useParams();
  const isEdit = pathname.includes("edit");

  const [errorText, setErrorText] = useState("");

  const { data: existingQuestions, isFetching: isFetchingExistingQuestions } =
    useQuery({
      queryKey: ["questions"],
      queryFn: getQuestions,
    });

  const { data: quizBeingEdited, isFetching: isFetchingQuiz } = useQuery({
    queryKey: ["quiz-being-edited", quizId],
    queryFn: () => getQuizById(quizId || ""),
    enabled: isEdit && !!quizId,
  });

  const { mutate: createNewQuiz, isError: isCreateError } = useMutation({
    mutationFn: postQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      navigate(appRoutes.home);
    },
    onError: (error: AxiosError) => {
      setErrorText(error.message);
    },
  });

  const { mutate: updateQuiz, isError: isUpdateError } = useMutation({
    mutationFn: ({ id, quiz }: { id: string | number; quiz: Quiz }) =>
      putQuiz(id, quiz),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      navigate(appRoutes.home);
    },
    onError: (error: AxiosError) => {
      setErrorText(error.message);
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

  if (isFetchingExistingQuestions || isFetchingQuiz) return <Loader />;
  if (isCreateError || isUpdateError)
    return (
      <ErrorModal
        open={isCreateError || isUpdateError}
        message={errorText}
        closeText="Back to home page"
        onClose={() => navigate(appRoutes.home)}
      />
    );

  return (
    <Box p={3}>
      <Paper sx={{ p: 3, mx: "auto" }}>
        <Typography variant="h4" gutterBottom>
          {isEdit ? "Edit Quiz" : "Create Quiz"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Quiz name"
            margin="normal"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          {questionsFields.map((field, i) => {
            const isReusing = questions?.[i]?.reuse;

            return (
              <Paper key={field.id} sx={{ p: 2, mt: 2 }} variant="outlined">
                <Typography variant="subtitle1" gutterBottom>
                  Question {i + 1}
                </Typography>

                {isReusing ? (
                  <TextField
                    select
                    fullWidth
                    label="Select existing question"
                    value=""
                    onChange={(e) => {
                      const selected = existingQuestions?.find(
                        (q) => q.id?.toString() === e.target.value.toString()
                      );

                      if (selected) {
                        setValue(`questions.${i}.id`, selected.id);
                        setValue(`questions.${i}.question`, selected.question);
                        setValue(`questions.${i}.answer`, selected.answer);
                        setValue(`questions.${i}.reuse`, false);
                      }
                    }}
                  >
                    {existingQuestions?.map((q) => (
                      <MenuItem key={q.id} value={q.id}>
                        {q.question}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <>
                    <TextField
                      fullWidth
                      label="Question"
                      margin="normal"
                      {...register(`questions.${i}.question`)}
                      error={!!errors.questions?.[i]?.question}
                      helperText={errors.questions?.[i]?.question?.message}
                    />

                    <TextField
                      fullWidth
                      label="Answer"
                      margin="normal"
                      {...register(`questions.${i}.answer`)}
                      error={!!errors.questions?.[i]?.answer}
                      helperText={errors.questions?.[i]?.answer?.message}
                    />
                  </>
                )}

                <FormControlLabel
                  control={<Checkbox {...register(`questions.${i}.reuse`)} />}
                  label="Reuse old question"
                />

                <Box mt={1}>
                  <Button
                    color="error"
                    size="small"
                    onClick={() => removeQuestion(i)}
                  >
                    Remove
                  </Button>
                </Box>
              </Paper>
            );
          })}

          <Box mt={2}>
            <Button
              variant="outlined"
              onClick={() =>
                addQuestion({ question: "", answer: "", reuse: false })
              }
            >
              Add question
            </Button>
          </Box>

          {errors.questions?.message ||
            (errors.questions?.root?.message && (
              <Typography color="error" mt={1}>
                {errors.questions.message || errors.questions?.root?.message}
              </Typography>
            ))}

          <Box mt={4} display="flex" gap={2}>
            <Button
              type="submit"
              variant="contained"
              disabled={questions?.some((q) => q.reuse)}
            >
              {isEdit ? "Update quiz" : "Save quiz"}
            </Button>

            <Button variant="outlined" onClick={() => navigate(appRoutes.home)}>
              Go back
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default QuizActionsPage;
