const ExamService = require("../services/examService");
const QuestionService = require("../services/questionService");

// Return only questions that are safe for the browser to receive.
function getQuestions(req, res) {
  // Defaults keep the endpoint usable even when query parameters are omitted.
  const subject = req.query.subject || "first-sub";
  const examType = req.query.examType || "quiz";
  return res.json({
    ok: true,
    questions: QuestionService.getQuestionsForClient(subject, examType)
  });
}

// Convert the HTTP payload into the service's normalized input shape.
async function submitExam(req, res) {
  try {
    const body = req.body;
    // Normalize both frontend naming conventions before calling the service.
    const subject = body.subject || body.subjectId || "General";
    const examType = body.examType || body.examTypeId || "quiz";
    const section = body.section || body.block || "COM232";
    const answers = Array.isArray(body.answers) ? body.answers : [];

    const result = await ExamService.evaluateAndSave({
      name: body.name || "Student",
      section,
      subject,
      examType,
      answers,
      studentId: body.studentId
    });

    return res.json({ ok: true, result });
  } catch (error) {
    console.error("[Imperative submitExam Error]", error);
    return res.status(500).json({ ok: false, error: "Failed to evaluate exam" });
  }
}

async function getResultPdf(req, res) {
  try {
    // The report is printable HTML, allowing the browser to save it as a PDF.
    const student = await ExamService.getStudentById(req.params.id);
    if (!student) {
      return res.status(404).send("Report not found");
    }

    res.setHeader("Content-Type", "text/html");
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Score Report - ${student.name}</title></head>
      <body onload="window.print()">
        <h1>National University - Examination Report</h1>
        <p><strong>Student Name:</strong> ${student.name}</p>
        <p><strong>Section / Block:</strong> ${student.section}</p>
        <p><strong>Subject:</strong> ${student.subject}</p>
        <p><strong>Exam Type:</strong> ${student.examType}</p>
        <p><strong>Score:</strong> ${student.score}</p>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("[Imperative getResultPdf Error]", error);
    return res.status(500).send("Error generating report");
  }
}

module.exports = { getQuestions, submitExam, getResultPdf };
