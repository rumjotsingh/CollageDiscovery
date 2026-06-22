# Product Requirements Document (PRD)
## CollegeIQ Frontend — College Discovery Platform

**Version:** 1.0  
**Date:** June 21, 2026  
**Product:** CollegeIQ (frontend)  
**Stack:** Next.js 16 · React 19 · TypeScript · TanStack Query · Tailwind CSS 4 · shadcn/ui

---

## 1. Executive Summary

CollegeIQ is a web application that helps Indian students and parents **discover, compare, and shortlist engineering and higher-education colleges**. The frontend is a Next.js App Router application branded as **CollegeIQ**, consuming a NestJS REST API for colleges, auth, reviews, saved lists, comparisons, discussions, and courses.

The product follows a **browse-first, login-when-needed** model: most discovery flows work without an account; authentication is required for saving colleges, posting reviews, Q&A, and persisting comparisons.

---

## 2. Problem Statement

Choosing a college in India involves fragmented data across portals, forums, and brochures. Students need a single place to:

- Search and filter colleges by fees, location, and ratings
- Compare institutions side-by-side on placements and cost
- Read peer reviews and ask community questions
- Build and revisit a personal shortlist

CollegeIQ frontend addresses this with a fast, mobile-friendly UI focused on data clarity and low friction.

---

## 3. Goals & Success Metrics

### Product Goals

| Goal | Description |
|------|-------------|
| **Discover** | Find relevant colleges in under 30 seconds |
| **Compare** | Evaluate 2–4 colleges on key metrics in one view |
| **Retain** | Let signed-in users save colleges and comparisons |
| **Engage** | Enable reviews and Q&A on college detail pages |
| **Inform** | Surface exams, careers, and courses as supporting content |

### Success Metrics (KPIs)

| Metric | Target (MVP) |
|--------|----------------|
| College detail page views / session | ≥ 2 |
| Compare tool usage rate | ≥ 15% of college browsers |
| Save conversion (logged-in users) | ≥ 3 colleges saved per active user |
| Search-to-detail click-through | ≥ 25% |
| Auth modal completion rate | ≥ 40% after gated action |
| Page load (LCP) | < 2.5s on 4G |
| API error rate (client-visible) | < 1% |

---

## 4. Target Users & Personas

### Primary Personas

**1. Aarav — Class 12 Student (17)**

- Preparing for JEE/state entrance exams
- Needs fee filters, placement stats, and peer reviews
- Often browses on mobile; may not create an account immediately

**2. Priya — Parent (45)**

- Researching options for her child
- Cares about fees, location, and placement packages
- Wants printable/shareable comparison views

**3. Rahul — Returning User (20)**

- Already shortlisted 5–10 colleges
- Uses Saved list and saved comparisons
- Posts reviews and answers Q&A threads

### Secondary Personas

- **Counselor / mentor** — Uses compare and export (future)
- **Demo evaluator** — Uses one-click demo login to explore features

---

## 5. User Journeys

### Journey A: Anonymous Discovery

```
Home (/) → Search or Browse Colleges (/colleges)
         → Apply filters (state, city, fees, rating)
         → Open College Detail (/colleges/[slug])
         → Read overview, courses, placements, reviews
         → (Optional) Add to Compare
```

### Journey B: Compare & Decide

```
Compare (/compare) → Search & select up to 4 colleges
                    → Auto-generated comparison table
                    → (Optional) Login → Save comparison with name
                    → Load saved comparisons later
```

### Journey C: Auth-Gated Actions

```
User taps Save / Review / Q&A / Save Comparison
→ Login modal opens (login or register)
→ On success, pending action runs automatically
→ User continues without losing context
```

### Journey D: Signed-In Shortlist

```
Login → Saved (/saved) → View bookmarked colleges
      → Remove from list or open detail
      → Profile (/profile) → Sign out
```

---

## 6. Information Architecture

### Active Routes

| Route | Page | Shell | Auth |
|-------|------|-------|------|
| `/` | Home — hero search + top colleges | PublicShell | Public |
| `/colleges` | College listing (table + filters) | PublicShell | Public |
| `/colleges/[slug]` | College detail (tabs) | PublicShell | Public (gated actions) |
| `/compare` | Side-by-side comparison | PublicShell | Public (save gated) |
| `/saved` | Saved colleges list | PublicShell | Required |
| `/profile` | User profile & sign out | PublicShell | Required |
| `/dashboard` | Overview stats + quick links | AppShell | Public |
| `/courses` | Course search listing | PublicShell | Public |
| `/exams`, `/exams/[slug]` | Entrance exam guides | PublicShell | Public (static data) |
| `/careers`, `/careers/[slug]` | Career path guides | PublicShell | Public (static data) |

