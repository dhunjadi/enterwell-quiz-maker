const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Finds the question by Id and updates "question" and "answer" fields if changed while editing
// or inserts a new question in the db
const updateAndInsertQuestions = (db, questions) => {
  return questions.map((q) => {
    if (q.id) {
      db.get("questions")
        .find({ id: q.id })
        .assign({ question: q.question, answer: q.answer })
        .write();

      return db.get("questions").find({ id: q.id }).value();
    } else {
      return db.get("questions").insert(q).write();
    }
  });
};

// Create a new quiz
server.post("/quizzes", (req, res) => {
  const db = router.db;
  const { name, questions = [] } = req.body;

  const processedQuestions = updateAndInsertQuestions(db, questions);

  const createdQuiz = db
    .get("quizzes")
    .insert({ name, questions: processedQuestions })
    .write();

  res.status(201).json(createdQuiz);
});

// Update quiz
server.put("/quizzes/:id", (req, res) => {
  const db = router.db;
  const { id } = req.params;
  const { name, questions = [] } = req.body;

  const lookupId = isNaN(id) ? id : Number(id);

  const processedQuestions = updateAndInsertQuestions(db, questions);

  const updatedQuiz = db
    .get("quizzes")
    .find({ id: lookupId })
    .assign({ name, questions: processedQuestions })
    .write();

  if (updatedQuiz) {
    res.json(updatedQuiz);
  } else {
    res.status(404).json({ message: "Quiz not found" });
  }
});

server.post("/questions", (_req, res) => {
  res.status(405).json({
    message:
      "Direct POST to /questions is not allowed. Create questions via /quizzes.",
  });
});

server.use(router);

server.listen(4000, () => {
  console.log("JSON Server running on port 4000");
});
