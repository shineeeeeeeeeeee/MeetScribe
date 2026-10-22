# MeetScribe

MeetScribe is a full-stack internship portal platform that connects students with internship opportunities. It features a React + Vite frontend, a Node.js + Express backend with MongoDB, and an AI-powered chatbot for internship guidance.

---

## Project Structure

```
MeetScribe/
├── backend/              # Node.js Express API server
│   ├── config/           # Database configuration
│   ├── controllers/      # Route handlers (auth, jobs, applications, etc.)
│   ├── middleware/       # Auth middleware & file upload setup
│   ├── models/           # Mongoose schemas (User, Job, Application)
│   ├── routes/           # Express route definitions
│   ├── .env              # Backend environment variables
│   ├── server.js         # Main server entry point
│   ├── resume_analyzer.js # AI resume scoring & review engine
│   └── package.json
├── frontend/             # React + Vite SPA
│   ├── src/
│   │   ├── components/   # Reusable UI components (Chatbot, Cards, Forms)
│   │   ├── pages/        # Page-level components (Home, Dashboard, Profile)
│   │   ├── assets/       # Logos and static images
│   │   ├── App.jsx       # Main router & route definitions
│   │   └── main.jsx      # React entry point
│   ├── .env              # Frontend environment variables
│   └── package.json
├── chatbot/              # AI chatbot microservice (Flask)
│   ├── api/              # Chatbot API, recommendation engine, semantic search
│   ├── training/         # Intent model training scripts
│   ├── dataset/          # Training data (intents & FAQ)
│   ├── models/           # Trained ML model artifacts (.pkl files)
│   ├── requirements.txt  # Python dependencies
│   └── .venv/            # Python virtual environment
├── .gitignore
├── package.json          # Root workspace config (npm workspaces)
└── package-lock.json
```

---

## Tech Stack

### Frontend
- **React 19** — UI library
- **Vite** — Build tool & dev server
- **React Router DOM v7** — Client-side routing
- **Axios** — HTTP client for API calls
- **Lucide React** — Icon library
- **CSS** — Custom stylesheets per component/page

### Backend
- **Node.js + Express** — Server runtime & framework
- **MongoDB + Mongoose** — Database & ODM
- **JWT** — Authentication tokens
- **bcryptjs** — Password hashing
- **Multer** — File upload handling (resumes, logos, documents)
- **pdf-parse** — Extract text from uploaded PDF resumes
- **@huggingface/inference** — Sentence embeddings (all-MiniLM-L6-v2)
- **groq-sdk** — LLM access (llama-3.3-70b-versatile) for resume reviews & JD formatting
- **CORS** — Cross-origin resource sharing
- **dotenv** — Environment variable management

### Chatbot
- **Flask** — Python web framework
- **scikit-learn** — Logistic Regression intent classifier with TF-IDF vectorizer
- **sentence-transformers** — Semantic search model (all-MiniLM-L6-v2)
- **numpy** — Vector similarity computations
- **requests** — HTTP calls to the backend API

---

## Backend Functionality

### Authentication System
- **Signup** (`POST /api/auth/signup`) — Create a new user with `fullName`, `email`, `password`
- **Login** (`POST /api/auth/login`) — Verify credentials, return JWT token + user role
- **Set Role** (`POST /api/auth/role`) — Assign `student` or `recruiter` role to a user
- **JWT Protection** — All protected routes use `authMiddleware.js` which validates Bearer tokens

### Student Features
- **Save Student Details** (`POST /api/auth/details/student`) — Upload resume (PDF) + personal/academic info
- **Get Student Profile** (`GET /api/auth/profile/student`) — Retrieve saved student details
- **Update Student Details** (`PUT /api/auth/details/student`) — Edit profile information

### Recruiter/Company Features
- **Save Company Details** (`POST /api/auth/details/company`) — Upload company logo + registration doc
- **Get Company Profile** (`GET /api/auth/profile/company`) — View company profile
- **Update Company Details** (`PUT /api/auth/details/company`) — Edit company information

