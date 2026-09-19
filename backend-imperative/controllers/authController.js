// Validate the student's admission details and create an attempt identifier.
function login(req, res) {
  const { name, block, section, subjectId } = req.body;
  // The frontend historically calls this value "block"; the API stores it as section.
  const studentSection = section || block;

  // Guard clauses stop invalid input before a student session is created.
  if (!name || !studentSection) {
    return res.status(400).json({
      ok: false,
      error: "Name and Section (Block) are required."
    });
  }

  // The identifier is used by the frontend while the student completes an exam.
  const studentId = `std-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  return res.json({
    ok: true,
    studentId,
    student: { name, section: studentSection, subjectId }
  });
}

module.exports = { login };
