# 📡 Content Broadcasting System

A full-featured educational content management and live broadcasting platform built with **Next.js 14**, **React**, **TanStack Query**, and **Tailwind CSS**. Teachers upload subject-based content, principals approve or reject it, and students view live broadcasts on a public page — no login required.

---

## 🖥️ Live Demo

| Page | URL |
|------|-----|
| Login | `http://localhost:3000/auth` |
| Teacher Dashboard | `http://localhost:3000/teacher/dashboard` |
| Upload Content | `http://localhost:3000/teacher/upload` |
| My Content | `http://localhost:3000/teacher/my-content` |
| Principal Dashboard | `http://localhost:3000/principal/dashboard` |
| Pending Approvals | `http://localhost:3000/principal/approvals` |
| All Content | `http://localhost:3000/principal/all-content` |
| Live Broadcast (Public) | `http://localhost:3000/live/t1` |

---

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| 🏫 Principal | `principal@school.com` | `principal123` |
| 👨‍🏫 Teacher | `teacher@school.com` | `teacher123` |
| 👩‍🏫 Teacher 2 | `teacher2@school.com` | `teacher123` |

> The live broadcast page `/live/:teacherId` requires **no login** — it's fully public.

---

## ✨ Features

### Authentication
- Email + password login with full validation (Zod + React Hook Form)
- JWT token stored securely in `localStorage`
- Axios interceptor auto-attaches `Bearer` token to every request
- Auto-redirect on 401 (token expired / invalid)
- Role-based redirect after login (Teacher → Teacher Dashboard, Principal → Principal Dashboard)

### Teacher
- **Dashboard** — stats cards (total, pending, approved, rejected) + recent content grid
- **Upload Content** — drag-and-drop file upload (JPG/PNG/GIF, max 10MB), subject selector, title, description, start/end time picker, rotation duration
- **My Content** — filterable grid (all / pending / approved / rejected) with rejection reason display

### Principal
- **Dashboard** — system-wide stats + pending items table
- **Pending Approvals** — card-based review UI with file preview, approve button, reject button (opens modal with mandatory reason)
- **All Content** — searchable + filterable table (by status, title, subject, teacher name)

### Live Broadcast Page (Public)
- Route: `/live/:teacherId`
- Shows only currently **active + approved** content based on real-time window
- Auto-refreshes every 30 seconds (polling)
- Loading skeleton, empty state, error state
- Dark themed broadcast UI with LIVE badge

### UI/UX
- Fully responsive layout
- Sidebar navigation with active route highlight
- Skeleton loaders on every data-dependent view
- Toast notifications (success / error)
- Modal with keyboard (Escape) dismiss
- Empty states with contextual CTAs
- Error states with retry buttons
- Schedule badges: `Scheduled` / `Active` / `Expired` computed from timestamps

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | JavaScript (ES6+) |
| Styling | Tailwind CSS |
| Forms | React Hook Form + Zod |
| Data Fetching | TanStack Query v5 |
| HTTP Client | Axios |
| Icons | Lucide React |
| Notifications | react-hot-toast |
| File Upload | react-dropzone |
| Utilities | clsx, tailwind-merge, date-fns, class-variance-authority |

