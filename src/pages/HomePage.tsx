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

const HomePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [errorText, setErrorText] = useState("");

  const { data, isFetching } = useQuery({
    queryKey: ["quizzes"],
    queryFn: getQuizzes,
  });

  const { mutate: deleteQuizMutation, isError } = useMutation({
    mutationFn: deleteQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
    onError: (error: AxiosError) => {
      setErrorText(error.message);
    },
  });

  const handleEdit = (id: number | string) => {
    navigate(`${appRoutes.edit}/${id}`);
  };

  if (isFetching) return <Loader />;
  if (isError)
    return (
      <ErrorModal
        open={isError}
        message={errorText}
        closeText="Try again"
        onClose={() => navigate(0)}
      />
    );

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Enterwell Quizzes
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
                    onClick={() => navigate(`${appRoutes.play}/${quiz.id}`)}
                  >
                    Play
                  </Button>

                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => deleteQuizMutation(quiz.id)}
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
          Create new
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
