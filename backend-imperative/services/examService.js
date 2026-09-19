const Student = require("../models/Student");
const QuestionService = require("./questionService");
const { isDbConnected } = require("../config/db");

// This store keeps the demo usable when MongoDB is unavailable.
const fallbackStudentStore = [];

/**
 * Imperative evaluation:
 * state is created, changed, and returned through an explicit sequence of steps.
 */
function evaluateSubmission(questions, answers) {
  let score = 0;
  const mistakes = [];
  const review = [];

  // Process each question in order and update the result state as we go.
  for (let questionIndex = 0; questionIndex < questions.length; questionIndex += 1) {
    const question = questions[questionIndex];
    let submittedAnswer = null;

    // Search manually for this question's answer instead of using a declarative query.
    for (let answerIndex = 0; answerIndex < answers.length; answerIndex += 1) {
      if (answers[answerIndex].questionId === question.id) {
        submittedAnswer = answers[answerIndex];
        break;
      }
    }

    let givenIndex = null;
    if (submittedAnswer && submittedAnswer.choiceIndex !== undefined) {
      givenIndex = submittedAnswer.choiceIndex;
    }

    // Compare the submitted value with the answer key using explicit control flow.
    const isCorrect = givenIndex === question.correctIndex;
    let yourAnswer = "No answer";
    if (givenIndex !== null && question.choices[givenIndex] !== undefined) {
      yourAnswer = question.choices[givenIndex];
    }

    const reviewItem = {
      question: question.text,
      yourAnswer,
      correctAnswer: question.choices[question.correctIndex],
      isCorrect
    };

    // Mutate the appropriate result collection and score.
    review.push(reviewItem);
    if (isCorrect) {
      score += 1;
    } else {
      mistakes.push(reviewItem);
    }
  }

  return { score, total: questions.length, mistakes, review };
}

async function evaluateAndSave({ name, section, subject, examType, answers }) {
  // Evaluation happens before persistence so the stored score matches the review.
  const questions = QuestionService.getQuestionsWithAnswers(subject, examType);
  const evaluation = evaluateSubmission(questions, answers);
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
    } catch (error) {
      console.warn(`[MongoDB Notice] Write error: ${error.message}. Storing in memory.`);
    }
  }

  if (!savedStudent) {
    // Use a local mutable array as a deliberate fallback when no database exists.
    savedStudent = {
      _id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...studentData,
      createdAt: new Date()
    };
    fallbackStudentStore.push(savedStudent);
  }

  return {
    ...evaluation,
    studentId: savedStudent._id,
    student: savedStudent
  };
}

// Retrieve a persisted result for the printable report endpoint.
async function getStudentById(id) {
  if (isDbConnected()) {
    try {
      const found = await Student.findById(id);
      if (found) {
        return found;
      }
    } catch (error) {
      console.warn(`[MongoDB Notice] Read error: ${error.message}`);
    }
  }

  // Search the fallback records sequentially, matching the imperative style.
  for (let index = 0; index < fallbackStudentStore.length; index += 1) {
    if (String(fallbackStudentStore[index]._id) === String(id)) {
      return fallbackStudentStore[index];
    }
  }

  return null;
}

module.exports = { evaluateSubmission, evaluateAndSave, getStudentById };
