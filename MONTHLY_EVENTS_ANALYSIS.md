# FUTUREGPT MONTHLY EVENTS FEATURE - COMPREHENSIVE CODEBASE ANALYSIS

**Status**: ANALYSIS ONLY - NO MODIFICATIONS MADE  
**Date**: 2026-08-31  
**Analyzed by**: GitHub Copilot  
**Scope**: Understanding existing architecture for future Monthly Events feature implementation

---

## 1. CURRENT TECH STACK

### Frontend
- **Framework**: React 18.3.1 (SPA)
- **Language**: TypeScript 5.5.3
- **Build Tool**: Vite 5.4.2
- **Router**: React Router DOM 6.22.3
- **State Management**: Redux Toolkit 2.2.7 + React Redux 9.1.2
- **Styling**: Tailwind CSS 3.4.1 + PostCSS 8.4.35
- **UI Components**: 
  - Lucide React 0.344.0 (icons)
  - React Icons 5.6.0 (additional icons)
  - Custom UI components in `client/src/components/ui/`
  - Carousel: Embla Carousel 8.5.1 with autoplay
- **Forms & Input**: React Modal 3.16.1
- **Notifications**: React Toastify 11.0.5
- **Animations**: Framer Motion 11.15.0
- **Other**: 
  - Class Variance Authority 0.7.1
  - React Intersection Observer 9.8.1
  - React CountUp 6.5.0

**Location**: [client/package.json](client/package.json)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.19.2
- **Database**: MongoDB with Mongoose 8.6.0
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcryptjs 2.4.3
- **File Storage**: Cloudinary 2.5.1
- **Email**: Nodemailer 7.0.6
- **File Upload Middleware**: Multer 1.4.5-lts.1
- **CORS**: cors 2.8.5
- **Environment**: dotenv 16.4.5
- **Development**: Nodemon 3.1.4

**Location**: [server/package.json](server/package.json)

### Deployment
- **Frontend**: Vite build, deployed to GitHub Pages or Vercel
- **Backend**: Node.js server on port 5000 (configurable via env)
- **Vercel Config**: [client/vercel.json](client/vercel.json) and [server/vercel.json](server/vercel.json)

---

## 2. APPLICATION ARCHITECTURE

### Frontend Architecture

#### Project Structure
```
client/
├── src/
│   ├── App.tsx                          # Main router setup
│   ├── main.tsx                         # Entry point with Redux Provider
│   ├── index.css                        # Global Tailwind styles
│   ├── pages/                           # Full-page components
│   ├── components/
│   │   ├── auth/                        # Authentication forms (ProtectedRoute, LoginForm, SignupForm, CompanyForms)
│   │   ├── dashboard/                   # Dashboard sections (DashboardSidebar, DashboardStats, SpecialEvents, JobResources, etc.)
│   │   ├── layout/                      # Header, Footer
│   │   └── ui/                          # Reusable UI components (button.tsx, card.tsx, carousel.tsx)
│   ├── lib/
│   │   ├── api.ts                       # All API endpoints
│   │   ├── store.ts                     # Redux store configuration
│   │   └── utils.ts                     # Utilities (API_BASE_URL, etc.)
│   ├── slices/
│   │   └── userSlice.ts                 # Redux user state management
│   └── types/
│       └── index.ts                     # TypeScript interfaces (User, Event, Job, Company, etc.)
```

**Location**: [client/src/](client/src/)

#### Routing Structure
- **SPA Routes** in [App.tsx](client/src/App.tsx):
  - Public routes: `/`, `/about`, `/chapters`, `/events`, `/team`, `/signup`, `/login`, `/company-signup`, `/company-login`
  - Protected routes: `/dashboard/*`, `/onboarding`
  - Admin: `/admin` (auth-required)
  - Dashboard sections:
    - `/dashboard/overview` → DashboardStats
    - `/dashboard/jobs` → JobResources
    - `/dashboard/global-jobs` → GlobalJobs
    - `/dashboard/events` → SpecialEvents
    - `/dashboard/community` → CommunityHub
    - `/dashboard/profile` → UserProfile
  - Event detail: `/events/:eventId` → EventDetail

**Location**: [client/src/App.tsx](client/src/App.tsx)

#### State Management
- **Redux Store**: Configured with Redux Toolkit
- **Current slices**: 
  - `user`: Manages authenticated user state (currentUser, status)
  - User data persisted to localStorage
- **Initialization**: Redux Provider wraps App in [main.tsx](client/src/main.tsx)

**Location**: [client/src/slices/userSlice.ts](client/src/slices/userSlice.ts)

### Backend Architecture

#### Project Structure
```
server/
├── index.js                             # Entry point, Express app setup
├── src/
│   ├── controllers/                     # Business logic (auth, events, jobs, team, etc.)
│   ├── models/                          # Mongoose schemas (User, Event, Job, Company, EventRegistration, etc.)
│   ├── routes/                          # Express route handlers
│   ├── middleware/                      # auth.js, admin.js, companyAuth.js
│   └── lib/
│       ├── db.js                        # MongoDB connection
│       ├── cloudinary.js                # Cloudinary configuration
│       └── mailer.js                    # Email configuration
```

**Location**: [server/](server/)

#### Database Models
- **User** [server/src/models/User.js](server/src/models/User.js): User profiles, auth, premium status
- **Event** [server/src/models/Event.js](server/src/models/Event.js): Events with basic metadata
- **EventRegistration** [server/src/models/EventRegistration.js](server/src/models/EventRegistration.js): Event registrations with status tracking
- **Job** [server/src/models/Job.js](server/src/models/Job.js): Job postings from companies
- **Company** [server/src/models/Company.js](server/src/models/Company.js): Company profiles
- **TeamMember** [server/src/models/TeamMember.js](server/src/models/TeamMember.js): Team member profiles
- **GlobalJob** models for external jobs
- **Discussion**, **Group**, **Waitlist**: Community features

#### API Structure
Base: `/api/*`

Routes:
- `/api/auth/` → User auth, admin login, password reset
- `/api/user/` → User profiles, applications
- `/api/events/` → Event CRUD, registrations
- `/api/team/` → Team member management
- `/api/cloudinary/` → File upload signing
- `/api/company/` → Company management
- `/api/payment/` → Payment processing
- `/api/stats/` → Dashboard statistics
- `/api/community/` → Community features

**Location**: [server/src/routes/](server/src/routes/)

---

## 3. AUTHENTICATION & AUTHORIZATION

### User Authentication Flow

**Login/Signup Process**:
1. User fills form in [LoginForm.tsx](client/src/components/auth/LoginForm.tsx)
2. API call to `/api/auth/login` or `/api/auth/register`
3. Server returns JWT token
4. Token stored in localStorage
5. User data stored in Redux state + localStorage
6. Token sent in `Authorization: Bearer {token}` header for all authenticated requests

**Location**: [client/src/lib/api.ts](client/src/lib/api.ts) - `apiLogin()`, `apiRegister()`

### Protected Routes
- Implemented via [ProtectedRoute.tsx](client/src/components/auth/ProtectedRoute.tsx)
- Checks for token in localStorage
- Redirects to `/login` if not authenticated

```typescript
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
```

### User Session Management
- Token stored in `localStorage.getItem('token')`
- User object stored in `localStorage.getItem('user')` as JSON
- Redux state in userSlice
- Dashboard fetches profile on mount via `/api/user/profile`
- Token validation on every protected request
- Logout clears token + user from localStorage + dispatches Redux action

**Location**: [client/src/pages/Dashboard.tsx](client/src/pages/Dashboard.tsx) - useEffect that fetches profile

### Admin Authentication

**Admin Login Flow**:
1. Admin fills form with email/password
2. API call to `/api/auth/admin-login`
3. Credentials checked against environment variables:
   - `ADMIN_EMAIL` 
   - `ADMIN_PASSWORD`