### Redirects (legacy / consolidation)

| Route | Behavior |
|-------|----------|
| `/explore` | Redirects to `/colleges` |
| `/welcome` | Redirects to `/` |

### Primary Navigation (header)

- Colleges
- Compare
- Saved

Exams, careers, and courses exist but are **not** in main nav today.

---

## 7. Functional Requirements

### 7.1 Home (`/`)

| ID | Requirement | Priority |
|----|-------------|----------|
| HOME-01 | Hero with headline, search bar, and CTA buttons (Browse, Compare) | P0 |
| HOME-02 | Search submits to `/colleges?search=…` | P0 |
| HOME-03 | "Top Colleges" grid — top 6 by rating from API | P0 |
| HOME-04 | Loading skeletons while fetching | P1 |
| HOME-05 | Framer Motion entrance animation | P2 |

### 7.2 College Listing (`/colleges`)

| ID | Requirement | Priority |
|----|-------------|----------|
| LIST-01 | Debounced text search (300ms) | P0 |
| LIST-02 | Sidebar filters: state, city, min/max fees, min rating | P0 |
| LIST-03 | Quick filter chips: 4+ rating, fee bands, top rated | P0 |
| LIST-04 | Paginated table with infinite scroll | P0 |
| LIST-05 | Columns: name, state, city, UG fees, rating, actions | P0 |
| LIST-06 | Inline save/unsave with auth gate | P0 |
| LIST-07 | URL `?search=` param support from home | P0 |
| LIST-08 | Mobile: collapsible filter panel | P1 |
| LIST-09 | Empty and error states with retry | P0 |
| LIST-10 | Total college count in header | P1 |

### 7.3 College Detail (`/colleges/[slug]`)

| ID | Requirement | Priority |
|----|-------------|----------|
| DET-01 | Fetch college by slug | P0 |
| DET-02 | Header: name, location, established year, save button | P0 |
| DET-03 | Stat badges: fees, avg placement, rating | P0 |
| DET-04 | Tabbed content: Overview, Courses, Placements, Reviews, Q&A | P0 |
| DET-05 | Overview: description + dimension scores (academic, faculty, etc.) | P1 |
| DET-06 | Courses: name, duration, fees per course | P0 |
| DET-07 | Placements: avg/highest package, placement % | P0 |
| DET-08 | Reviews: list + write review (auth, 1–5 stars + comment) | P0 |
| DET-09 | Q&A: ask question, list threads, post answers (auth) | P1 |
| DET-10 | Validation: question title ≥5 chars, body/answer ≥10 chars | P1 |
| DET-11 | Link to Compare page | P2 |
| DET-12 | 404 / error state with retry | P0 |

### 7.4 Compare (`/compare`)

| ID | Requirement | Priority |
|----|-------------|----------|
| CMP-01 | Select 2–4 colleges via search picker | P0 |
| CMP-02 | Auto-fetch comparison when ≥2 selected | P0 |
| CMP-03 | Comparison table: location, fees, rating, established, placement metrics | P0 |
| CMP-04 | Highlight best value per row (higher/lower is better) | P1 |
| CMP-05 | Remove colleges from selection | P0 |
| CMP-06 | Save comparison with custom name (auth) | P1 |
| CMP-07 | List, load, and delete saved comparisons (auth) | P1 |
| CMP-08 | Search debounced college picker | P0 |

**Note:** Backend supports 2–5 colleges; frontend caps at 4 — align in a future release.

### 7.5 Saved Colleges (`/saved`)

| ID | Requirement | Priority |
|----|-------------|----------|
| SAV-01 | Redirect unauthenticated users to login CTA | P0 |
| SAV-02 | List saved colleges with location, fees, rating | P0 |
| SAV-03 | Remove from saved (optimistic updates) | P0 |
| SAV-04 | Empty state with link to browse | P0 |
| SAV-05 | Error state with retry | P0 |

### 7.6 Authentication

