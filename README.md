# University Portal (uni_front)

A React frontend for a university portal: user authentication, profile, and student management with groups.

## Tech stack

- **React 19** + **Vite 7**
- **React Router 7** for routing
- **Tailwind CSS 4** for styling
- ES modules

## Features

- **Auth**: Login and register; JWT stored in `localStorage`; protected routes redirect to `/login` when unauthenticated
- **Profile**: `/me` — current user info
- **Students**: `/students` — list students, create students (first/last name, gender, birth date, group)
- **Groups**: Fetched for the student form (group dropdown)
- **Layout**: Header with “University Portal”, My profile, Students, and Log out

## Prerequisites

- Node.js (v18+ recommended)
- A running backend API (see [API](#api) below)

## Setup

```bash
npm install
```

## Environment

Create a `.env` file in the project root (or copy from `.env.example` if you add one):

```env
VITE_API_URL=https://your-api-url.com
```

- If `VITE_API_URL` is not set, the app uses `http://localhost:8080`.
- All `VITE_*` variables are exposed to the client via `import.meta.env`.

## Scripts

| Command     | Description                    |
|------------|--------------------------------|
| `npm run dev`    | Start dev server (Vite)       |
| `npm run build`  | Production build              |
| `npm run preview`| Preview production build     |
| `npm run lint`   | Run ESLint                    |

## API

The app expects a backend that provides at least:

- `POST /api/auth/login` — `{ email, password }` → `{ token, user }`
- `POST /api/auth/register` — `{ email, password }` → `{ token, user }`
- `GET /api/users/me` — auth required → current user
- `GET /students` — list students
- `POST /students` — create student (e.g. `first_name`, `last_name`, `group_id`, optional `gender`, `birth_date`)
- `GET /groups` — list groups

The API client sends the JWT in the `Authorization` header and redirects to `/login` on 401.

## Project structure

```
src/
├── api/           # API client and endpoints
│   ├── auth.js
│   ├── client.js
│   ├── config.js   # API base URL, token storage
│   ├── groups.js
│   └── students.js
├── components/
│   ├── Layout.jsx
│   └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Me.jsx
│   └── Students.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## Routes

| Path        | Access    | Description              |
|------------|-----------|--------------------------|
| `/`        | All       | Redirects to `/me`       |
| `/login`   | Public    | Login form               |
| `/register`| Public    | Registration form        |
| `/me`      | Protected | Current user profile     |
| `/students`| Protected | Student list and create  |
| `*`        | All       | Redirects to `/me`       |

## License

Private project.
