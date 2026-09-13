/**
 * MOCK_QUESTIONS
 * Stand-in for the /questions endpoint so the frontend is fully clickable
 * before either backend (imperative or logic) is wired up. Keyed by
 * "<subjectId>-<examTypeId>". Replace with real data from MongoDB once
 * backend-imperative / backend-logic are running and MOCK_MODE is false.
 */
const MOCK_QUESTIONS = {
  default: [
    {
      id: "q1",
      text: "Which loop structure explicitly tracks its own counter in imperative code?",
      choices: ["for loop", "unification", "fact base", "backtracking"],
      correctIndex: 0
    },
    {
      id: "q2",
      text: "In the logic paradigm, a program is mainly made up of:",
      choices: ["Sequential steps", "Facts and rules", "Class hierarchies", "Event listeners"],
      correctIndex: 1
    },
    {
      id: "q3",
      text: "Which database is used to store students and scores in this system?",
      choices: ["MySQL", "MongoDB", "SQLite", "Firebase"],
      correctIndex: 1
    },
    {
      id: "q4",
      text: "What does 'declarative' mean in a logic program?",
      choices: [
        "You state what is true, not how to compute it",
        "You write explicit for-loops",
        "You mutate global variables",
        "You define classes and objects"
      ],
      correctIndex: 0
    },
    {
      id: "q5",
      text: "Which file in this project is responsible for generating the score PDF?",
      choices: ["config.js", "store.js", "generateReport.js", "styles.css"],
      correctIndex: 2
    }
  ]
};

function getMockQuestions(subjectId, examTypeId) {
  const key = subjectId + "-" + examTypeId;
  return MOCK_QUESTIONS[key] || MOCK_QUESTIONS.default;
}
