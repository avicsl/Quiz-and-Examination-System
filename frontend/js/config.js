/**
 * CONFIG
 * Central place that decides which backend the frontend talks to.
 * Flip API_BASE to point at whichever engine you're demoing:
 *   http://localhost:4000  -> backend-imperative
 *   http://localhost:5000  -> backend-logic
 * Set MOCK_MODE to false once a real backend is running.
 */
const CONFIG = {
  API_BASE: "http://localhost:4000",
  MOCK_MODE: false,

  SUBJECTS: [
    { id: "first-sub", code: "1 - Course Code", name: "1 - Subject Name" },
    { id: "second-sub", code: "2 - Course Code", name: "2 - Subject Name" },
    { id: "third-sub", code: "3 - Course Code", name: "3 - Subject Name" }
  ],

  // opensAt / closesAt come from MongoDB in the real system (one document
  // per subject + exam type). These defaults just make the demo usable.
  EXAM_TYPES: [
    {
      id: "quiz",
      name: "Quiz",
      opensAt: "2026-01-01T00:00",
      closesAt: "2026-12-31T23:59",
      durationMinutes: 30
    },
    {
      id: "midterms",
      name: "Midterms",
      opensAt: "2026-01-01T00:00",
      closesAt: "2026-12-31T23:59",
      durationMinutes: 60
    },
    {
      id: "finals",
      name: "Finals",
      opensAt: "2026-01-01T00:00",
      closesAt: "2026-12-31T23:59",
      durationMinutes: 60
    }
  ]
};