| ID | Requirement | Priority |
|----|-------------|----------|
| AUTH-01 | Global login modal (login + register) | P0 |
| AUTH-02 | JWT stored in `localStorage` | P0 |
| AUTH-03 | `requireAuth(callback)` — run action after login | P0 |
| AUTH-04 | One-click demo login (`student1@collegeapp.in`) | P1 |
| AUTH-05 | Header login + demo buttons when logged out | P0 |
| AUTH-06 | User menu when logged in (profile, logout) | P0 |
| AUTH-07 | Profile page with sign out | P1 |

### 7.7 Profile (`/profile`)

| ID | Requirement | Priority |
|----|-------------|----------|
| PROF-01 | Show name, email, avatar initial | P1 |
| PROF-02 | Link to saved colleges | P1 |
| PROF-03 | Sign out | P0 |
| PROF-04 | Auto-open login modal if unauthenticated | P0 |

### 7.8 Dashboard (`/dashboard`)

| ID | Requirement | Priority |
|----|-------------|----------|
| DASH-01 | Personalized greeting for logged-in user | P2 |
| DASH-02 | Stats: total colleges, saved count, states, avg rating | P2 |
| DASH-03 | Quick links: Explore, Compare, Saved | P2 |
| DASH-04 | Top 3 rated colleges grid | P2 |

Uses **AppShell** (sidebar layout) — partially overlapping with PublicShell routes.

### 7.9 Supplementary Content

| Module | Data Source | Features |
|--------|-------------|----------|
| **Courses** (`/courses`) | API `/courses` | Search, list with college name, fees |
| **Exams** (`/exams`) | Static `lib/data/exams.ts` | JEE, NEET, CAT, GATE cards + detail |
| **Careers** (`/careers`) | Static `lib/data/careers.ts` | Salary, growth, roadmap detail pages |

Priority: **P2** — supporting content, not core funnel.

---

## 8. Non-Functional Requirements

### Performance

- Debounce search inputs (300ms)
- Infinite scroll for college lists (avoid full-page loads)
- Skeleton loaders for tables, grids, and detail pages
- React Query caching and invalidation on mutations

### Responsiveness

- Mobile-first layout
- Collapsible filters on small screens
- Sticky header with mobile nav drawer

### Accessibility

- Semantic HTML (tables, headings, buttons)
- `aria-label` on icon-only controls
- Keyboard-accessible modals (shadcn Dialog)
- Sufficient color contrast in dark theme

### Security (client)

- JWT in `localStorage` (document tradeoff vs httpOnly cookies)
- No secrets in client bundle
- API base URL via `NEXT_PUBLIC_API_URL`

### UX / Visual

- Dark theme default
- Geist font family
- Consistent design tokens via Tailwind + shadcn
- Subtle Framer Motion transitions
- Empty, error, and loading states on all data views

---

## 9. Technical Architecture

```
src/
├── app/                    # Next.js routes (thin wrappers)
├── features/               # Page-level feature modules
│   ├── home/
│   ├── colleges/
│   ├── college-detail/
│   ├── compare/
│   ├── saved/
│   ├── profile/
│   ├── dashboard/
│   ├── explore/            # AppShell variant (route redirects)
│   ├── courses/
│   ├── exams/
│   ├── careers/
│   └── landing/            # Alternate landing pages (not routed)
├── components/
│   ├── layout/             # PublicShell, AppShell, SiteHeader, Sidebar
│   ├── college/            # CollegeCard, CollegesTable, ComparisonTable
│   ├── auth/               # LoginModal
│   └── ui/                 # shadcn primitives
├── hooks/                  # useColleges, useSaved, useCompare, etc.
├── lib/
│   ├── api/                # Typed API clients
│   ├── auth/
│   ├── data/               # Static exams/careers
│   └── navigation.ts
├── providers/              # Auth, Query, AuthModal
└── types/                  # Shared TypeScript interfaces
```

### State Management

| Concern | Solution |
|---------|----------|
| Server data | TanStack React Query |
| Auth session | React Context (`AuthProvider`) |
| Login modal | React Context (`AuthModalProvider`) |
| URL state | `useSearchParams` (search on listing) |
| Local UI state | React `useState` |

### API Integration

| Client Module | Endpoints |
|---------------|-----------|
| `colleges.ts` | `GET /colleges`, `GET /colleges/by-slug/:slug` |
| `compare.ts` | `POST /compare`, `GET /comparisons`, `DELETE /comparisons/:id` |
| `saved.ts` | `GET/POST/DELETE /saved/:collegeId` |
| `reviews.ts` | `GET /reviews/:collegeId`, `POST /reviews` |
| `discussions.ts` | `GET/POST /discussions`, answers |
| `auth.ts` | `POST /auth/login`, `register`, `GET /auth/profile` |
| `courses.ts` | `GET /courses` |

