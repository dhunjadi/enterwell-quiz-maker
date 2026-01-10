import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { deleteQuiz, getQuizzes } from "../services/services";
import { appRoutes } from "../data/appRoutes";
import Loader from "../components/Loader";
import { useState } from "react";
import type { AxiosError } from "axios";
import ErrorModal from "../components/ErrorModal";
import { useQuizContext } from "../hooks/useQuizContext";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const HomePage = () => {
  const navigate = useNavigate();
  const { setCurrentQuestionIndex } = useQuizContext();
  const queryClient = useQueryClient();

  const {
    data,
    isFetching,
    isError: isFetchingQuizzesError,
    error,
  } = useQuery({
    queryKey: ["quizzes"],
    queryFn: getQuizzes,
  });

  const {
    mutate: deleteQuizMutation,
    isError: isDeletingQuizError,
    isPending: isDeleting,
  } = useMutation({
    mutationFn: deleteQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      setSelectedQuizId(null);
    },
    onError: (error: AxiosError) => {
      setErrorText(error.message);
      setSelectedQuizId(null);
    },
  });

  const [errorText, setErrorText] = useState("");
  const [selectedQuizId, setSelectedQuizId] = useState<number | string | null>(
    null
  );
  const quizToBeDeleted = data?.find((q) => q.id === selectedQuizId)?.name;

  const handleEdit = (id: number | string) => {
    navigate(`${appRoutes.edit}/${id}`);
  };

  const handlePlay = (id: string | number) => {
    setCurrentQuestionIndex(0);
    navigate(`${appRoutes.play}/${id}`);
  };

  const handleDeleteClick = (id: number | string) => {
    setSelectedQuizId(id);
  };

  const handleConfirmDelete = () => {
    if (selectedQuizId) {
      deleteQuizMutation(selectedQuizId);
    }
  };

  if (isFetching) return <Loader />;
  if (isDeletingQuizError || isFetchingQuizzesError)
    return (
      <ErrorModal
        open={isDeletingQuizError || isFetchingQuizzesError}
        message={errorText || error?.message}
        closeText="Try again"
        onClose={() => navigate(0)}
      />
    );

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Enterwell Quiz Maker
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.map((quiz) => (
              <TableRow key={quiz.id} hover>
                <TableCell
                  sx={{ cursor: "pointer", color: "primary.main" }}
                  onClick={() => handleEdit(quiz.id)}
                >
                  {quiz.name}
                </TableCell>

                <TableCell>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ mr: 1 }}
                    onClick={() => handlePlay(quiz.id)}
                  >
                    Play
                  </Button>

                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteClick(quiz.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(appRoutes.new)}
        >
          Create new quiz
        </Button>
      </Box>

      <ConfirmDeleteModal
        open={selectedQuizId !== null}
        title={`Delete ${quizToBeDeleted}?`}
        description={`Are you sure you want to delete ${quizToBeDeleted}? This action cannot be undone.`}
        isLoading={isDeleting}
        onClose={() => setSelectedQuizId(null)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default HomePage;