4. If valid, JWT token returned with role: 'admin'
5. Token stored in `localStorage.getItem('adminToken')`
6. Admin verification via `/api/auth/admin-verify` endpoint

**Location**: [server/src/routes/auth.js](server/src/routes/auth.js) - `admin-login` endpoint
**Location**: [client/src/pages/Admin.tsx](client/src/pages/Admin.tsx) - Admin login form

### Admin Authorization

**Middleware**: `requireAdmin()` in [server/src/middleware/admin.js](server/src/middleware/admin.js)

```javascript
function requireAdmin(req, res, next) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const isAdmin = req.user && req.user.email && adminEmail && 
                  req.user.email.toLowerCase() === adminEmail.toLowerCase();
  if (!isAdmin) return res.status(403).json({ message: 'Forbidden' });
  return next();
}
```

**Protected Admin Endpoints**:
- `POST /api/events/` - Create event (auth + requireAdmin)
- `PUT /api/events/:id` - Update event (auth + requireAdmin)
- `DELETE /api/events/:id` - Delete event (auth + requireAdmin)
- `GET /api/events/:id/registrations` - View registrations (auth + requireAdmin)
- `PUT /api/events/registrations/:id/status` - Update registration status (auth + requireAdmin)
- Similar for team members

**Location**: [server/src/routes/events.js](server/src/routes/events.js)

### Company Authentication
- Separate company login at `/company-login`
- Company token stored in `localStorage.getItem('companyToken')`
- Company controller authenticates and issues JWT
- Company dashboard requires company token

**Location**: [server/src/middleware/companyAuth.js](server/src/middleware/companyAuth.js)

---

## 4. DASHBOARD ARCHITECTURE

### Dashboard Layout
- **Entry Point**: [client/src/pages/Dashboard.tsx](client/src/pages/Dashboard.tsx)
- **Structure**: 
  - Fixed header (16px from top - `pt-16`)
  - Sidebar + Main content layout
  - Background color: `bg-slate-50` (light slate)
  - Responsive: Full width on mobile, sidebar on desktop

### Sidebar Navigation
**File**: [client/src/components/dashboard/DashboardSidebar.tsx](client/src/components/dashboard/DashboardSidebar.tsx)

- **Width**: 
  - Mobile: Full width with horizontal scroll
  - Desktop: 256px (lg:w-64)
- **Menu Items**:
  1. Overview (RiDashboardLine icon)
  2. Job Resources (RiBriefcaseLine icon)
  3. Global Jobs (RiGlobalLine icon)
  4. Events (RiCalendarEventLine icon)
  5. Community Hub (RiTeamLine icon)
  6. Profile (RiUser3Line icon)

- **Active State Styling**: 
  - Background: `bg-gradient-to-r from-yellow-400 to-yellow-500`
  - Text color: `text-blue-900`
  - Inactive: `text-gray-700 hover:bg-gray-50`

- **Icon Source**: React Icons (RiCalendarEventLine, RiBriefcaseLine, etc.)

### Dashboard Sections

#### 1. Overview (DashboardStats)
**File**: [client/src/components/dashboard/DashboardStats.tsx](client/src/components/dashboard/DashboardStats.tsx)

- Shows:
  - Welcome message with user name
  - Stats grid (4 cards): Users, Events, Jobs, Team Members
  - Recent Activity section
- Data source: `/api/stats` and `/api/stats/recent`
- Card design: White background, gradient icon backgrounds, shadow

#### 2. Events (SpecialEvents)
**File**: [client/src/components/dashboard/SpecialEvents.tsx](client/src/components/dashboard/SpecialEvents.tsx)

- Tabs: Upcoming / Past Highlights
- Search functionality
- Grid layout (3 columns on lg, 2 on md, 1 on sm)
- EventFineCard component with:
  - Image (aspect-[2/1])
  - Title + description
  - Date + location
  - Hover effects (scale image, shadow increase)
  - Click to navigate to event detail

- Color scheme:
  - Header background: `bg-gradient-to-r from-yellow-400 to-blue-600`
  - Card background: White with light border
  - Past events: Grayscale filter applied
  - Text: `text-slate-900` (headings), `text-slate-500` (descriptions)

- Data flow:
  - Fetches from `/api/events?scope=upcoming` and `/api/events?scope=past`
  - Filters results based on search term
  - Clicks navigate to `/events/{eventId}`

#### 3. Job Resources (JobResources)
**File**: [client/src/components/dashboard/JobResources.tsx](client/src/components/dashboard/JobResources.tsx)

- Two tabs: Job Opportunities / Applied Jobs
- Search + filter by job type
- Cards with job info
- Application modal for applying

#### 4. Community Hub (CommunityHub)
- Discussions and community features

#### 5. User Profile (UserProfile)
**File**: [client/src/components/dashboard/UserProfile.tsx](client/src/components/dashboard/UserProfile.tsx)

- Three tabs: Profile / Settings / Achievements
- Edit profile modal
- Resume upload
- Experience management

### Common Dashboard Patterns

**Header/Section Headers**:
```tsx
<div className="bg-gradient-to-r from-yellow-400 to-blue-600 rounded-xl p-6 text-white">
  <h1 className="text-2xl font-bold mb-2">Section Title</h1>
  <p className="text-white/90">Description</p>
</div>
```

**Card Layouts**:
- White background: `bg-white`
- Border: `border border-gray-200` or `border-slate-100`
- Rounded: `rounded-xl` or `rounded-2xl`
- Spacing: `p-4`, `p-6`, `p-8`
- Shadows: `shadow-sm` (light), `shadow-lg` (prominent)

**Grid Layouts**:
- Standard: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Responsive padding: `px-4 lg:p-10`
- Max width container: `max-w-[1400px] mx-auto`

---

## 5. ADMIN PORTAL ARCHITECTURE

### Admin Entry Point
**File**: [client/src/pages/Admin.tsx](client/src/pages/Admin.tsx)

### Admin Authentication
- Login screen with email + password
- Credentials checked against `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars
- Token stored as `adminToken` in localStorage
- Token verified on mount via `/api/auth/admin-verify`

### Admin Dashboard Sections

#### 1. Events Management Tab
- Grid of event cards (3 columns on lg, 2 on md, 1 on sm)
- Each card shows:
  - Event image
  - Title + date badge
  - Location
  - Registration count
  - "Manage" button
- "Add Event" button to create new event
- Event management modal for editing

#### 2. Team Management Tab
- Grid of team member cards
- Each card shows:
  - Member image
  - Name + role
  - Edit + Delete buttons
- "Add Member" button

### Event Management Modal
**Form Fields**:
- Title (required)
- Date (required)
- Start/End Time
- Location (required)
- Location URL (Google Maps)
- Luma Registration URL
- Meetup Registration URL
- Event Type (Meetup, Conference, Workshop, etc.)
- Capacity
- Description
- Image upload (Cloudinary)

**Process**:
1. Form submission
2. If file provided: Upload to Cloudinary under `futuregpt/events` folder
3. API POST to `/api/events/` with event data
4. Token passed in Authorization header
5. Success/error toast notification
6. Refresh events list

**Location**: Inline in [Admin.tsx](client/src/pages/Admin.tsx) - eventFormOpen modal

### Registration Management Modal
- Shows list of event registrations
- Each registration shows:
  - User name + email
  - Current status (pending/approved/rejected/etc.)
  - Status change buttons
  - Link to view full user profile

**Location**: Inline in [Admin.tsx](client/src/pages/Admin.tsx) - viewingRegistrations modal

### User Profile View Modal
- Detailed view of user from registration
- Shows full profile data

**Location**: [client/src/components/dashboard/UserProfileView.tsx](client/src/components/dashboard/UserProfileView.tsx)

### Admin UI Patterns

**Admin Header**:
- White background with admin icon + title
- Logout button top-right

**Tabs Navigation**:
- Border-bottom style active indicator
- Blue color scheme

**Action Buttons**:
- Add/Create: Blue gradient `from-blue-600 to-purple-600`
- Edit: Gray background
- Delete: Red background
- Approve: Green background
- Reject: Red background

---

## 6. CURRENT DESIGN SYSTEM

### Color Palette

#### Primary Colors
- **Yellow (Brand)**: `#FFB800` (`brand.yellow` in Tailwind config)
  - Used for: Primary accents, highlights, active states
  - Tailwind: `yellow-400`, `yellow-500`, `yellow-600`
