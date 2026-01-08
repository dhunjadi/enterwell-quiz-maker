import { useParams } from "react-router";

export const EditQuizPage = () => {
  const { id } = useParams();
  return <div>EditQuizPage {id}</div>;
};
