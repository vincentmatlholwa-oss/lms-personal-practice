# MDiHub LMS — Learning Management System

A modern, role-based Learning Management System built with Next.js 16 and React 19. Features student, facilitator, and admin dashboards with course management, assignments, quizzes, progress tracking, discussions, reviews, certificates, analytics, and more — powered by Prisma + SQLite with a full REST API layer.

## Tech Stack

- **Framework** — Next.js 16 (App Router)
- **UI Library** — React 19
- **Styling** — Tailwind CSS v4
- **Components** — Radix UI primitives
- **Icons** — lucide-react
- **Notifications** — sonner
- **Charts** — Recharts
- **Calendar** — react-day-picker
- **Database** — SQLite via Prisma 7 + `@prisma/adapter-libsql`
- **Auth** — JWT (jsonwebtoken) + bcryptjs
- **AI Chat** — OpenAI-compatible API (optional, falls back to rule-based)
- **Testing** — Vitest (unit), Playwright (E2E)

## Getting Started

```bash
npm install
npx prisma migrate dev    # Create SQLite database
npx tsx prisma/seed.ts     # Seed with demo data
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Build

```bash
npm run build
npm run start
```

## Testing

```bash
npm test              # Unit tests (Vitest)
npx playwright test   # E2E tests (Playwright)
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
- Role-based authentication (sign-in / register / forgot password) with JWT
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
- **AI-Powered Chatbot** — floating assistant with OpenAI-compatible API integration. Falls back to rule-based FAQ matching when no API key is configured. Configure via `AI_API_KEY`, `AI_API_URL`, and `AI_MODEL` environment variables.
- Help page with FAQs

## API Routes

Full REST API for all entities, all requiring Bearer token auth:

| Endpoint | Methods |
|----------|---------|
| `/api/auth` | POST (signin, register, me) |
| `/api/users` | GET, POST |
| `/api/users/[id]` | GET, PATCH, DELETE |
| `/api/courses` | GET, POST |
| `/api/courses/[id]` | GET, PATCH, DELETE |
| `/api/enrollments` | GET, POST |
| `/api/modules` | GET (by courseId), POST |
| `/api/modules/[id]` | GET, PATCH, DELETE |
| `/api/lessons` | GET (optional moduleId), POST |
| `/api/lessons/[id]` | GET, PATCH, DELETE |
| `/api/activities` | GET (optional lessonId), POST |
| `/api/activities/[id]` | GET, PATCH, DELETE |
| `/api/assignments` | GET, POST |
| `/api/assignments/[id]` | GET, PATCH, DELETE |
| `/api/quizzes` | GET, POST |
| `/api/quizzes/[id]` | GET, PATCH, DELETE |
| `/api/submissions` | GET, POST |
| `/api/submissions/[id]` | GET, PATCH, DELETE |
| `/api/gradebook` | GET, POST |
| `/api/gradebook/[id]` | GET, PATCH, DELETE |
| `/api/announcements` | GET (optional targetAudience), POST |
| `/api/notifications` | GET (optional userId), POST |
| `/api/calendar-events` | GET, POST |
| `/api/calendar-events/[id]` | GET, PATCH, DELETE |
| `/api/discussions` | GET, POST |
| `/api/discussions/[id]` | GET, PATCH, DELETE |
| `/api/discussion-replies` | GET, POST |
| `/api/discussion-replies/[id]` | GET, PATCH, DELETE |
| `/api/course-reviews` | GET, POST |
| `/api/course-reviews/[id]` | GET, PATCH, DELETE |
| `/api/course-progress` | GET, POST |
| `/api/course-progress/[id]` | GET, PATCH, DELETE |
| `/api/certificates` | GET, POST |
| `/api/certificates/[id]` | GET, PATCH, DELETE |
| `/api/facilitator-applications` | GET, POST |
| `/api/facilitator-applications/[id]` | GET, PATCH, DELETE |
| `/api/chat` | POST (AI chat, accepts `{ messages }`) |

## Data Architecture

All data is stored in a SQLite database via Prisma 7 with the `@prisma/adapter-libsql` driver adapter. The `DataProvider` context in `src/lib/data-context.tsx` fetches all entities from the API on mount, falling back to mock data if the API is unavailable.

- **Schema:** `prisma/schema.prisma` (20 models)
- **Seed:** `prisma/seed.ts` (7 users, 5 courses, 8 modules, etc.)
- **Client:** `src/lib/prisma.ts` (singleton with libSQL adapter)
- **Auth:** JWT tokens stored in sessionStorage (`lms_token`, `lms_user`)

## Environment Variables

```
DATABASE_URL="file:./dev.db"
AI_API_KEY=       # Optional — for AI chatbot
AI_API_URL=       # Optional — defaults to https://api.openai.com/v1/chat/completions
AI_MODEL=         # Optional — defaults to gpt-4o-mini
```

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
│   ├── api/             # Full REST API (26 route files across 20 entities)
│   └── page.tsx         # Landing page
├── components/
│   ├── ui/              # Radix UI primitives (button, card, dialog, etc.)
│   ├── sidebar.tsx      # App sidebar navigation
│   ├── top-nav.tsx      # Top navigation with search + notifications
│   ├── auth-guard.tsx   # Route protection
│   ├── chatbot.tsx      # AI-powered assistant
│   └── mdihub-logo.tsx  # SVG logo component
├── lib/
│   ├── mock-data.ts     # All data types + mock arrays (fallback)
│   ├── auth-context.tsx # Authentication context with API calls
│   ├── data-context.tsx # Data provider context with API fetches
│   ├── prisma.ts        # Prisma client singleton
│   └── jwt.ts           # JWT sign/verify helpers
├── generated/prisma/    # Prisma client output
└── __tests__/           # Vitest unit tests
prisma/
├── schema.prisma        # Database schema (20 models)
└── seed.ts              # Seed script
```

## License

Proprietary — Mafikeng Digital Innovation Hub