- **Blue (Brand)**: `#0066CC` (`brand.blue` in Tailwind config)
  - Used for: Secondary accents, interactive elements
  - Tailwind: `blue-600`, `blue-700`

#### Neutral Colors
- **Text Primary**: `text-gray-900` or `text-slate-900`
- **Text Secondary**: `text-gray-600` or `text-slate-500`
- **Text Muted**: `text-gray-400` or `text-slate-400`
- **Backgrounds**: `bg-white`, `bg-gray-50`, `bg-slate-50`
- **Borders**: `border-gray-200`, `border-slate-200`, `border-slate-100`

#### Semantic Colors
- **Success**: Green (`bg-green-100`, `text-green-800`)
- **Error**: Red (`bg-red-100`, `text-red-700`)
- **Warning**: Yellow (`bg-yellow-100`, `text-yellow-800`)
- **Info**: Blue (`bg-blue-100`, `text-blue-700`)

#### Gradients
Common patterns:
```
from-yellow-400 to-blue-600        (Dashboard headers)
from-blue-600 to-purple-600        (Admin buttons, gradients)
from-blue-500 to-blue-600          (Stat card icons)
from-yellow-400 to-yellow-500      (Active sidebar items)
```

**Location**: [client/tailwind.config.js](client/tailwind.config.js)

### Typography

#### Font Family
- Default: System fonts (Tailwind default)
- No custom font imports seen
- Consistency: All components use Tailwind typography

#### Font Sizes
- Headers: `text-2xl` (h1), `text-xl` (h2), `text-lg` (h3)
- Body: `text-base`, `text-sm`, `text-xs`
- Common pattern: `text-sm font-medium` for labels

#### Font Weights
- Bold: `font-bold` (headers)
- Semibold: `font-semibold` (section titles)
- Medium: `font-medium` (labels, descriptions)
- Regular: Default weight (body text)

### Spacing System

**Uses Tailwind spacing scale**:
- Padding: `p-2`, `p-4`, `p-6`, `p-8`
- Margin: `mb-2`, `mb-4`, `mb-6`
- Gap: `gap-2`, `gap-4`, `gap-6`
- Consistent: Most containers use `p-6` or `p-8`

### Border & Radius

**Border Radius**:
- Buttons/inputs: `rounded-lg`
- Cards/modals: `rounded-xl`, `rounded-2xl`
- Large sections: `rounded-2rem` (cinematic effects)

**Borders**:
- Default card border: `border border-gray-200` or `border border-slate-100`
- Thickness: 1px (default)
- Color: Light gray/slate for soft appearance

### Shadows

- **Subtle**: `shadow-sm` (cards, light accent)
- **Medium**: `shadow-md` (hover states)
- **Large**: `shadow-lg` (modals, emphasis)
- **Extra Large**: `shadow-xl` (admin forms, modals)

### Animations & Transitions

**Transitions**:
```css
transition-all           (default)
transition-colors        (color changes)
transition-transform     (hover effects)
transition-shadow        (shadow changes)
duration-200            (fast)
duration-300            (medium)
duration-500            (slow - image hovers)
```

**Hover Effects**:
- Scale: `group-hover:scale-105` (images)
- Translate: `group-hover:-translate-x-1`
- Color: `hover:text-yellow-600`
- Background: `hover:bg-gray-50`

**Animations**:
- Pulse: `animate-pulse`
- Spin: `animate-spin`
- Fade: Framer Motion (used in EventDetail)

### Responsive Breakpoints (Tailwind)

```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

**Common Patterns**:
- Mobile first: `w-full md:flex lg:grid-cols-3`
- Hide on mobile: `hidden md:block`
- Stack on mobile: `flex-col md:flex-row`

### Component Styling Patterns

#### Buttons
- Primary: `bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900`
- Secondary: `bg-blue-600 text-white hover:bg-blue-700`
- Destructive: `bg-red-500 text-white hover:bg-red-600`
- Outlined: `border border-gray-300 text-gray-700 hover:bg-gray-50`
- Disabled: `opacity-50 cursor-not-allowed`

#### Inputs
- Default: `px-4 py-2 border border-gray-300 rounded-lg`
- Focus: `focus:ring-2 focus:ring-blue-500 focus:border-transparent`
- Error: `border-red-500`

#### Cards
- White background with subtle border and shadow
- Typically: `bg-white rounded-xl p-6 border border-gray-200 shadow-sm`
- Hover: `hover:shadow-md transition-shadow`

#### Modals
- Dark overlay: `bg-black bg-opacity-50`
- White card: `bg-white rounded-2xl shadow-2xl`
- Header: `border-b border-gray-200`
- Close button: `p-2 hover:bg-gray-100 rounded-lg`

---

## 7. EXISTING REUSABLE COMPONENTS

### UI Components Library
**Location**: [client/src/components/ui/](client/src/components/ui/)

1. **Button** (`button.tsx`)
   - CVA-based variants (class-variance-authority)
   - Props: variant, size, className
   - Use case: All interactive buttons

2. **Card** (`card.tsx`)
   - Probably wrapper component
   - Use case: Content containers

3. **Carousel** (`carousel.tsx`)
   - Embla Carousel based
   - Use case: Image/content galleries

### Dashboard Components Library
**Location**: [client/src/components/dashboard/](client/src/components/dashboard/)

1. **DashboardSidebar**
   - Reusable sidebar navigation
   - Takes no props (uses location)
   - Outputs: Menu with icons + active state

2. **DashboardStats**
   - Stats grid layout
   - Card component pattern
   - Reusable for any dashboard stat

3. **EventFineCard** (inside SpecialEvents.tsx)
   - Event card with image, title, description
   - Takes: event, onClick, isPast (optional)
   - Styling: White card, hover scale, grayscale for past events

4. **EditProfileModal**
   - Full-featured profile editor
   - Handles: Text inputs, arrays (skills/interests), file upload
   - Reusable form pattern

5. **JobApplicationModal**
   - Modal form for job application
   - Cover letter + resume upload
   - Form validation pattern

6. **UserProfileView**
   - Display-only user profile viewer
   - Used in admin registration viewer
   - Shows: Avatar, name, email, profile details

### Form Patterns (Reusable)

**Pattern 1: Text Input**
```tsx
<label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
<input
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  value={value}
  onChange={e => setValue(e.target.value)}
/>
```

**Pattern 2: File Upload**
```tsx
<input
  type="file"
  accept=".pdf"
  onChange={e => handleFileUpload(e.target.files?.[0])}
/>
```

**Pattern 3: Select Dropdown**
```tsx
<select
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  value={value}
  onChange={e => setValue(e.target.value)}
>
  <option>Option 1</option>
