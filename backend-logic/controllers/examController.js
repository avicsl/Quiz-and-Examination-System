const QuestionService = require("../services/questionService");
const ExamService = require("../services/examService");

/**
 * EXAM CONTROLLER
 * Handles question delivery and exam submissions
 */
class ExamController {
  /**
   * GET /questions?subject=:subject&examType=:examType
   */
  static async getQuestions(req, res) {
    try {
      const subject = req.query.subject || "first-sub";
      const examType = req.query.examType || "quiz";

      const questions = QuestionService.getQuestionsForClient(subject, examType);
      return res.json({
        ok: true,
        questions
      });
    } catch (error) {
      console.error("[ExamController getQuestions Error]", error);
      return res.status(500).json({ ok: false, error: "Failed to load questions" });
    }
  }

  /**
   * POST /submit-exam
   */
  static async submitExam(req, res) {
    try {
      const {
        studentId,
        name,
        section,
        block,
        subjectId,
        subject,
        examTypeId,
        examType,
        answers
      } = req.body;

      const submissionSubject = subject || subjectId || "General";
      const submissionExamType = examType || examTypeId || "quiz";
      const submissionSection = section || block || "COM232";
      const studentIdentifier = studentId || "std-" + Date.now();

      // Delegate to the Logic Engine Service
      const result = await ExamService.evaluateAndSave({
        name: name || "Student",
        section: submissionSection,
        subject: submissionSubject,
        examType: submissionExamType,
        answers: Array.isArray(answers) ? answers : [],
        studentId: studentIdentifier
      });

      return res.json({
        ok: true,
        result
      });
    } catch (error) {
      console.error("[ExamController submitExam Error]", error);
      return res.status(500).json({ ok: false, error: "Failed to evaluate exam" });
    }
  }

  /**
   * GET /results/:id/pdf
   */
  static async getResultPdf(req, res) {
    try {
      const student = await ExamService.getStudentById(req.params.id);
      if (!student) {
        return res.status(404).send("Report not found");
      }

      // Printable HTML report that the browser can render/save as PDF
      res.setHeader("Content-Type", "text/html");
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Score Report - ${student.name}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #1e293b; }
            .card { border: 2px solid #0f172a; padding: 24px; border-radius: 8px; max-width: 600px; margin: auto; }
            h1 { margin-top: 0; color: #0284c7; }
            .field { margin: 12px 0; font-size: 16px; }
            .score { font-size: 32px; font-weight: bold; color: #059669; }
          </style>
        </head>
        <body onload="window.print()">
          <div class="card">
            <h1>National University - Examination Report</h1>
            <div class="field"><strong>Student Name:</strong> ${student.name}</div>
            <div class="field"><strong>Section / Block:</strong> ${student.section}</div>
            <div class="field"><strong>Subject:</strong> ${student.subject}</div>
            <div class="field"><strong>Exam Type:</strong> ${student.examType}</div>
            <div class="field"><strong>Deductive Score:</strong> <span class="score">${student.score}</span></div>
          </div>
        </body>
        </html>
      `);
    } catch (error) {
      console.error("[ExamController getResultPdf Error]", error);
      return res.status(500).send("Error generating report");
    }
  }
}

module.exports = ExamController;
