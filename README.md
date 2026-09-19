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
├── backend-imperative/              ✅ BUILT — imperative backend, port 4000
│   ├── server.js                    # Express app, port 4000
│   ├── routes/examRoutes.js         # API routes
│   ├── controllers/                # Request and response handling
│   ├── services/
│   │   ├── questionService.js       # Question retrieval and answer-key protection
│   │   └── examService.js           # for-loops, if/else, and mutable score state
│   ├── config/db.js                 # MongoDB connection setup
│   ├── models/Student.js            # Shared students collection schema
│   ├── test/examService.test.js     # Imperative scoring tests
│   ├── package.json
│   └── .env                         # MONGO_URI
│
├── backend-logic/                   ✅ BUILT — logic backend, port 5000
│   ├── server.js                    # Express app, port 5000
│   ├── routes/examRoutes.js         # API routes
│   ├── logic/
│   │   ├── facts.js                 # Facts: answers and question data
│   │   ├── rules.js                 # Rules for correct and incorrect answers
│   │   └── logicEngine.js           # Unification and backward-chaining engine
│   ├── services/                    # Question and logical evaluation services
│   ├── config/db.js                 # MongoDB connection setup
│   ├── models/Student.js            # Shared students collection schema
│   ├── test/logicEngine.test.js     # Inference-engine tests
│   ├── package.json
│   └── .env                         # MONGO_URI
│
└── README.md                         # this file
```

## Current status

The frontend and both backend implementations are now available. The frontend
can run in mock mode without a database or backend server, or it can call
either backend:

- `frontend/js/config.js` contains the subjects, exam types, time windows,
  backend URL, and `MOCK_MODE` setting.
- When `MOCK_MODE` is `true`, `frontend/js/api.js` uses local mock responses
  from `frontend/js/mockData.js`.
- When `MOCK_MODE` is `false`, the frontend sends requests to the backend
  selected by `API_BASE`.
- Both backends use the same MongoDB database, `LogicalSystem`, and the same
  `students` collection.
- Quiz exams are configured for 30 minutes. Midterms and Finals are configured
  for 1 hour.

The imperative backend demonstrates imperative programming through explicit
step-by-step execution: mutable variables, `for` loops, conditional branches,
and array updates. The logic backend represents answers as facts and deduces
results through rules, unification, and backward-chaining resolution.

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

1. Open a terminal inside `quiz-exam-system/`.
2. Serve the folder (opening `home.html` directly also works, but a local
   server avoids browser file:// quirks):
   ```
   npx serve .
   ```
3. Open `http://localhost:3000/frontend/home.html`.

## Backend setup

1. Create `.env` files in both backend folders. The imperative example can be
   copied with:
   ```
   Copy-Item backend-imperative\.env.example backend-imperative\.env
   ```
   Use the same `MONGO_URI` in both files. Both backends connect to the
   `LogicalSystem` database and the shared `students` collection.
2. Install dependencies:
   ```
   cd backend-imperative && npm install
   cd ..\backend-logic && npm install
   ```
3. Start each backend in its own terminal:
   ```
   cd backend-imperative && npm start   # http://localhost:4000
   cd backend-logic       && npm start   # http://localhost:5000
   ```
   On Windows PowerShell, use `npm.cmd` instead of `npm` if script execution
   is blocked:
   ```
   npm.cmd start
   ```
   Different ports allow both servers to run at the same time; sharing a
   database does not require sharing a server port.
4. In `frontend/js/config.js`, set `MOCK_MODE: false` and set `API_BASE` to
   `http://localhost:4000` for the imperative backend or
   `http://localhost:5000` for the logic backend.
   No other frontend file needs to change — every page already calls
   `API.login()`, `API.getQuestions()`, `API.submitExam()`, and
   `API.downloadResultPdf()`.
5. Serve `frontend/` as in the steps above and use the app as normal.

The backend servers also serve the shared frontend files directly. To test
the imperative backend like the logic backend screenshot, start only
`backend-imperative` and open:

```
http://localhost:4000/home.html
```

In this mode, `frontend/js/config.js` must contain
`API_BASE: "http://localhost:4000"` and `MOCK_MODE: false`. No separate
`npx serve` process is required.

The normal imperative test flow is therefore:

```
cd backend-imperative
npm.cmd start
```

Then open `http://localhost:4000/home.html` in a browser.

## Tests

Run the imperative scoring tests:

```
cd backend-imperative
npm test
```

Run the logic-engine tests:

```
cd backend-logic
npm test
```

## Database fallback

If MongoDB is unavailable, both backends use an in-memory student store so the
application can still be demonstrated. Data in the fallback store is lost when
the corresponding server stops.