</select>
```

**Pattern 4: Error Display**
```tsx
{error && (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
    {error}
  </div>
)}
```

**Pattern 5: Success Notification**
```tsx
toast.success('Action successful');
toast.error('Error message');
toast.info('Info message');
```

### Layout Components
**Location**: [client/src/components/layout/](client/src/components/layout/)

1. **Header**
   - Fixed top navigation
   - Logo, nav links, auth buttons
   - Responsive hamburger menu

2. **Footer**
   - Page footer content

### Reusable Component Characteristics

All components follow these patterns:
- **TypeScript interfaces** for props
- **Responsive design** (mobile-first Tailwind)
- **Consistent spacing** (p-4, p-6, p-8)
- **Gradient accents** (yellow/blue)
- **Smooth transitions** (transition-all, duration-300)
- **Icon usage** (Lucide React or React Icons)
- **Error states** with visual feedback
- **Loading states** (spinners, skeleton screens)

---

## 8. CURRENT FILE/DOCUMENT HANDLING

### Cloudinary Integration

**Setup**: Cloudinary is configured as the primary file storage service

**Location**: [server/src/lib/cloudinary.js](server/src/lib/cloudinary.js)

**Configuration**:
- Cloud Name: `process.env.CLOUDINARY_CLOUD_NAME`
- API Key: `process.env.CLOUDINARY_API_KEY`
- API Secret: `process.env.CLOUDINARY_API_SECRET`
- All three required for initialization

### Upload Flow

**Server-Side Signing** (for client-side uploads):

**Endpoint**: `POST /api/cloudinary/sign`
- Takes: `folder`, `public_id` (optional), `eager`, `invalidate`
- Returns: Signed parameters for direct Cloudinary upload
- Location: [server/src/controllers/cloudinaryController.js](server/src/controllers/cloudinaryController.js)

**Resume Upload Specific**:
- Endpoint: `POST /api/cloudinary/sign-resume`
- Folder: `futuregpt/resumes`
- Resource type: `raw` (for PDFs)
- Returns: Signature + parameters for resume upload

### File Upload Process (Client-Side)

**Step 1: Request Signature**
```typescript
const sign = await apiCloudinarySign(token, { folder: 'futuregpt/events' });
```

**Step 2: Upload to Cloudinary**
```typescript
const form = new FormData();
form.append('file', file);
form.append('api_key', sign.apiKey);
form.append('timestamp', String(sign.timestamp));
form.append('folder', sign.folder);
form.append('signature', sign.signature);
const res = await fetch(
  `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,
  { method: 'POST', body: form }
);
const json = await res.json();
const imageUrl = json.secure_url;
```

**Step 3: Store URL in Database**
- URL stored in model field (e.g., `event.image`, `user.resumeUrl`)

**Location**: [client/src/lib/api.ts](client/src/lib/api.ts) - `apiUploadResume()`

### Supported File Types

**Images** (Events, Team Members):
- JPEG, PNG, WEBP, AVIF
- Uploaded to: `futuregpt/events`, `futuregpt/team`
- Resource type: `image` (default)

**Resumes/Documents**:
- PDF (currently enforced)
- Uploaded to: `futuregpt/resumes`
- Resource type: `raw`
- Max size: 10MB
- Validation on client-side before upload

**Existing Upload Validations** (in EditProfileModal, JobApplicationModal):
```typescript
if (file.type !== "application/pdf") {
  throw new Error("Please upload a PDF file only");
}
if (file.size > 10 * 1024 * 1024) {
  throw new Error("File size must be less than 10MB");
}
```

### Upload Use Cases Currently Implemented

1. **User Resume Upload** (EditProfileModal)
   - Field: `user.resumeUrl`
   - Type: PDF
   - API: `apiUploadResume()`

2. **Event Image Upload** (Admin event creation)
   - Field: `event.image`
   - Type: Image
   - API: `apiCloudinarySign()` + direct Cloudinary

3. **Team Member Avatar** (Admin team management)
   - Field: `teamMember.image`
   - Type: Image
   - API: `apiCloudinarySign()` + direct Cloudinary

4. **Job Application Resumes** (JobApplicationModal)
   - Field: `jobApplication.resumeUrl`
   - Type: PDF
   - API: `apiUploadResume()`

### Security Considerations in Current Implementation

**Current Protections**:
- ✅ Server-side signature generation (HMAC validation)
- ✅ Cloudinary API secret never exposed to client
- ✅ Folder-based isolation (`futuregpt/resumes`, `futuregpt/events`)
- ✅ File type validation on client
- ✅ File size limits (10MB)
- ✅ Auth required for sensitive uploads

**Current Gaps**:
- ❌ No server-side file type validation on upload completion
- ❌ No server-side file size validation
- ❌ Cloudinary URLs are direct public URLs (no access control)
- ❌ No server-side scan/validation of uploaded files
- ⚠️  Could implement private delivery via Cloudinary auth tokens

---

## 9. CURRENT DATA/PERSISTENCE MODEL

### Database Schema Overview

**Location**: [server/src/models/](server/src/models/)

#### User Model
```javascript
{
  name: String (required)
  email: String (required, unique)
  password: String (hashed)
  
  // Profile
  phone: String
  location: String
  role: String
  company: String
  bio: String
  avatar: String (emoji default)
  joinDate: Date (auto)
  resumeUrl: String (Cloudinary URL)
  
  // Arrays
  skills: [String]
  interests: [String]
  experience: [{
    company: String
    title: String
    startDate: Date
    endDate: Date (nullable)
    description: String
  }]
  
  // Premium
  isPremium: Boolean
  premiumPurchaseDate: Date
  paymentId: String
  orderId: String
  
  // Privacy
  profileVisibility: enum ['public', 'members', 'private']
  showOnlineStatus: Boolean
  allowDirectMessages: Boolean
  
  // Preferences
  emailNotifications: Boolean
  pushNotifications: Boolean
  eventReminders: Boolean
  jobAlerts: Boolean
  
  // Password Reset
  resetPasswordToken: String
  resetPasswordExpires: Date
  
  timestamps: true
}
```

#### Event Model
```javascript
{
  title: String (required)
  description: String
  date: Date (required)
  startTime: String
  endTime: String
  location: String (required)
  locationUrl: String (Google Maps)
  lumaUrl: String
  meetupUrl: String
  chapter: String
  type: enum ['Conference', 'Workshop', 'Networking', 'Career Fair', 'Webinar', 'Meetup']
  capacity: Number
  image: String (Cloudinary URL)
  
  // Metadata
  isPremium: Boolean
  price: Number
  speakers: [String]
  tags: [String]
  published: Boolean
  registrationsCount: Number
  createdBy: ObjectId (ref: User)
  
  timestamps: true
}

eventSchema.index({ date: 1, published: 1 })
```

#### EventRegistration Model
```javascript
{
  eventId: ObjectId (ref: Event, required)
  userId: ObjectId (ref: User, required)
  userName: String
  userEmail: String
  status: enum ['pending', 'approved', 'rejected', 'registered', 'waitlisted', 'cancelled']
  notes: String
  
  timestamps: true
}

eventRegistrationSchema.index({ eventId: 1, userId: 1 }, { unique: true })
// Ensures one registration per user per event
```

#### Job Model
```javascript
{
  companyId: ObjectId (ref: Company, required)
  companyName: String
  title: String
  description: String
  location: String
  type: enum ['full-time', 'part-time', 'contract', 'internship']
  
  salary: {
    min: Number
    max: Number
    currency: String (default: 'INR')
  }
  
  experience: String
  skills: [String]
  requirements: [String]
  benefits: [String]
  
  // Application Settings
  requireResume: Boolean
  allowCoverLetter: Boolean
  maxApplications: Number
  
  // Details
  department: String
  remotePolicy: enum ['remote', 'hybrid', 'onsite']
  applicationDeadline: Date
  startDate: Date
  contractDuration: String
  visaSponsorship: Boolean
  relocationAssistance: Boolean
  
  // Counters
  isActive: Boolean
  applications: Number
  
  timestamps: true
}
```

#### TeamMember Model
```javascript
{
  name: String
  role: String
  designation: String
  chapter: String
  bio: String
  image: String (Cloudinary URL, required)
  linkedin: String
  github: String
  website: String
  order: Number
  
  timestamps: true
}
```

### API Data Flow for Events

**Creating Event**:
1. Admin fills form in Admin.tsx
2. POST `/api/events/` with event data + image (if provided)
3. Server creates Event document in MongoDB
4. Returns created event

**Fetching Events**:
1. Dashboard SpecialEvents component mounts
2. Calls `apiListEvents("upcoming")` + `apiListEvents("past")`
3. GET `/api/events?scope=upcoming` (filters by date >= today)
4. Returns array of Event documents
5. Rendered as EventFineCard components

**Event Registration**:
1. User clicks event → navigates to `/events/:eventId`
2. EventDetail component loads event details + checks registration status
3. User clicks register button
4. POST `/api/events/:eventId/register` with user token
5. Server creates EventRegistration document
6. Returns registration (status: 'pending')

**Admin Views Registrations**:
1. Admin clicks event → opens registration modal
2. GET `/api/events/:eventId/registrations` with admin token
3. Server returns array of EventRegistration docs
4. Admin can approve/reject
5. PUT `/api/events/registrations/:id/status` updates status

### Storage Architecture

**Temporary Data** (Session):
- JWT tokens in localStorage
- User object in localStorage (JSON stringified)
- User object in Redux state
- Admin token in localStorage

**Persistent Data** (MongoDB):
- User profiles
- Events
- Event registrations
- Jobs
- Job applications
- Team members
- Companies
- Discussions
- Groups

**File Storage** (Cloudinary):
- User resumes
- Event images
- Team member avatars
- Job application documents

### Data Relationships

```
User
├── Many Registrations (EventRegistration.userId)
├── Many JobApplications (JobApplication.userId)
├── Many Experience items
└── One Profile

Event
├── Many Registrations (EventRegistration.eventId)
├── One Creator (Event.createdBy → User)
└── One Image (Cloudinary URL)

EventRegistration
├── One Event (EventRegistration.eventId → Event)
└── One User (EventRegistration.userId → User)

Company
├── Many Jobs (Job.companyId → Company)
└── One Owner

Job
├── One Company (Job.companyId → Company)
├── Many Applications (JobApplication.jobId → Job)
└── One Image/Files (Cloudinary URL)

TeamMember
├── One Image (Cloudinary URL)
└── Optional Links (LinkedIn, GitHub, Website)
```

---

## 10. RECOMMENDED MONTHLY EVENTS ARCHITECTURE

### High-Level Approach

The Monthly Events feature should extend the existing Event model rather than creating a parallel system. It should:

1. **Reuse EventModel** with minimal additions
2. **Reuse EventRegistration** for attendee tracking
3. **Create new Event-level Resources model** for documents
4. **Extend Admin portal** with resource management
5. **Create new Dashboard section** or integrate with SpecialEvents
6. **Reuse all existing patterns**: Cloudinary, auth, Redux, modals, cards

### Data Model Extension

#### New Model: EventResource
```javascript
// server/src/models/EventResource.js
{
  eventId: ObjectId (ref: Event, required)
  
  // Resource Metadata
  title: String (required)
  description: String
  type: enum ['ppt', 'pdf', 'doc', 'link', 'notes']
  
  // File/Link Storage
  fileUrl: String (Cloudinary URL for files)
  externalLink: String (for URLs)
  
  // Attribution
  speaker: String (speaker name)
  speakerTitle: String (speaker's role/designation)
  speakerCompany: String
  speakerLinkedIn: String
  
  // Access Control
  isPublic: Boolean (viewable without login)
  requiresAuthentication: Boolean
  
  // Metadata
  uploadedBy: ObjectId (ref: User, admin)
  order: Number (for sorting)
  
  timestamps: true
}
```

#### Extended Event Model
```javascript
// Extensions to server/src/models/Event.js
{
  // ... existing fields ...
  
  // Speaker Information (Monthly Events Specific)
  speaker: {
    name: String
    title: String
    company: String
    linkedinUrl: String
    profileImage: String (Cloudinary URL)
  }
  
  // Monthly Event Specific
  isMonthlyEvent: Boolean (flag to identify monthly events)
  isFeatured: Boolean (highlight as "Next Event")
  
  // Resources Array (for inline reference)
  resources: [ObjectId] (ref: EventResource)
  
  // Event URLs
  registrationUrl: String (primary registration link)
  
  timestamps: true
}
```

**Rationale**:
- Minimal schema changes to existing Event model
- New EventResource model keeps resources separate but linked
- Using ObjectId references maintains MongoDB relationship integrity
- Follows existing pattern (EventRegistration → Event)

### Frontend Structure

#### New Components

1. **MonthlyEventsOverview** (Dashboard Section)
   - "Next Event" prominent section (featured event)
   - Reuses EventFineCard pattern
   - Location: `client/src/components/dashboard/MonthlyEventsOverview.tsx`

2. **EventResourceCard** (Reusable)
   - Displays individual resource (PPT, PDF, Document, Link)
   - Shows: Icon, title, description, download/link button
   - Styling: Matches existing card patterns
   - Location: `client/src/components/dashboard/EventResourceCard.tsx`

3. **MonthlyEventDetail** (Page Enhancement)
   - Extends/replaces EventDetail component
   - Shows: Event info + Resources section
   - Resources visible only to logged-in users
   - Location: Extend [client/src/components/dashboard/EventDetail.tsx](client/src/components/dashboard/EventDetail.tsx)

#### Modified Components

1. **DashboardSidebar**
   - No changes initially, but could add "Monthly Events" nav item if needed

2. **SpecialEvents**
   - Add filter/toggle for "Monthly Events" vs regular events
   - Or create separate MonthlyEvents component

#### New Admin Components

1. **EventResourceManager** (Admin)
   - Resource CRUD interface
   - Upload files via Cloudinary
   - Manage resource metadata
   - Location: `client/src/components/admin/EventResourceManager.tsx`

2. **EnhancedEventForm** (Admin)
   - Extend existing event form
   - Add speaker details section
   - Add resource management section
   - Location: Extend [Admin.tsx](client/src/pages/Admin.tsx)

### API Structure

#### New Endpoints

```
// Resources
POST   /api/events/:eventId/resources          Create resource (admin)
GET    /api/events/:eventId/resources          List resources (public/auth-filtered)
GET    /api/events/:eventId/resources/:resId   Get single resource
PUT    /api/events/:eventId/resources/:resId   Update resource (admin)
DELETE /api/events/:eventId/resources/:resId   Delete resource (admin)

// Event Enhancement (existing endpoints extended)
PUT    /api/events/:eventId                    Update event (admin) - now includes speaker info
GET    /api/events/monthly                     List monthly events (public filter)
GET    /api/events/:eventId                    Get event (returns with speaker + resources)
```

#### API Controllers

Create: `server/src/controllers/eventResourceController.js`
- CRUD operations for EventResource
- File upload handling (Cloudinary signing)
- Access control checks

Update: `server/src/controllers/eventController.js`
- Extend existing endpoints for speaker data
- Return populated resources in event response

### Frontend State Management

**No Redux changes needed** - can use local component state and API calls

Optional: Extend Redux userSlice if Monthly Events need to be cached at app level

### File Upload/Storage

**Reuse existing Cloudinary pattern**:
- Endpoint: `POST /api/cloudinary/sign` (existing)
- Folders:
  - `futuregpt/events/resources/ppt` for presentations
  - `futuregpt/events/resources/pdf` for PDFs
  - `futuregpt/events/resources/docs` for documents
  - `futuregpt/events/speakers` for speaker images

**File Size Limits**:
- Documents: 50MB (larger than resume 10MB)
- Images: 5MB
- Validation on client and server

---

## 11. RECOMMENDED DATA MODEL

### MongoDB Collections

#### 1. Events Collection (Extended)
```javascript
// Existing + new fields for Monthly Events
{
  _id: ObjectId
  
  // Existing
  title: String
  description: String
  date: Date
  startTime: String
  endTime: String
  location: String
  locationUrl: String
  chapter: String
  type: String
  capacity: Number
  image: String
  speakers: [String] (legacy - keep for compatibility)
  published: Boolean
  registrationsCount: Number
  createdBy: ObjectId
  timestamps: Date
  
  // NEW - Speaker Details (replaces legacy speakers array)
  speaker: {
    name: String,
    title: String,
    company: String,
    linkedinUrl: String,
    profileImage: String
  }
  
  // NEW - Monthly Event flags
  isMonthlyEvent: Boolean
  isFeatured: Boolean
  registrationUrl: String
  
  // NEW - Resource references
  resources: [ObjectId] (populated on GET)
}
```

#### 2. EventResources Collection (NEW)
```javascript
{
  _id: ObjectId
  
  eventId: ObjectId (ref: Event)
  
  // Metadata
  title: String
  description: String
  type: enum ['ppt', 'pdf', 'doc', 'link', 'notes', 'video', 'image']
  
  // Content
  fileUrl: String (Cloudinary URL)
  externalLink: String
  
  // Attribution
  speaker: {
    name: String
    title: String
    linkedinUrl: String
  }
  
  // Access
  isPublic: Boolean
  requiresAuthentication: Boolean
  
  // Management
  uploadedBy: ObjectId (ref: User - admin)
  order: Number
  
  timestamps: Date
}
```

#### 3. EventRegistrations Collection (No changes)
Already handles registration tracking with status workflow

### Access Control Matrix

| Action | Unauthenticated | Authenticated User | Admin |
|--------|---|---|---|
| View Next Event | ✅ | ✅ | ✅ |
| View Event Details | ✅ | ✅ | ✅ |
| View Public Resources | ✅ | ✅ | ✅ |
| View Auth Resources | ❌ | ✅ | ✅ |
| Download Resources | ❌ | ✅ | ✅ |
| Register for Event | ❌ (→Login) | ✅ | ✅ |
| Create Event | ❌ | ❌ | ✅ |
| Upload Resource | ❌ | ❌ | ✅ |
| Manage Resources | ❌ | ❌ | ✅ |

---

## 12. RECOMMENDED ADMIN CONTROLS

### Admin UI Location
Extend existing [client/src/pages/Admin.tsx](client/src/pages/Admin.tsx)

### Resource Management Section

#### 1. Event Selection
- Dropdown or modal to select which event to manage resources for
- Only show published events

#### 2. Resource Management Interface
- **List View**: Table/card grid of resources
  - Columns: Title, Type, Speaker, Public/Private, Actions
  - Each row has: Edit, Delete, Move Up/Down, Preview buttons

- **Create Resource Form**:
  - Title (required)
  - Description
  - Type (dropdown: PPT, PDF, DOC, Link, Notes)
  - File upload OR external URL (conditional)
  - Speaker name / Title / LinkedIn URL
  - Public/Private toggle
  - Order/position slider

- **Edit Resource Modal**:
  - Same as create form, pre-populated
  - Upload new file or keep existing
  - Update metadata

- **Delete Confirmation**:
  - Modal confirmation
  - Shows resource title
  - Irreversible action

### Speaker Information Management
- Integrated with event edit form
- Fields:
  - Speaker Name
  - Speaker Title/Designation
  - Speaker Company
  - Speaker LinkedIn URL
  - Speaker Profile Image (upload to Cloudinary)

### Event Management Enhancements
- Add "Featured" toggle (marks as "Next Event")
- Add "Monthly Event" toggle
- Update "Registration URL" field

### Bulk Actions (Future)
- Publish multiple resources
- Reorder all resources at once
- Copy resources from another event

---

## 13. RECOMMENDED USER FLOW

### Unauthenticated User Flow

1. **Landing/Home Page**
   - Sees "Featured Monthly Event" or "Next Event" highlight
   - Teaser with event image, date, speaker name, short description
   - "Learn More" button

2. **Click "Learn More"**
   - Navigates to `/events/:eventId`
   - Sees full event details
   - Sees public resources (presentations, notes)
   - Sees "Sign in to access resources" for protected content

3. **Click Resource**
   - If public: Opens/downloads resource
   - If protected: Modal appears with message "Sign in to download this resource"
   - Options: "Sign In" or "Sign Up" buttons

4. **Authentication Flow**
   - Redirected to `/login` or signup
   - After auth: Returns to same event/resource page
   - Can now download protected resources

5. **Register for Event**
   - Must be authenticated
   - Click "Register" button
   - Status: Pending (awaits admin approval)
   - Shows confirmation: "You've registered! Awaiting confirmation."

### Authenticated User Flow

1. **Dashboard → Events**
   - Navigates to `/dashboard/events`
   - Sees "Next Event" featured section (if exists)
   - Sees upcoming and past events in cards

2. **View Event Details**
   - Clicks event card
   - Navigates to `/events/:eventId`
   - Sees full event details with speaker info
   - Can download all resources (public + private)
   - Can register for event

3. **Register for Event**
   - Clicks "Register" button
   - Status becomes: Pending → Approved (after admin)
   - Can view registration status
   - Receives confirmation (email/notification)

4. **Access Resources**
   - Downloads/views event materials
   - Presentations (PPT/PDF)
   - Speaker notes
   - External resource links
   - Video recordings (if added)

5. **Post-Event**
   - Event moves to "Past Highlights" section
   - Resources remain accessible
   - Can still download materials
   - Can view event details

### Admin Workflow

1. **Admin Login**
   - `/admin` page
   - Email/password authentication

2. **Create Monthly Event**
   - Click "Add Event" button
   - Fill form: Title, date, location, speaker details
   - Upload event banner image
   - Set as "Monthly Event" and optionally "Featured"
   - Publish event

3. **Add Resources**
   - Select event from dropdown
   - Click "Add Resource"
   - Choose type: PPT, PDF, DOC, Link, Notes
   - Upload file or enter URL
   - Add speaker attribution
   - Set public/private visibility
   - Save resource

4. **Manage Resources**
   - View list of resources for event
   - Reorder (drag/up-down buttons)
   - Edit metadata
   - Delete resources
   - Toggle public/private

5. **View Registrations**
   - Click event → "View Registrations"
   - See list of registered users
   - Approve/reject registrations
   - View detailed user profiles
   - Export registration list (future)

6. **Publish/Unpublish**
   - Toggle event published status
   - Unpublished events hidden from users

---

## 14. SECURITY CONSIDERATIONS

### Current Implementation Security

**✅ What's Already Protected**:

1. **Authentication**
   - JWT tokens with 7-day expiry
   - Tokens validated on every protected request
   - Password hashing with bcryptjs

2. **Authorization**
   - Admin middleware checks email against `ADMIN_EMAIL` env var
   - Protected routes via ProtectedRoute component
   - API endpoints require auth middleware

3. **File Upload**
   - Cloudinary-side validation
   - Client-side type/size checking (10MB PDFs)
   - API secret never exposed to client
   - Signature-based upload validation

4. **Environment Secrets**
   - Sensitive data in .env (not committed)
   - API secrets server-side only

**⚠️ Potential Vulnerabilities for Monthly Events**:

### 1. Resource Access Control (CRITICAL)

**Issue**: Unauthenticated users could potentially access protected resources via direct URL

**Current State**: 
- Cloudinary URLs are public
- No Cloudinary auth tokens or delivery restrictions
- Direct file access if URL is known

**Mitigation Strategy**:
```
Option A (Recommended):
- Store file references only (not full URLs)
- Backend serves files via authenticated endpoint
- `/api/events/:eventId/resources/:resId/download`
- Check: User auth + EventResource.requiresAuthentication
- Redirect to signed Cloudinary URL or stream file

Option B (Simpler):
- Use Cloudinary signed delivery URLs (requires setup)
- Generate signed URLs that expire
- Valid only for authenticated users
- Store expiring URLs in response

Current Recommendation: Implement Option A
- Most secure
- Gives full control over access
- Follows existing pattern (auth middleware)
```

### 2. IDOR (Insecure Direct Object Reference)

**Issue**: User could access resources from events they don't have access to

**Example**: 
```
GET /api/events/65f2a3b4c1d2e3f4g5h6i7j8/resources/5a1b2c3d4e5f6g7h8i9j0
User A accesses Event B's resources without permission
```

**Mitigation**:
```javascript
// In eventResourceController.js
async function getResource(req, res) {
  const resource = await EventResource.findById(req.params.resId);
  if (!resource) return res.status(404).json({ message: 'Not found' });
  
  // Check access permissions
  const event = await Event.findById(resource.eventId);
  if (!event.published && req.user.email !== ADMIN_EMAIL) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  
  if (resource.requiresAuthentication && !req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  return res.json(resource);
}
```

### 3. File Upload Validation

**Current Gaps**:
- Only client-side type checking
- No server-side validation of uploaded file contents
- No virus/malware scanning

**Recommendations**:
```
1. Server-side file type validation
   - Check file magic bytes (not just extension)
   - Validate PDF headers before storing

2. File size limits
   - PPT: 50MB max
   - PDF: 50MB max
   - Images: 5MB max
   - Enforce on server-side

3. Malware scanning (Optional)
   - Integrate ClamAV or VirusTotal API
   - Scan files before marking as ready

4. Filename sanitization
   - Remove special characters
   - Use UUID for storage names
   - Current implementation: Cloudinary handles this
```

### 4. External URL Validation

**Risk**: Admin could add malicious URLs or phishing links

**Type**: URL-based resources (external links)

**Mitigation**:
```javascript
// Validate URLs on server
function isValidResourceUrl(url) {
  try {
    const parsed = new URL(url);
    // Whitelist: https only
    if (parsed.protocol !== 'https:') return false;
    
    // Blacklist known phishing domains (optional)
    // Whitelist: company domains + trusted services
    
    return true;
  } catch {
    return false;
  }
}

// Sanitize URLs in frontend display
<a href={sanitizeUrl(resource.externalLink)} target="_blank" rel="noopener noreferrer">
```

### 5. XSS (Cross-Site Scripting)

**Risk**: Malicious HTML/script in event descriptions, resource titles

**Current Protection**:
- React escapes content by default in JSX
- Titles/descriptions not rendered as HTML

**Maintain Safety**:
- Never use `dangerouslySetInnerHTML`
- Sanitize any user-generated HTML if needed
- Use libraries like `xss` or `sanitize-html` if HTML needed

```javascript
// If allowing HTML descriptions (not recommended)
import DOMPurify from 'dompurify';
const sanitized = DOMPurify.sanitize(description);
```

### 6. SQL Injection / NoSQL Injection

**Current Status**: ✅ Protected
- Using Mongoose/MongoDB with parameterized queries
- No raw query concatenation observed

### 7. CSRF (Cross-Site Request Forgery)

**Current Status**: ✅ Protected
- Using JWT tokens (not cookies)
- Tokens must be in header
- Can't be stolen via redirects

### 8. Authentication Bypass Risks

**Risk**: Password reset token generation

**Current Implementation**: 
- In [authController.js](server/src/controllers/authController.js)
- Tokens stored in User model
- Tokens have expiry time

**Ensure**:
- Tokens are cryptographically random (using crypto.randomBytes)
- Tokens are stored hashed (not plaintext)
- Tokens expire quickly (15-30 min)
- One-time use only

### 9. Admin Authorization Flaws

**Current**: Checks email against env var `ADMIN_EMAIL`

**Risk**: 
- Only one admin email supported
- No role-based access control
- No audit logging of admin actions

**Recommendations**:
```javascript
// Could implement role-based approach
const adminEmails = ['admin1@example.com', 'admin2@example.com'];

// Or add role field to User
// user.role: 'admin' | 'moderator' | 'user'

// Add audit logging
async function logAdminAction(userId, action, resourceId) {
  await AdminAuditLog.create({
    userId,
    action,
    resourceId,
    timestamp: new Date()
  });
}
```

### 10. Rate Limiting

**Current Status**: ❌ Not implemented

**Recommendations**:
```javascript
// Add rate limiting for:
// 1. Login attempts (prevent brute force)
// 2. File uploads (prevent DOS)
// 3. Resource downloads (prevent bandwidth abuse)

const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 attempts
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10 // 10 uploads per hour
});

app.post('/api/auth/login', loginLimiter, login);
app.post('/api/events/:eventId/resources', uploadLimiter, createResource);
```

### 11. Sensitive Data Exposure

**Current Practices**:
- User passwords hashed ✅
- API secrets in env vars ✅
- JWT in localStorage (vulnerable to XSS) ⚠️

**Recommendations**:
- Consider HTTP-only cookies for auth (more secure than localStorage)
- Never log sensitive data (passwords, tokens)
- Implement CSP (Content Security Policy) headers
- Validate/sanitize all user inputs

### Security Checklist for Monthly Events Implementation

- [ ] Implement server-side resource access control
- [ ] Validate external URLs before storing
- [ ] Add file type validation (magic bytes, not just extension)
- [ ] Implement file size limits on server
- [ ] Add rate limiting for uploads/downloads
- [ ] Implement audit logging for admin actions
- [ ] Validate speaker URL/LinkedIn URLs
- [ ] Sanitize all text inputs
- [ ] Test IDOR vulnerabilities
- [ ] Test XSS with malicious event descriptions
- [ ] Implement optional malware scanning
- [ ] Document security considerations for team

---

## 15. FILES THAT WOULD NEED TO CHANGE

### Backend Files

#### 1. Models
- ✏️ **[server/src/models/Event.js](server/src/models/Event.js)**
  - Add speaker object fields
  - Add isMonthlyEvent, isFeatured boolean flags
  - Add registrationUrl field

- ✨ **[server/src/models/EventResource.js](server/src/models/EventResource.js)** (NEW)
  - Create new model for resources

- ✏️ **[server/src/models/EventRegistration.js](server/src/models/EventRegistration.js)**
  - Possibly add registrationStatus history tracking (optional)

#### 2. Controllers
- ✏️ **[server/src/controllers/eventController.js](server/src/controllers/eventController.js)**
  - Update `updateEvent()` to handle speaker data
  - Update `getEvent()` to populate resources
  - Possibly update `listEvents()` to support filtering by monthly events

- ✨ **[server/src/controllers/eventResourceController.js](server/src/controllers/eventResourceController.js)** (NEW)
  - CRUD operations for EventResource
  - File upload orchestration
  - Access control checks

#### 3. Routes
- ✏️ **[server/src/routes/events.js](server/src/routes/events.js)**
  - Update PUT /api/events/:id (for speaker info)
  - Add resource endpoints

- ✨ **[server/src/routes/eventResources.js](server/src/routes/eventResources.js)** (NEW)
  - All resource routes

#### 4. Middleware
- ✏️ **[server/src/middleware/auth.js](server/src/middleware/auth.js)**
  - Possibly add optional auth (allow requests with or without token)
  - Or create new middleware for public/private filtering

#### 5. Library
- ✏️ **[server/src/lib/cloudinary.js](server/src/lib/cloudinary.js)**
  - No changes, but config already supports multiple folders

### Frontend Files

#### 1. Pages
- ✏️ **[client/src/pages/Admin.tsx](client/src/pages/Admin.tsx)**
  - Extend event form with speaker fields
  - Add resource management tab/section

#### 2. Components
- ✏️ **[client/src/components/dashboard/SpecialEvents.tsx](client/src/components/dashboard/SpecialEvents.tsx)**
  - Add "Featured Event" or "Next Event" section at top
  - Add monthly events filter (optional)

- ✏️ **[client/src/components/dashboard/EventDetail.tsx](client/src/components/dashboard/EventDetail.tsx)**
  - Add speaker information section
  - Add resources section
  - Implement access control logic

- ✨ **[client/src/components/dashboard/EventResourceCard.tsx](client/src/components/dashboard/EventResourceCard.tsx)** (NEW)
  - Reusable component for displaying resources

- ✨ **[client/src/components/dashboard/MonthlyEventsOverview.tsx](client/src/components/dashboard/MonthlyEventsOverview.tsx)** (NEW)
  - Featured monthly events section

- ✨ **[client/src/components/admin/EventResourceManager.tsx](client/src/components/admin/EventResourceManager.tsx)** (NEW)
  - Resource management UI for admins

#### 3. Types
- ✏️ **[client/src/types/index.ts](client/src/types/index.ts)**
  - Extend Event interface with speaker, isMonthlyEvent, isFeatured, registrationUrl
  - Add EventResource interface

#### 4. API
- ✏️ **[client/src/lib/api.ts](client/src/lib/api.ts)**
  - Add functions for resource CRUD:
    - `apiListEventResources()`
    - `apiGetEventResource()`
    - `apiCreateEventResource()`
    - `apiUpdateEventResource()`
    - `apiDeleteEventResource()`
  - Extend existing event functions if needed

#### 5. Redux (Optional)
- Could extend userSlice to cache recent events/resources
- Or continue using local state + API calls

#### 6. Styling
- ✏️ **[client/tailwind.config.js](client/tailwind.config.js)**
  - No changes likely needed - use existing color system

---

## 16. FILES THAT SHOULD NOT BE TOUCHED

**DO NOT MODIFY** unless absolutely necessary:

### Core Framework
- ❌ [client/src/main.tsx](client/src/main.tsx) - Entry point
- ❌ [client/src/App.tsx](client/src/App.tsx) - Only if adding new route (minimal)
- ❌ [client/vite.config.ts](client/vite.config.ts) - Build configuration
- ❌ [server/index.js](server/index.js) - Server entry point (only if adding routes, minimal)

### Authentication & Authorization
- ❌ [client/src/components/auth/ProtectedRoute.tsx](client/src/components/auth/ProtectedRoute.tsx)
- ❌ [client/src/components/auth/LoginForm.tsx](client/src/components/auth/LoginForm.tsx)
- ❌ [server/src/middleware/auth.js](server/src/middleware/auth.js) - Unless extending for optional auth
- ❌ [server/src/middleware/admin.js](server/src/middleware/admin.js)

### Existing Features
- ❌ [client/src/components/dashboard/DashboardSidebar.tsx](client/src/components/dashboard/DashboardSidebar.tsx) - Navigation
- ❌ [client/src/components/dashboard/JobResources.tsx](client/src/components/dashboard/JobResources.tsx) - Job section
- ❌ [client/src/components/dashboard/UserProfile.tsx](client/src/components/dashboard/UserProfile.tsx) - User profile
- ❌ [server/src/models/User.js](server/src/models/User.js)
- ❌ [server/src/models/Job.js](server/src/models/Job.js)
- ❌ [server/src/models/Company.js](server/src/models/Company.js)
- ❌ [server/src/controllers/jobController.js](server/src/controllers/jobController.js)
- ❌ [server/src/routes/company.js](server/src/routes/company.js)

### Design System
- ❌ [client/src/index.css](client/src/index.css) - Global styles
- ❌ [client/tailwind.config.js](client/tailwind.config.js) - Unless adding new colors

### Deployment Config
- ❌ [package.json](package.json) files - Unless adding new dependencies (minimal)
- ❌ [vercel.json](vercel.json) files

---

## 17. IMPLEMENTATION PLAN

### Phase 1: Foundation (Week 1)

#### Backend
1. Create EventResource model [server/src/models/EventResource.js]
2. Update Event model with speaker + monthly flags
3. Create eventResourceController.js with basic CRUD
4. Create eventResources routes

#### Frontend
1. Update Event type definition in types/index.ts
2. Add EventResource type
3. Add API functions in api.ts

#### Testing
- Verify database connection
- Test resource creation via API
- Test resource retrieval

### Phase 2: Admin Interface (Week 1-2)

#### Backend
- Implement access control for resources
- Implement file size/type validation

#### Frontend
1. Extend Admin event form with speaker fields
2. Create EventResourceManager component
3. Integrate resource upload with Cloudinary
4. Test resource CRUD operations

#### Testing
- Admin can create events with speaker info
- Admin can upload resources
- Admin can edit/delete resources

### Phase 3: User-Facing Display (Week 2)

#### Frontend
1. Update EventDetail to show speaker info
2. Add Resources section to EventDetail
3. Implement access control logic (show/hide based on auth)
4. Create EventResourceCard component
5. Add download/link functionality

#### Backend
- Implement resource access logging (optional)

#### Testing
- Unauthenticated users see public resources only
- Authenticated users see all resources
- Resource downloads work
- External links work

### Phase 4: Dashboard Integration (Week 2-3)

#### Frontend
1. Create MonthlyEventsOverview component
2. Integrate with SpecialEvents dashboard section
3. Add featured event display
4. Add monthly events filter

#### Backend
- Add database indexes for performance

#### Testing
- Dashboard shows featured event
- Monthly events are properly filtered
- Navigation works smoothly

### Phase 5: Polish & Optimization (Week 3)

#### Security
1. Implement resource access control endpoint
2. Add rate limiting
3. Validate external URLs
4. Add audit logging

#### Performance
1. Add caching for popular resources
2. Optimize Cloudinary delivery
3. Lazy load resources on detail page

#### UX
1. Add loading states
2. Add error handling
3. Add empty states
4. Mobile responsiveness testing

### Phase 6: Testing & Deployment (Week 3-4)

#### Testing
- Unit tests for controllers
- Integration tests for API
- E2E tests for user flows
- Security testing (IDOR, XSS, etc.)

#### Documentation
- Update README with Monthly Events info
- Document API endpoints
- Add admin guide

#### Deployment
- Deploy to staging
- Test in production-like environment
- Deploy to production
- Monitor for issues

---

## READY FOR IMPLEMENTATION

### Summary

The FutureGPT codebase has a **solid, well-organized foundation** perfect for adding the Monthly Events feature:

**✅ Strengths**:
- Clean separation of concerns (client/server)
- Consistent architectural patterns
- Modern tech stack (React, Express, MongoDB)
- Existing file upload infrastructure (Cloudinary)
- Well-implemented authentication/authorization
- Established design system with colors and components
- Reusable component patterns throughout

**Key Architectural Insights**:
- Event model already exists - minimal schema changes needed
- Admin portal already has CRUD patterns - can be extended
- Cloudinary integration proven - perfect for resources
- EventRegistration model already handles attendee tracking
- Dashboard architecture allows for new sections easily

**Recommended Approach**:
1. **Minimize database changes**: Just extend Event model + create EventResource
2. **Maximize component reuse**: Use existing patterns (cards, modals, forms)
3. **Follow existing patterns**: Admin controls, API structure, Cloudinary uploads
4. **Implement incrementally**: Foundation → Admin → User-facing → Polish
5. **Preserve design language**: Use existing colors, spacing, typography

**Technology Stack Remains**:
- No new dependencies required
- Can reuse: Redux, Tailwind, Lucide icons, React Router
- Cloudinary already configured
- JWT auth already functional

**Security Priority**:
1. Resource access control (CRITICAL)
2. External URL validation
3. File upload validation
4. Rate limiting
5. Audit logging

### Next Steps

When ready to implement:

1. ✅ Review this analysis document with team
2. ✅ Confirm database schema additions
3. ✅ Assign tasks from Implementation Plan
4. ✅ Set up feature branch
5. ✅ Begin Phase 1 implementation
6. ✅ Follow security checklist during development

**Estimated Timeline**: 3-4 weeks for full implementation with testing

**Success Criteria**:
- Monthly Events display in dashboard
- Admin can create/manage events with resources
- Users can download event materials (with auth checks)
- All existing functionality remains unchanged
- Security vulnerabilities addressed

---

**END OF ANALYSIS**

*This document represents a complete analysis of the existing codebase.*  
*NO CODE MODIFICATIONS HAVE BEEN MADE.*  
*Ready for development team to proceed with implementation.*
