/**
 * API
 * Every page calls these functions instead of using fetch() directly.
 * That means swapping CONFIG.API_BASE between the imperative server
 * (:4000) and the logic server (:5000) — or turning MOCK_MODE off —
 * never requires touching the page scripts.
 */
const API = {
  async login(payload) {
    // payload: { name, block, subjectId }
    if (CONFIG.MOCK_MODE) {
      await API._delay();
      return { ok: true, studentId: "mock-" + Date.now() };
    }
    return API._post("/login", payload);
  },

  async getQuestions(subjectId, examTypeId) {
    if (CONFIG.MOCK_MODE) {
      await API._delay();
      return { ok: true, questions: getMockQuestions(subjectId, examTypeId) };
    }
    return API._get("/questions?subject=" + subjectId + "&examType=" + examTypeId);
  },

  async submitExam(payload) {
    // payload: { studentId, subjectId, examTypeId, answers: [{questionId, choiceIndex}] }
    if (CONFIG.MOCK_MODE) {
      await API._delay();
      const questions = getMockQuestions(payload.subjectId, payload.examTypeId);
      const mistakes = [];
      const review = [];
      let correctCount = 0;

      questions.forEach((q) => {
        const given = payload.answers.find((a) => a.questionId === q.id);
        const givenIndex = given && given.choiceIndex != null ? given.choiceIndex : null;
        const isCorrect = givenIndex === q.correctIndex;
        const answerReview = {
          question: q.text,
          yourAnswer: givenIndex === null ? "No answer" : q.choices[givenIndex],
          correctAnswer: q.choices[q.correctIndex],
          isCorrect
        };
        review.push(answerReview);
        if (isCorrect) {
          correctCount++;
        } else {
          mistakes.push(answerReview);
        }
      });

      return {
        ok: true,
        result: {
          score: correctCount,
          total: questions.length,
          mistakes,
          review
        }
      };
    }
    return API._post("/submit-exam", payload);
  },

  async downloadResultPdf(resultId) {
    // In production this hits the backend, which calls
    // shared/pdf/generateReport.js and streams a PDF back.
    if (CONFIG.MOCK_MODE) {
      window.print();
      return { ok: true, mocked: true };
    }
    window.open(CONFIG.API_BASE + "/results/" + resultId + "/pdf", "_blank");
    return { ok: true };
  },

  async _get(path) {
    const res = await fetch(CONFIG.API_BASE + path);
    return res.json();
  },

  async _post(path, body) {
    const res = await fetch(CONFIG.API_BASE + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    return res.json();
  },

  _delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms || 350));
  }
};
