# CU Finance Management System

A web-based finance management system for the KSU Christian Union that handles cash management, requisitions, asset tracking, financial reporting, and role-based access control. The system replaces manual record-keeping with a digital platform where every transaction is recorded, approved, and auditable.

---

## Documentation

| Document | Description |
|----------|-------------|
| [`docs/project-overview.md`](docs/project-overview.md) | Full project overview — system description, user roles, modules, phases, and team assignments |
| [`docs/requirements.md`](docs/requirements.md) | Functional and non-functional requirements with role access matrix |
| [`docs/database-schema.md`](docs/database-schema.md) | MongoDB collections, fields, relationships, and status flows |

**Start here:** Read `docs/project-overview.md` to understand the full project.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JWT (JSON Web Tokens) + bcrypt |
| **File Uploads** | Multer |
| **Frontend** | React.js (Vite) |
| **Payment** | M-Pesa Integration (Daraja API) |
| **Containerization** | Docker + Docker Compose |

---

## Project Structure

```
cu-finance-system/
├── docs/
│   ├── project-overview.md     # Start here
│   ├── requirements.md         # System requirements & role access matrix
│   └── database-schema.md      # Database design
├── src/
│   ├── backend/
│   │   ├── config/             # Database connection
│   │   ├── controllers/        # Request handlers
│   │   ├── middleware/         # Auth & audit middleware
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API route definitions
│   │   ├── uploads/           # Uploaded receipts & vouchers
│   │   ├── server.js          # Express entry point
│   │   ├── Dockerfile         # Backend container config
│   │   └── package.json       # Backend dependencies
│   └── frontend/
│       ├── src/               # React source code
│       ├── public/            # Static assets
│       ├── vite.config.js     # Vite config (dev server + API proxy)
│       ├── Dockerfile         # Frontend container config
│       └── package.json       # Frontend dependencies
├── docker-compose.yml          # Run all services with one command
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- Git

### Setup

```bash
# Clone the repo
git clone https://github.com/rpcdev/cu-finance-system.git
cd cu-finance-system

# Create your .env file
cp src/backend/.env.example src/backend/.env
# Edit src/backend/.env with your JWT secret

# Start all services (backend, frontend, MongoDB)
docker compose up
```

That's it. Three containers will start:
- **Frontend** at http://localhost:5173
- **Backend API** at http://localhost:5000
- **MongoDB** at localhost:27017

To stop: `docker compose down`
To rebuild after dependency changes: `docker compose up --build`

### Environment Variables

Create a `.env` file in `src/backend/` (copy from `.env.example`):

```
PORT=5000
MONGO_URI=mongodb://mongo:27017/cu-finance
JWT_SECRET=your-secret-key-here
```

---

## Git Workflow

> **Golden rule: Never push directly to `main`.** All work goes through team branches and pull requests.

### How branches are organized

```
main                                         ← production-ready code
 ├── phase-1/auth-ui                         ← Team 1's branch
 │    ├── phase-1/auth-ui-login-page         ← subtask branch (your work)
 │    ├── phase-1/auth-ui-register-form      ← subtask branch
 │    └── phase-1/auth-ui-password-reset     ← subtask branch
 ├── phase-1/backend-fixes                   ← Team 2's branch
 └── phase-1/frontend-setup                  ← Team 3's branch
```

- **Team branches** are managed by team leads
- **Subtask branches** are where you do your actual work
- You always PR into your **team branch**, never directly into `main`

---

### Step-by-step: Working on a task

#### 1. Clone the repo (first time only)

```bash
git clone https://github.com/rpcdev/cu-finance-system.git
cd cu-finance-system
```

#### 2. Set your identity (first time only)

```bash
git config user.name "Your-GitHub-Username"
git config user.email "your-email@example.com"
```

Example:
```bash
git config user.name "ruthpendo05"
git config user.email "ruth@example.com"
```

#### 3. Switch to your team branch and pull the latest changes

```bash
git checkout phase-1/auth-ui
git pull origin phase-1/auth-ui
```

> Always pull before creating a new branch so you're working on the latest code.

#### 4. Create your subtask branch from the team branch

```bash
git checkout -b phase-1/auth-ui-register-form
```

This creates a new branch based on the team branch. You are now on your own branch.

#### 5. Check which branch you're on

```bash
git branch
```

Output — the `*` shows your current branch:
```
  main
  phase-1/auth-ui