### Job Management (Recruiter)
- **Create Job** (`POST /api/jobs`) — Post a new internship listing
- **Get My Jobs** (`GET /api/jobs/mine`) — View all jobs posted by the recruiter
- **Update Job** (`PUT /api/jobs/:id`) — Edit job details
- **Toggle Status** (`PATCH /api/jobs/:id/status`) — Open/Close a job
- **Delete Job** (`DELETE /api/jobs/:id`) — Remove a job listing
- **Get Open Jobs** (`GET /api/jobs/open`) — Public listing of all open internships

### Application Management (Student)
- **Apply to Job** (`POST /api/applications`) — Submit an application with cover letter
- **Withdraw Application** (`DELETE /api/applications`) — Remove an application
- **Get My Applications** (`GET /api/applications/mine`) — View all student applications
- **Get Applicants for Job** (`GET /api/applications/job/:jobId`) — Recruiter views applicants
- **Update Application Status** (`PATCH /api/applications/:id/status`) — Shortlist/Reject/Mark as Applied

### Saved Jobs
- **Save Job** (`POST /api/saved/:jobId/save`) — Bookmark a job
- **Unsave Job** (`POST /api/saved/:jobId/unsave`) — Remove bookmark
- **Get Saved Jobs** (`GET /api/saved`) — List all saved jobs

### Resume Analysis (AI-Powered)
- **Analyze Resume** (`POST /api/review/analyze`) — Upload resume PDF + job description → returns match score + AI review (strengths, weaknesses, hiring potential, recommendations)
- **Format Job Description** (`POST /api/review/format-jd`) — Clean up and restructure raw JD text into a professional format

### Chatbot Integration
- **Chatbot Endpoint** (`POST /api/chatbot`) — Forwards user messages to the Flask chatbot service (port 5002) and returns AI reply + job recommendations

### User Profile (for Recommender)
- **Get User** (`GET /api/users/:id`) — Returns skills, interests, applied jobs, preferred companies for the recommendation engine

### File Uploads
- **Resumes** → `uploads/resumes/` (PDF only)
- **Company Logos** → `uploads/company/logos/` (image only)
- **Company Documents** → `uploads/company/docs/` (PDF only)

---

## Frontend Functionality

### Pages
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Home` | Landing page with hero section, testimonials, company logos, achievements |
| `/login` | `Login` | Login form for existing users |
| `/signup` | `Signup` | Registration form for new users |
| `/role` | `Role` | Role selection (student/recruiter) after signup |
| `/details/company` | `CompanyMandatoryDetails` | Company profile setup form |
| `/details/student` | `StudentMandatoryDetails` | Student profile setup with resume upload |
| `/s/:student_id` | `StudentDashboard` | Student dashboard showing open internships, search, filter, apply |
| `/s/:student_id/profile` | `StudentProfile` | Student profile view/edit |
| `/c/:companyId` | `CompanyDashboard` | Recruiter dashboard to post/manage jobs, view applicants |
| `/c/:companyId/profile` | `CompanyProfile` | Company profile view/edit |

### Key Components
- **`Chatbot.jsx`** — Floating chat widget that sends messages to the backend chatbot endpoint, displays AI replies, and shows job recommendations with apply buttons
- **`InternshipCard.jsx`** — Card component displaying internship details (title, company, location, duration, stipend, skills, apply/save actions)
- **`AnalysisResults.jsx`** — Displays resume match score (0-100%) with color-coded status, strengths/weaknesses/hiring potential/recommendations from the AI review
- **`LoginForm.jsx`** — Login form with email/password validation, JWT storage in sessionStorage, role-based navigation
- **`SignupForm.jsx`** — Registration form for new users
- **`Button.jsx`** — Reusable button component
- **`InputField.jsx`** — Reusable input field with label and validation styling
- **`SkillList.jsx`** — Displays a list of skills as tags

---

## Chatbot Functionality

The chatbot is a separate Flask microservice running on port **5002**.

### How It Works
1. User sends a message via the frontend chat widget
2. Frontend forwards the message to `POST /api/chatbot` on the Express backend (port 5001)
3. Express backend proxies the request to the Flask chatbot service (`http://127.0.0.1:5002/chatbot`)
4. Flask chatbot:
   - Checks for greetings/bye messages (regex-based)
   - Uses a trained **Logistic Regression + TF-IDF** intent classifier to categorize the message
   - For `recommendation` intent: fetches user data from the backend API and recommends matching jobs based on skill overlap, interest matching, and recency
   - For `internship` intent: uses **semantic search** (sentence-transformers) against an internship FAQ dataset to find the best answer
   - For `other` intent: returns a default fallback message

