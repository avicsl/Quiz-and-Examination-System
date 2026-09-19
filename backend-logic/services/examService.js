const Student = require("../models/Student");
const QuestionService = require("./questionService");
const { isDbConnected } = require("../config/db");
const { KnowledgeBase } = require("../logic/logicEngine");
const { assertQuestionFacts, assertSubmissionFacts } = require("../logic/facts");
const { setupEvaluationRules, deduceEvaluation } = require("../logic/rules");

// In-memory student store fallback
const fallbackStudentStore = [];

class ExamService {
  /**
   * Evaluates student submission using the Logical Programming Paradigm,
   * stores the record in MongoDB Atlas (LogicalSystem.students),
   * and returns the deduced score and review.
   */
  static async evaluateAndSave({ name, section, subject, examType, answers, studentId }) {
    // 1. Retrieve questions for domain knowledge
    const questions = QuestionService.getQuestionsWithAnswers(subject, examType);

    // 2. Instantiate Knowledge Base
    const kb = new KnowledgeBase();

    // 3. Assert Horn Clauses / Deduction Rules
    setupEvaluationRules(kb);

    // 4. Assert Domain Facts (Question keys & Student answers)
    assertQuestionFacts(kb, questions);
    assertSubmissionFacts(kb, studentId, answers);

    // 5. Deduce Evaluation via Backward-Chaining Resolution (Pure Logic Paradigm)
    const evaluation = deduceEvaluation(kb, studentId, questions);

    // 6. Persist Student Document to MongoDB Atlas
    // Target Database: LogicalSystem | Target Collection: students
    const studentData = {
      name: name || "Student",
      section: section || "N/A",
      subject: subject || "General",
      examType: examType || "quiz",
      score: evaluation.score
    };

    let savedStudent = null;

    if (isDbConnected()) {
      try {
        savedStudent = await Student.create(studentData);
        console.log(`[MongoDB Atlas] Successfully saved student document to LogicalSystem.students:`, savedStudent._id);
      } catch (dbErr) {
        console.warn(`[MongoDB Notice] Write error: ${dbErr.message}. Storing in memory.`);
      }
    }

    if (!savedStudent) {
      savedStudent = {
        _id: "rec-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
        ...studentData,
        createdAt: new Date()
      };
      fallbackStudentStore.push(savedStudent);
    }

    return {
      score: evaluation.score,
      total: evaluation.total,
      mistakes: evaluation.mistakes,
      review: evaluation.review,
      studentId: savedStudent._id,
      student: savedStudent
    };
  }

  /**
   * Retrieves student by ID for reporting
   */
  static async getStudentById(id) {
    if (isDbConnected()) {
      try {
        const found = await Student.findById(id);
        if (found) return found;
      } catch {
        // Fall through
      }
    }
    return fallbackStudentStore.find((s) => String(s._id) === String(id)) || null;
  }
}

module.exports = ExamService;
