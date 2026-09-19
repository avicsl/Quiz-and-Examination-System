/**
 * AUTH CONTROLLER
 * Handles student admission and details registration
 */
class AuthController {
  static async login(req, res) {
    try {
      const { name, block, section, subjectId } = req.body;

      if (!name || (!block && !section)) {
        return res.status(400).json({
          ok: false,
          error: "Name and Section (Block) are required."
        });
      }

      // Generate a unique session student identifier for the attempt
      const studentId = "std-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6);

      return res.json({
        ok: true,
        studentId,
        student: {
          name,
          section: section || block,
          subjectId
        }
      });
    } catch (error) {
      console.error("[AuthController Error]", error);
      return res.status(500).json({ ok: false, error: "Internal server error" });
    }
  }
}

module.exports = AuthController;
