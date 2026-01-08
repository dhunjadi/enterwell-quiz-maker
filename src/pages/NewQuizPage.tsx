import { getQuestions } from "../services/services";
import { useQuery } from "@tanstack/react-query";

const NewQuizPage = () => {
  const { data } = useQuery({ queryKey: ["questions"], queryFn: getQuestions });

  console.log(data);
  return (
    <div>
      <form>
        <input type="text" />
        <input type="text" />
        <input type="text" />
      </form>
    </div>
  );
};

export default NewQuizPage;
