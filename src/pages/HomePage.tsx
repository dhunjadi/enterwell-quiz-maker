import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteQuiz, getQuizzes } from "../services/services";
import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["quizzes"], queryFn: getQuizzes });
  const { mutate: dilitaj } = useMutation({
    mutationFn: deleteQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error("Failed to delete quiz", error);
    },
  });

  const handleEdit = (id: number | string) => {
    navigate(`/edit/${id}`);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((quiz) => {
            return (
              <tr key={quiz.id}>
                <td onClick={() => handleEdit(quiz.id)}>{quiz.name}</td>
                <td>
                  <button>Play</button>
                  <button onClick={() => dilitaj(quiz.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button onClick={() => navigate("/new")}>Create new</button>
    </div>
  );
};

export default HomePage;
