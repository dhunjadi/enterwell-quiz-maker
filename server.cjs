const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post("/quizzes", (req, res) => {
  const db = router.db;
  const quiz = req.body;

  const questions = quiz.questions ?? [];

  const createdQuiz = db.get("quizzes").insert(quiz).write();

  questions.forEach((q) => {
    db.get("questions")
      .insert({
        ...q,
      })
      .write();
  });

  res.status(201).json(createdQuiz);
});

server.post("/questions", (_req, res) => {
  res.status(405).json({ message: "POST /questions is not allowed" });
});

server.use(router);

server.listen(4000, () => {
  console.log("JSON Server running on port 4000");
});