* phase-1/auth-ui-register-form    ← you are here
```

#### 6. Make your changes

Edit files using your code editor. When you're done, check what changed:

```bash
git status
```

Example output:
```
modified:   src/frontend/src/App.jsx
new file:   src/frontend/src/pages/RegisterPage.jsx
```

#### 7. Stage the files you changed

Add specific files (recommended):
```bash
git add src/frontend/src/pages/RegisterPage.jsx src/frontend/src/App.jsx
```

> Avoid `git add .` — it can accidentally include files you didn't mean to commit.

#### 8. Commit with a clear message

```bash
git commit -m "Add admin registration form with role dropdown"
```

Good commit messages describe **what** you did:
- `"Add login page with email/password form"`
- `"Fix file upload to reject non-image files"`
- `"Add React Router and set up routes"`

#### 9. Push your branch to GitHub

```bash
git push -u origin phase-1/auth-ui-register-form
```

The `-u` flag links your local branch to the remote — you only need it on the first push. After that, just `git push`.

#### 10. Open a Pull Request (PR)

1. Go to https://github.com/rpcdev/cu-finance-system/pulls
2. Click **"New pull request"** (or use the banner GitHub shows after your push)
3. Set:
   - **base:** `phase-1/auth-ui` (your team branch — NOT `main`)
   - **compare:** `phase-1/auth-ui-register-form` (your subtask branch)
4. Add a title and description of what you did
5. Click **"Create pull request"**
6. Wait for your team lead to review and merge

---

### Keeping your branch up to date

If `main` or your team branch has new changes you need:

```bash
# Download the latest changes from GitHub
git fetch origin

# Merge them into your current branch
git merge origin/main --no-edit
```

Or to get the latest from your team branch:
```bash
git merge origin/phase-1/auth-ui --no-edit
```

> The `--no-edit` flag accepts the default merge message so you don't get dropped into a text editor.

---

### Working on a second task

When you finish one task and want to start another:

```bash
# Go back to the team branch
git checkout phase-1/auth-ui
git pull origin phase-1/auth-ui

# Create a new subtask branch
git checkout -b phase-1/auth-ui-password-reset

# Work, commit, push, PR — same as steps 6-10 above
```

---

### Quick reference

| What you want to do | Command |
|----------------------|---------|
| Check your current branch | `git branch` |
| See what files changed | `git status` |
| See the actual changes | `git diff` |
| Switch to a branch | `git checkout branch-name` |
| Create a new branch | `git checkout -b new-branch-name` |
| Pull latest changes | `git pull origin branch-name` |
| Stage files | `git add file1 file2` |
| Commit | `git commit -m "your message"` |
| Push | `git push -u origin branch-name` |
| Sync with main | `git fetch origin && git merge origin/main --no-edit` |
| View commit history | `git log --oneline` |

---

### Branch naming

| Type | Format | Example |
|------|--------|---------|
| Team branch | `phase-X/team-task` | `phase-1/auth-ui` |
| Subtask | `phase-X/team-task-subtask` | `phase-1/auth-ui-login-page` |
| Bug fix | `fix/short-description` | `fix/file-upload-validation` |

---

## Teams

### Team Leads
| Name | GitHub | Team |
|------|--------|------|
| Justus Kimutai | @Justus-Kimutai | Team 1 |
| Fancy Nateku | @Fancy-nateku | Team 2 |
| P Githinji | @P-githinji | Team 3 |

### Team 1
| Name | GitHub |
|------|--------|
| Justus Kimutai | @Justus-Kimutai |
| Ruth Pendo | @ruthpendo05 |
| Lewis Muriu | @LewisMuriu |
| Edmond | @edm-ond |

### Team 2
| Name | GitHub |
|------|--------|
| Khamalah (Cliff) | @Khamalah |
| Bryant | @Bryant-t504 |
| Fancy Nateku | @Fancy-nateku |

### Team 3
| Name | GitHub |
|------|--------|
| P Githinji | @P-githinji |
| Henry | @Henry-ai443 |
| Effie | @EffieDev1 |
