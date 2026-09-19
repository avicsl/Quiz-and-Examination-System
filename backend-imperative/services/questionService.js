const QUESTION_BANK = {
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
      choices: ["MySQL", "MongoDB Atlas", "SQLite", "Firebase"],
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
      text: "Which mechanism resolves queries against Horn clauses in a logic engine?",
      choices: ["Imperative iteration", "Unification and resolution", "Binary search", "Thread pooling"],
      correctIndex: 1
    }
  ]
};

// The answer key remains server-side; clients receive only question content.
// Select a subject/exam-specific bank when one exists; otherwise use the demo bank.
function getQuestionsWithAnswers(subjectId, examTypeId) {
  const key = `${subjectId}-${examTypeId}`;
  return QUESTION_BANK[key] || QUESTION_BANK.default;
}

function getQuestionsForClient(subjectId, examTypeId) {
  const sourceQuestions = getQuestionsWithAnswers(subjectId, examTypeId);
  const clientQuestions = [];

  // Build a separate client array so answer keys never leave the backend.
  for (let index = 0; index < sourceQuestions.length; index += 1) {
    const question = sourceQuestions[index];
    clientQuestions.push({
      id: question.id,
      text: question.text,
      choices: question.choices
    });
  }

  return clientQuestions;
}

module.exports = { getQuestionsForClient, getQuestionsWithAnswers };
