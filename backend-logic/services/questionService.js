/**
 * QUESTION SERVICE
 * Manages the question bank facts and retrieval.
 */

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

class QuestionService {
  /**
   * Retrieves questions for a specific subject and exam type.
   * Strip out correctIndex for student security during exam taking.
   */
  static getQuestionsForClient(subjectId, examTypeId) {
    const questions = this.getQuestionsWithAnswers(subjectId, examTypeId);
    return questions.map(({ correctIndex, ...clientSafe }) => clientSafe);
  }

  /**
   * Retrieves complete questions with answer keys for evaluation.
   */
  static getQuestionsWithAnswers(subjectId, examTypeId) {
    const key = `${subjectId}-${examTypeId}`;
    return QUESTION_BANK[key] || QUESTION_BANK.default;
  }
}

module.exports = QuestionService;