### Chatbot API Endpoints
- **`POST /chatbot`** (Flask, port 5002) — Accepts `{ message, userId, authToken }`, returns `{ reply, recommendations[] }`

### Training Data
- **`intent_data.csv`** — 599 labeled training examples with `text` and `label` columns (labels: `internship`, `other`)
- **`internship_faq.json`** — 30+ Q&A pairs for semantic search-based answers

### Models
- **`intent_pipeline.pkl`** — Trained scikit-learn Pipeline (TF-IDF + LogisticRegression)
- **`intent_model.pkl`** — Standalone LogisticRegression classifier (backward compat)
- **`vectorizer.pkl`** — Standalone TF-IDF vectorizer (backward compat)

---

## Environment Variables

### Backend (`.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5001` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/test-link` |
| `JWT_SECRET` | Secret key for JWT signing | `shinesuri` |
| `JWT_EXPIRE` | Token expiry duration | `7d` |
| `GROQ_API_KEY` | Groq API key for LLM access | *(set in .env)* |
| `HF_API_KEY` | Hugging Face API key for embeddings | *(set in .env)* |
| `ALLOWED_ORIGINS` | Extra CORS origins (comma separated). Any `http://localhost:<port>` / `http://127.0.0.1:<port>` origin is allowed automatically, because Vite shifts to the next free port when 5173 is busy | *(none)* |

### Frontend (`.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5001` |

---

## How to Run Everything

### Prerequisites
- **Node.js** v18 or higher
- **npm** v7 or higher
- **MongoDB** running locally (default: `mongodb://localhost:27017`)
- **Python 3** (for the chatbot microservice)

### 1. Install Dependencies

From the root `MeetScribe/` directory:

```bash
npm install
```

This installs dependencies for both frontend and backend workspaces.

### 2. Set Up the Chatbot Virtual Environment

A `.venv` already exists in `chatbot/`. If you need to recreate it:

```bash
cd chatbot
python3 -m venv .venv
.venv/bin/python -m pip install --upgrade pip
.venv/bin/python -m pip install -r requirements.txt
```

If the `.venv` already exists, just make sure the packages are installed:

```bash
cd chatbot
.venv/bin/python -m pip install -r requirements.txt
```

> **Note:** always invoke the interpreter through the venv path (`.venv/bin/python`).
> Running `source .venv/bin/activate` also works, but the activation script stores an
> absolute path — if the project folder is moved or renamed, the venv breaks and you
> will see errors like `bad interpreter: No such file or directory`.

### 3. Start the Backend Server (Port 5001)

```bash
npm run backend
```

Or from the `backend/` directory directly:

```bash
cd backend
npm run dev
```

This starts the Express server with nodemon (auto-restarts on changes).

### 4. Start the Frontend Dev Server (Port 5173)

```bash
npm run frontend
```

Or from the `frontend/` directory directly:

```bash
cd frontend
npm run dev
```

### 5. Start the Chatbot Microservice (Port 5002)

```bash
cd chatbot
.venv/bin/python api/chatbot_api.py
```

Equivalent one-liner from the repository root:

```bash
npm run chatbot
```

The service must be started **from the `chatbot/` directory** — it loads
`./models/intent_pipeline.pkl` and `./dataset/internship_faq.json` relative to the
current working directory. On first run the `all-MiniLM-L6-v2` sentence-transformer
model is downloaded from Hugging Face, so startup takes a few extra seconds.

### Summary of All Services

| Service | Port | Command |
|---------|------|---------|
| Backend (Express API) | `5001` | `npm run backend` (from root) |
| Frontend (Vite dev server) | `5173` | `npm run frontend` (from root) |
| Chatbot (Flask AI service) | `5002` | `npm run chatbot` (from root) or `.venv/bin/python api/chatbot_api.py` (from `chatbot/`) |