Standard response shape: `{ success, data, pagination?, message?, errors? }`

---

## 10. Auth & Permission Matrix

| Action | Guest | Authenticated |
|--------|-------|---------------|
| Browse colleges | ✅ | ✅ |
| View college detail | ✅ | ✅ |
| Compare colleges | ✅ | ✅ |
| Save college | ❌ → login | ✅ |
| Write review | ❌ → login | ✅ |
| Ask / answer Q&A | ❌ → login | ✅ |
| Save comparison | ❌ → login | ✅ |
| View saved list | ❌ → login CTA | ✅ |
| View profile | ❌ → login | ✅ |

---

## 11. UI Components Inventory

| Component | Purpose |
|-----------|---------|
| `PublicShell` | Header + footer wrapper (primary UX) |
| `AppShell` | Sidebar layout (dashboard, legacy explore) |
| `SiteHeader` / `SiteFooter` | Branding, nav, auth controls |
| `CollegesTable` | Sortable listing with save actions |
| `CollegeCard` | Card grid for home/dashboard |
| `ComparisonTable` | Metric matrix with best-value highlighting |
| `SearchBar` | Debounced search input |
| `FilterChips` | Toggle quick filters |
| `FilterPanel` | Sidebar filter form |
| `LoginModal` | Auth dialog |
| `EmptyState` / `ErrorState` | Standard feedback patterns |
| `StatBadge` | Key metric display |
| `Tabs` | College detail sections |

---

## 12. Known Gaps & Technical Debt

| Item | Impact | Recommendation |
|------|--------|----------------|
| Dual layouts (`PublicShell` vs `AppShell`) | Inconsistent UX | Consolidate on one shell |
| `/explore`, `/welcome` redirect; landing pages unused | Dead code | Remove or wire up |
| Exams/careers/courses not in main nav | Low discoverability | Add secondary nav or footer links |
| Compare limit 4 vs API 5 | Minor mismatch | Align limits |
| No AI features despite project name | Brand gap | Add AI recommendations in v2 |
| JWT in localStorage | XSS risk | Consider httpOnly cookie auth |
| No SSR for college SEO | SEO weakness | Add metadata + SSR for detail pages |
| No tests in frontend | Quality risk | Add Playwright / RTL tests |
| Courses detail route referenced but may be missing | Broken link risk | Verify `/courses/[id]` page |

---

## 13. Future Roadmap (Out of Scope for v1)

### Phase 2 — Engagement

- AI-powered college recommendations ("Ask CollegeIQ")
- Personalized feed on dashboard
- Notifications for new answers on your questions
- Share comparison via link

### Phase 3 — Growth

- SEO-optimized college pages with structured data
- Map view for colleges by state
- Fee calculator / ROI estimator
- Counselor accounts

### Phase 4 — Platform

- PWA / offline saved list
- i18n (Hindi + regional languages)
- Admin moderation for reviews and Q&A

---

## 14. Environment & Deployment

| Variable | Required | Default |
|----------|----------|---------|
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:3000` |

**Scripts:** `npm run dev` · `npm run build` · `npm run start` · `npm run lint`

**Target deployment:** Vercel (Next.js native) with API on separate host; configure CORS on backend.

---

## 15. Acceptance Criteria (MVP Release)

The frontend is **release-ready** when:

1. ✅ User can search, filter, and browse colleges without login
2. ✅ User can open any college and view all five tabs with real API data
3. ✅ User can compare 2+ colleges and see placement/fee differences
4. ✅ Login modal gates save, review, Q&A, and save-comparison flows
5. ✅ Saved colleges persist and sync after login
6. ✅ Error, empty, and loading states render on all main pages
7. ✅ App is usable on mobile (filters, nav, tables)
8. ⬜ Production build passes with no TypeScript errors
9. ⬜ Core flows covered by E2E tests

---

## 16. Open Questions

1. Should **CollegeIQ** unify on `PublicShell` only and deprecate `AppShell` / dashboard?
2. Should exams, careers, and courses join primary navigation?
3. Is **AI discovery** (chat-based recommendations) planned for v1.1?
4. Target audience: engineering only, or all higher-ed (matches dataset)?
5. Should compare support **5 colleges** and **shareable URLs**?
6. Preferred auth model: keep JWT in localStorage or migrate to cookies?
