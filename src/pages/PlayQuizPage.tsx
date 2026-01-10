import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { getQuizById } from "../services/services";
import { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Box,
} from "@mui/material";
import { appRoutes } from "../data/appRoutes";
import Loader from "../components/Loader";
import ErrorModal from "../components/ErrorModal";

const PlayQuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const {
    data: quizBeingPlayed,
    isFetching,
    isError: isFetchingQuizError,
    error,
  } = useQuery({
    queryKey: ["quiz-being-played", quizId],
    queryFn: () => getQuizById(quizId || ""),
    enabled: !!quizId,
  });

  const handleNextQuestion = () => {
    setShowAnswer(false);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handlePreviousQuestion = () => {
    setShowAnswer(false);
    setCurrentQuestionIndex((prev) => prev - 1);
  };

  const question = quizBeingPlayed?.questions[currentQuestionIndex];

  if (isFetching) return <Loader />;

  if (isFetchingQuizError)
    return (
      <ErrorModal
        open={isFetchingQuizError}
        message={error?.message}
        closeText="Back to Home"
        onClose={() => navigate(appRoutes.home)}
      />
    );

  return (
    <Container sx={{ mt: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h3" align="center">
          {quizBeingPlayed?.name}
        </Typography>

        {question && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Question {currentQuestionIndex + 1}
              </Typography>

              <Typography variant="body1" sx={{ mb: 2 }}>
                {question.question}
              </Typography>

              {showAnswer && (
                <Box sx={{ mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
                  <Typography variant="subtitle1" color="primary">
                    Answer
                  </Typography>
                  <Typography variant="body2">{question.answer}</Typography>
                </Box>
              )}

              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => setShowAnswer((prev) => !prev)}
              >
                {showAnswer ? "Hide answer" : "Show answer"}
              </Button>
            </CardContent>
          </Card>
        )}

        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Stack direction={"row"} spacing={2}>
            <Button
              variant="contained"
              disabled={currentQuestionIndex === 0}
              onClick={handlePreviousQuestion}
            >
              Previous
            </Button>

            <Button
              variant="contained"
              disabled={
                currentQuestionIndex + 1 === quizBeingPlayed?.questions.length
              }
              onClick={handleNextQuestion}
            >
              Next
            </Button>
          </Stack>
          <Button
            variant="contained"
            color="warning"
            size="small"
            onClick={() => navigate(appRoutes.home)}
          >
            Back to Home
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default PlayQuizPage;
