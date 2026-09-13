# Quiz & Examination System

A quiz/exam platform built twice on the backend, once in the **imperative**
paradigm and once in the **logic** paradigm, sharing one frontend and one
MongoDB database, so the two implementations can be compared directly.

## Folder structure

```
quiz-exam-system/
│
├── frontend/                        ✅ BUILT — shared frontend, same UI for both paradigms
│   ├── home.html                    # Welcome screen + subject select
│   ├── details.html                 # Name / block entry
│   ├── examtype.html                # Quiz / Midterms / Finals select, with time windows
│   ├── exam.html                    # Question-by-question exam taking screen
│   ├── result.html                  # Score, mistakes, name + "Download PDF" button
│   ├── css/
│   │   └── styles.css               # Shared design system
│   └── js/
│       ├── config.js                # API base URL + MOCK_MODE switch, subjects, exam types
│       ├── store.js                 # sessionStorage wrapper, shared session across pages
│       ├── api.js                   # All backend calls go through here (mock or real)
│       ├── ui.js                    # Shared DOM/formatting helpers
│       ├── mockData.js              # Sample questions used only while MOCK_MODE is true
│       └── pages/                   # One script per HTML page
│           ├── welcome.js
│           ├── login.js
│           ├── examtype.js
│           ├── exam.js
│           └── result.js
│
├── backend-imperative/               🔲 NOT BUILD YET — imperative backend, port 4000
│   ├── server.js                     # Express app, port 4000
│   ├── routes/
│   │   └── examRoutes.js
│   ├── controllers/
│   │   └── examController.js         # for-loops, if/else, mutates score directly
│   ├── package.json
│   └── .env                          # MONGO_URI
│
├── backend-logic/                    🔲 NOT BUILD YET — logic backend, port 5000
│   ├── server.js                     # Express app, port 5000
│   ├── routes/
│   │   └── examRoutes.js
│   ├── rules/
│   │   ├── facts.js                  # facts: answers given, time windows, prerequisites
│   │   └── rules.js                  # rules: isCorrect, canTakeExam, computeGrade
│   ├── engine/
│   │   └── inferenceEngine.js        # matches facts against rules (or tau-prolog wrapper)
│   ├── package.json
│   └── .env                          # MONGO_URI
│
├── shared/                           🔲 NOT BUILT YET — code both servers import, never duplicated
│   ├── db.js                         # mongoose connection setup
│   ├── models/
│   │   ├── Student.js                # name, block
│   │   ├── Question.js               # subject, text, choices, correct answer
│   │   └── Result.js                 # student, subject, examType, score, mistakes, timestamp
│   └── pdf/
│       └── generateReport.js         # pdfkit — builds the score/mistakes PDF for result.html
│
└── README.md                         # this file
```

## Current status

The working part of the project is currently `frontend/`. The two backend
folders are planned but have not been created yet. The frontend runs in mock
mode without a database or backend server:

- `frontend/js/config.js` contains the subjects, exam types, time windows,
   backend URL, and `MOCK_MODE` setting.
- When `MOCK_MODE` is `true`, `frontend/js/api.js` uses local mock responses
   from `frontend/js/mockData.js`.
- The complete flow is available: choose a subject, enter student details,
   choose an exam type, answer every question, submit the exam, and review or
   print the result.
- Quiz exams are configured for 30 minutes. Midterms and Finals are configured
   for 1 hour.

## Frontend pages

| Page | File | Purpose |
| --- | --- | --- |
| Home | `frontend/home.html` | Select a subject |
| Details | `frontend/details.html` | Enter the student name and block |
| Exam type | `frontend/examtype.html` | Select an available exam type |
| Exam | `frontend/exam.html` | Answer questions and submit the attempt |
| Result | `frontend/result.html` | View the score and answer review |

The normal starting page is `home.html`. All page links are relative to the
`frontend/` directory.

## How to run this patch (frontend only, mock mode)

1. Open a terminal inside `quiz-exam-system/frontend/`.
2. Serve the folder (opening `home.html` directly also works, but a local
   server avoids browser file:// quirks):
   ```
   npx serve .
   ```
3. Open `http://localhost:3000/frontend/home.html`. 
## Backend setup when implemented

1. Set `MONGO_URI` in `backend-imperative/.env` and `backend-logic/.env`
   (same database for both — either local `mongod` or a MongoDB Atlas
   connection string).
2. Start each backend in its own terminal:
   ```
   cd backend-imperative && npm install && npm start   # http://localhost:4000
   cd backend-logic       && npm install && npm start   # http://localhost:5000
   ```
3. In `frontend/js/config.js`, set `MOCK_MODE: false` and set `API_BASE` to
   `http://localhost:4000` for the imperative backend or
   `http://localhost:5000` for the logic backend.
   No other frontend file needs to change — every page already calls
   `API.login()`, `API.getQuestions()`, `API.submitExam()`, and
   `API.downloadResultPdf()`, which forward to the real endpoints once mock
   mode is off.
4. Serve `frontend/` as in the steps above and use the app as normal — data
   now round-trips through the real backend and MongoDB, and the "Download
   PDF" button calls `shared/pdf/generateReport.js` instead of printing.

## Next steps

- Build `shared/db.js`, `shared/models/`, and `shared/pdf/generateReport.js`.
- Build `backend-imperative/` with loop and conditional-based exam logic.
- Build `backend-logic/` with facts, rules, and inference-based exam logic.