---

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── auth/
│   │   └── page.jsx              # Login page
│   ├── teacher/
│   │   ├── dashboard/page.jsx    # Teacher dashboard
│   │   ├── upload/page.jsx       # Upload content form
│   │   └── my-content/page.jsx   # My uploaded content
│   ├── principal/
│   │   ├── dashboard/page.jsx    # Principal dashboard
│   │   ├── approvals/page.jsx    # Pending approvals
│   │   └── all-content/page.jsx  # All content with filters
│   ├── live/
│   │   └── [teacherId]/page.jsx  # Public live broadcast page
│   ├── layout.jsx                # Root layout
│   ├── page.jsx                  # Root redirect
│   ├── providers.jsx             # QueryClient + AuthProvider + Toaster
│   └── globals.css
│
├── components/
│   ├── ui/                       # Base UI primitives
│   │   ├── Button.jsx            # Variants: primary, secondary, danger, ghost, success, outline
│   │   ├── Badge.jsx             # Color-coded badge
│   │   ├── Modal.jsx             # Accessible modal with Escape support
│   │   └── Skeleton.jsx          # Skeleton loaders (Card, TableRow, ContentCard)
│   ├── layout/
│   │   ├── Sidebar.jsx           # Role-aware sidebar navigation
│   │   └── DashboardLayout.jsx   # Auth guard + role guard wrapper
│   ├── teacher/
│   │   └── DropzoneUpload.jsx    # Drag-and-drop file uploader with preview
│   ├── principal/
│   │   └── RejectModal.jsx       # Reject content modal with mandatory reason
│   └── shared/
│       ├── StatusBadge.jsx       # Approval status + schedule status badges
│       ├── EmptyState.jsx        # Reusable empty state with icon + CTA
│       ├── ErrorState.jsx        # Error state with retry button
│       ├── FilePreview.jsx       # Safe image preview with fallback
│       └── StatsCard.jsx         # Dashboard metric card
│
├── services/                     # API layer (all calls go here, never in components)
│   ├── api.js                    # Axios instance + request/response interceptors
│   ├── auth.service.js           # login(), logout(), getProfile()
│   ├── content.service.js        # getMyContent(), getAllContent(), getActiveContent(), uploadContent()
│   └── approval.service.js       # getPendingContent(), approveContent(), rejectContent()
│
├── hooks/                        # Custom React hooks (extend as needed)
├── context/
│   └── AuthContext.jsx           # Global auth state: user, login, logout, isAuthenticated
├── utils/
│   ├── constants.js              # ROLES, CONTENT_STATUS, SUBJECTS, ROUTES, file limits
│   ├── helpers.js                # cn(), formatDate(), getContentScheduleStatus(), formatFileSize()
│   └── validators.js             # Zod schemas: loginSchema, uploadContentSchema, rejectSchema
└── lib/
    └── queryClient.js            # TanStack Query client configuration
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/content-broadcasting.git
cd content-broadcasting
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=https://api.example.com/v1
NEXT_PUBLIC_USE_MOCK=true
```

> Set `NEXT_PUBLIC_USE_MOCK=true` to use built-in mock data (no backend needed).  
> Set `NEXT_PUBLIC_USE_MOCK=false` to connect to a real backend API.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production

```bash
npm run build
npm start
```

---

## 🔌 Connecting to a Real Backend

The service layer is designed for a clean swap. When your backend is ready:

1. Set `NEXT_PUBLIC_USE_MOCK=false` in `.env.local`
2. Set `NEXT_PUBLIC_API_URL=https://your-api.com/v1`
3. No changes needed in any component — only the services layer talks to the API

### Expected API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Login, returns `{ token, user }` |
| `POST` | `/auth/logout` | Logout |
| `GET` | `/auth/me` | Get current user profile |
| `GET` | `/content/teacher/:id` | Get teacher's own content |
| `GET` | `/content` | Get all content (with `?status=` and `?search=` filters) |
| `GET` | `/content/live/:teacherId` | Get active content for live page |
| `POST` | `/content` | Upload new content (multipart/form-data) |
| `DELETE` | `/content/:id` | Delete content |
| `GET` | `/approvals/pending` | Get all pending content |
| `PATCH` | `/approvals/:id/approve` | Approve content |
| `PATCH` | `/approvals/:id/reject` | Reject content with `{ reason }` |

### Token Authentication

Every request automatically includes the token via Axios interceptor:

```
Authorization: Bearer <token>
```

---

## 🏗️ Architecture Decisions

### Service Layer
All API calls are strictly isolated in `src/services/`. Components never call APIs directly. This makes the codebase testable, maintainable, and backend-agnostic.