### Running All Services Simultaneously

From the root directory, you can run both frontend and backend together:

```bash
npm start
```

Then in a separate terminal, start the chatbot:

```bash
npm run chatbot
```

### Accessing the Application
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5001`
- **Chatbot API**: `http://localhost:5002`

---

## API Endpoints Summary

### Auth
- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/login` — Login and receive JWT
- `POST /api/auth/role` — Set user role (student/recruiter)
- `POST /api/auth/details/student` — Save student profile + resume
- `GET /api/auth/profile/student` — Get student profile
- `PUT /api/auth/details/student` — Update student profile
- `POST /api/auth/details/company` — Save company profile + logo/doc
- `GET /api/auth/profile/company` — Get company profile
- `PUT /api/auth/details/company` — Update company profile

### Jobs
- `GET /api/jobs/open` — Get all open internships (public)
- `POST /api/jobs` — Create a job (recruiter only)
- `GET /api/jobs/mine` — Get recruiter's own jobs
- `PUT /api/jobs/:id` — Update a job
- `PATCH /api/jobs/:id/status` — Toggle open/closed
- `DELETE /api/jobs/:id` — Delete a job

### Applications
- `POST /api/applications` — Apply to a job
- `DELETE /api/applications` — Withdraw application
- `GET /api/applications/mine` — Get student's applications
- `GET /api/applications/job/:jobId` — Get applicants for a job (recruiter)
- `PATCH /api/applications/:id/status` — Update application status

### Saved Jobs
- `POST /api/saved/:jobId/save` — Save a job
- `POST /api/saved/:jobId/unsave` — Unsave a job
- `GET /api/saved` — Get saved jobs

### Review (AI)
- `POST /api/review/analyze` — Analyze resume against job description
- `POST /api/review/format-jd` — Format a raw job description

### Chatbot
- `POST /api/chatbot` — Send message to chatbot (proxied to Flask)

### Users
- `GET /api/users/:id` — Get user profile for recommender

---

## Database Models

### User
- `fullName`, `email`, `password`, `role` (student/recruiter), `savedJobs[]`

### Student (sub-document of User)
- `name` (firstName, middleName, lastName)
- `contact` (country, address, phone, email)
- `skills[]`, `resumePath`
- `college`, `branch`, `semester`

### Company (sub-document of User)
- `companyName`, `website`, `description`, `companyType`
- `location`, `contactPerson`, `contactPhone`
- `logoPath`, `docPath`

### Job
- `title`, `location`, `duration`, `stipend`, `description`, `skills[]`
- `status` (Open/Closed/Reviewing), `applicantsCount`
- `recruiter` (ref: User), `postedAt`

### Application
- `job` (ref: Job), `student` (ref: User)
- `status` (Applied/Shortlisted/Rejected)
- `coverLetter`, `resumePath`

---

## Troubleshooting

### "Sign up does nothing" / the request never reaches the backend
The Vite dev server moves to the next free port when `5173` is already taken by
another project (it then prints `http://localhost:5175`). A browser blocks
cross-origin calls whose `Access-Control-Allow-Origin` does not match its own
origin, and the request fails **silently**.

Fix: the backend already allows every `localhost`/`127.0.0.1` dev origin
(see [`backend/server.js`](backend/server.js)), so any Vite port works. To pin
the port, stop the other dev server or set `server.port` in
[`frontend/vite.config.js`](frontend/vite.config.js).

Quick check from the terminal:

```bash
curl -i -X POST http://localhost:5001/api/auth/signup \
  -H "Origin: http://localhost:5173" \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@example.com","password":"Test@1234"}'
```

The response must contain `Access-Control-Allow-Origin: http://localhost:5173`.

### Chatbot answers "Error connecting to AI service"
The Flask service on port `5002` is not running. Start it with
`npm run chatbot` (or `cd chatbot && .venv/bin/python api/chatbot_api.py`) and
remember it must run from the `chatbot/` directory.
