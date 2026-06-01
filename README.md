# MDiHub LMS — Learning Management System

A modern, role-based Learning Management System built with Next.js 16 and React 19. Features student, facilitator, and admin dashboards with course management, assignments, quizzes, progress tracking, discussions, reviews, certificates, analytics, and more — all powered by client-side mock data with localStorage persistence.

## Tech Stack

- **Framework** — Next.js 16 (App Router)
- **UI Library** — React 19
- **Styling** — Tailwind CSS v4
- **Components** — Radix UI primitives
- **Icons** — lucide-react
- **Notifications** — sonner
- **Charts** — Recharts
- **Calendar** — react-day-picker
- **Data** — Client-side mock arrays with localStorage persistence (no backend required)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Build

```bash
npm run build
```

## Roles

| Role | Description |
|------|-------------|
| **Admin** | Full system oversight — manage users, courses, announcements, facilitator applications. Access to analytics dashboard and user management. |
| **Facilitator** | Create and manage courses, grade assignments, facilitate discussions, moderate reviews. |
| **Student** | Enroll in courses, complete modules, submit assignments, take quizzes, participate in discussions, earn certificates. |

### Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| `admin@mdihub.com` | `admin123` | Admin |
| `john@email.com` | `pass123` | Student |
| `jane@email.com` | `pass123` | Facilitator |

## Features

### Core
- Role-based authentication (sign-in / register / forgot password)
- Role-specific dashboards with contextual widgets
- Course catalog with enrollment, status filters, and search
- Module/lesson hierarchy within courses
- Module and lesson reordering (drag-free up/down buttons)

### Assignments & Grading
- Assignment submission with text and file upload
- Facilitator grading with marks and written feedback
- Assignment resubmission — facilitators can re-open submissions
- Unsubmit before grading
- Due date enforcement (submissions closed after overdue)

### Quizzes
- Multiple-choice and text-answer questions
- Auto-grading for MCQs
- Correct/incorrect review after submission
- Configurable time limits

### Progress & Certificates
- Per-course progress bars (completion percentage based on modules)
- Course completion certificates with unique IDs
- Certificate claim and download on the Certificates page

### Discussions & Reviews
- Per-course discussion threads with replies
- Thread pinning and resolved status
- Course star ratings and written reviews
- Average rating display on course detail

### Notifications
- Dedicated Notifications page with read/unread/all tabs
- Mark individual or all as read
- Delete notifications
- Badge count in sidebar and top-nav

### Analytics (Admin)
- Stat cards (students, facilitators, courses, enrollments, avg grade)
- Per-course performance breakdown with completion bars
- Recent activity summary

### Global Search
- Search bar in top navigation
- Searches course titles and descriptions
- Results dropdown with direct links

### User Management (Admin)
- View all users with role and status
- Create, edit, suspend, activate users
- Bulk CSV import with validation

### Announcements
- Create announcements with title, description, priority, target audience
- Course-specific filtering
- Priority badges (High / Medium / Low)

### Help & Support
- **Built-in Chatbot** — floating rule-based assistant answering common questions about assignments, grades, courses, certificates, quizzes, etc. No external API required.
- Help page with FAQs

### API Routes (Stubs)
Basic REST API endpoints at `/api/auth`, `/api/courses`, `/api/announcements`, `/api/users` — ready for future backend integration.

## Data Architecture

All data lives in `src/lib/mock-data.ts` and is wrapped with a custom `makePersistent<T>()` helper that automatically persists mutations (push, splice, etc.) to `localStorage`. The app works fully offline — no backend connection is needed.

The `DataProvider` in `src/lib/data-context.tsx` provides a React context for all data types, though many pages access the mock arrays directly for simplicity.

## Project Structure

```
src/
├── app/
│   ├── (app)/           # Authenticated app layout with sidebar + top-nav
│   │   ├── dashboard/   # Role-specific dashboards
│   │   ├── courses/     # Course catalog, detail, modules, assignments, quizzes
│   │   ├── analytics/   # Admin analytics dashboard
│   │   ├── notifications/
│   │   ├── certificates/
│   │   ├── announcements/
│   │   └── users/       # Admin user management with bulk import
│   ├── signin/          # Sign-in / register / forgot password
│   ├── api/             # REST API stubs
│   └── page.tsx         # Landing page
├── components/
│   ├── ui/              # Radix UI primitives (button, card, dialog, etc.)
│   ├── sidebar.tsx      # App sidebar navigation
│   ├── top-nav.tsx      # Top navigation with search + notifications
│   ├── auth-guard.tsx   # Route protection
│   ├── chatbot.tsx      # Rule-based assistant
│   └── mdihub-logo.tsx  # SVG logo component
└── lib/
    ├── mock-data.ts     # All data types + mock arrays + persistence
    ├── auth-context.tsx # Authentication context
    ├── data-context.tsx # Data provider context
    └── theme-context.tsx # Dark/light theme
```

## License

Proprietary — Mafikeng Digital Innovation Hub