### State Management
- **Server state** → TanStack Query (automatic caching, background refetching, loading/error states)
- **Auth state** → React Context (lightweight, no Redux needed)
- **Form state** → React Hook Form (performant, minimal re-renders)
- **UI state** → Local `useState` (modals, filters — kept close to where they're used)

### Role-Based Access
`DashboardLayout` wraps every protected page and accepts a `requiredRole` prop. It redirects unauthenticated users to `/auth` and wrong-role users to their correct dashboard. The public live page bypasses this entirely.

### Performance
- TanStack Query caches responses and deduplicates concurrent requests
- `useMemo` used for client-side filtering on large lists
- `useCallback` on auth functions to prevent unnecessary re-renders
- Skeleton loaders prevent layout shift during data fetching
- Images use graceful fallback via `onError` handler

---

## 📋 Form Validation Rules

### Login
| Field | Rule |
|-------|------|
| Email | Required, valid email format |
| Password | Required, minimum 6 characters |

### Upload Content
| Field | Rule |
|-------|------|
| Title | Required, max 100 characters |
| Subject | Required, must select from list |
| File | Required, JPG/PNG/GIF only, max 10MB |
| Start Time | Required |
| End Time | Required, must be after Start Time |
| Rotation Duration | Optional, minimum 1 second |

### Reject Content
| Field | Rule |
|-------|------|
| Reason | Required, minimum 10 characters |

---

## 🎨 Content Schedule States

Content schedule status is computed client-side from timestamps:

| State | Condition | Badge Color |
|-------|-----------|------------|
| `Scheduled` | Current time is before start time | Purple |
| `Active` | Current time is between start and end | Green |
| `Expired` | Current time is after end time | Gray |

This is separate from approval status (Pending / Approved / Rejected).

---

## 🧪 Edge Cases Handled

- ✅ Empty data states with contextual messages and CTAs
- ✅ API errors with user-friendly messages and retry buttons
- ✅ Invalid file type — blocked at dropzone level
- ✅ File too large (>10MB) — blocked at dropzone level
- ✅ End time before start time — Zod validation error
- ✅ Unauthenticated access — redirect to `/auth`
- ✅ Wrong role access — redirect to correct dashboard
- ✅ 401 responses — auto-logout and redirect
- ✅ Broken image URLs — fallback placeholder shown
- ✅ Expired JWT — interceptor clears token and redirects
- ✅ Upload with no file selected — validation error shown

---

## 🌐 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://api.example.com/v1` | Backend API base URL |
| `NEXT_PUBLIC_USE_MOCK` | `true` | Use mock data (`true`) or real API (`false`) |

---

## 📦 Available Scripts

```bash
npm run dev        # Start development server (http://localhost:3000)
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
```

---

## 🔮 Optional Enhancements (Bonus Features Implemented)

- [x] TanStack Query for server state management
- [x] Drag-and-drop file upload with react-dropzone
- [x] Skeleton loaders on all data-fetching views
- [x] Auto-refresh polling on live broadcast page (every 30s)
- [x] Protected routes with role-based guards
- [x] Reusable component library (Button, Badge, Modal, Skeleton, etc.)
- [ ] Dark mode toggle
- [ ] Pagination for large content lists
- [ ] React Query devtools (add `@tanstack/react-query-devtools` import in providers)

---

## 📝 Assumptions

1. File uploads return a publicly accessible URL from the server; in mock mode an `ObjectURL` is used for previewing
2. Content status transitions are one-way: `pending → approved` or `pending → rejected`
3. Scheduling status (active/scheduled/expired) is computed client-side from the `startTime` and `endTime` fields
4. The `role` field on the user object determines access — it is set at registration and returned on login
5. The live broadcast page (`/live/:teacherId`) is fully public and requires no authentication
6. Only image files (JPG, PNG, GIF) are supported as per the assignment spec
7. Token expiry is not validated client-side beyond the 401 interceptor response

---

## 👨‍💻 Author

Avinash Kumar.

---

## 📄 License

This project is created for assessment purposes.