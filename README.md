# TutorConnect

An online tutoring website for students in Pakistan, built with React, React Router and custom CSS.

All tutors, prices and bookings are simulated.

| | |
|---|---|
| **Student** | Adeeba Sohail |
| **GitHub repository** | https://github.com/Adeeba-Sohail/tutorconnect |
| **Live website** | https://tutorconnect-pi.vercel.app/ |
| **Final commit** | `PASTE_FINAL_COMMIT_HASH` |

## Project description

TutorConnect lets a student find a suitable tutor, compare prices and open time slots, and book a
simulated one-to-one online session.

- **Business:** TutorConnect, one-to-one online tutoring sessions, prices in PKR.
- **Audience:** school and first-year university students in Pakistan (Primary to Undergraduate) and their parents.
- **Operating area:** online, across Pakistan (Pakistan Standard Time).
- **Main customer task:** find a suitable tutor and book a session.
- **Business goal:** completed (simulated) session bookings.
- **Offering:** 12 fictional tutors (`src/data/tutors.js`), each with subjects, level range, hourly rate and weekly time slots.

## Commands

Requires Node.js 20.19 or newer (22 LTS recommended).

```bash
npm install        # install dependencies
npm run dev        # development server at http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the production build locally
npm run lint       # check code with oxlint
npm test           # automated business-rule test (runs: node --test)
```

## Routes

| Route | Page | Purpose |
|---|---|---|
| `/` | Home | Introduction, rules summary, browse by level, popular tutors |
| `/tutors` | Find Tutors | Search, filters, sorting (kept in the URL, e.g. `/tutors?subject=Physics&level=matric`) |
| `/tutors/:tutorId` | Tutor Details | Profile, price table, upcoming availability. Invalid IDs show a "not found" message |
| `/book/:tutorId` | Booking | Form, slot picker and live price summary |
| `/confirmation/:reference` | Confirmation | Final booking summary |
| `/shortlist` | Shortlist | Saved tutors with preferred session length |
| `*` | Not found | Any other address |

## Features

- Search (name, subject, city, keywords), filters (subject, level, price, accepting bookings) and 5 sort options that work together.
- Shortlist (add/remove, change session length) kept across pages and refreshes.
- Booking form with 8 fields, specific validation messages, and valid input preserved after errors.
- Live price summary with the discount line and a confirmation page with a reference number.
- Mock asynchronous loader with loading, error, retry and empty states.
- Responsive layout checked at 390 px and 1280 px, keyboard access, visible focus, labelled inputs, skip link.

## The three operating rules

| # | Rule | Where users see it | What the app does | Boundary case |
|---|---|---|---|---|
| 1 | **Capacity:** a tutor accepts at most **4 bookings** per date/time slot | Slot picker ("2 places left", "Full"), tutor availability, cards | Full slots are disabled; submitting a full slot is blocked with a message | 3 existing bookings: the 4th is allowed ("Last place left"). 4 existing: full |
| 2 | **Eligibility:** the student's education level must be inside the tutor's level range | Tutor cards and profile, text under the level field | Booking is blocked with a message naming the range | Level equal to the tutor's lowest or highest level is allowed; one level outside is blocked |
| 3 | **Pricing:** sessions **longer than 60 minutes** get **10% off** | Cards, price table, duration options, summary | The discount line appears and the total is reduced | 60 minutes: no discount. 90 minutes: discount |

Code: `src/rules/capacityRule.js`, `eligibilityRule.js`, `pricingRule.js`.

## Automated test (Rule 1: capacity)

```bash
npm test
```

`src/rules/capacityRule.test.js` uses `node:test` and `node:assert/strict`. It checks a valid slot
(1 booking), exactly at the limit (3 existing, the 4th allowed), and a broken rule (4 and 7 existing),
plus invalid input and the slot-counting helper. The same `checkSlotCapacity` function is used by
`src/utils/availability.js` and `src/utils/validation.js` in the app.


## Reproducing the edge cases

Open the **Demo controls** panel at the bottom of any page. Full checklist: [`docs/EDGE_CASES.md`](docs/EDGE_CASES.md).

| Edge case | How to reproduce |
|---|---|
| Loading failure and retry | Demo controls: "Simulate a loading failure", then "Reload tutor data now". Choose "Load normally" and press "Try again" |
| Empty dataset | Demo controls: "Simulate an empty tutor list", then "Reload tutor data now" |
| No search matches | `/tutors?subject=Physics&level=a-level&maxRate=1500` |
| Invalid URL / invalid tutor ID | `/nothing-here` and `/tutors/t99` |
| Invalid form input | Submit the empty booking form; try email `abc`; try a Primary student with Hira Siddiqui |
| Changed availability | Start a booking (tutor, date, time), then Demo controls: "Fill my saved time slot" |
| Unavailable tutor | Demo controls: "Mark my saved tutor unavailable" |
| Restored invalid selection | After the steps above, refresh the booking page: a warning explains what changed |
| Removed saved tutor | Demo controls: "Add a saved tutor that no longer exists", then open `/shortlist` |
| Missing information | Open `/tutors/t12` (no biography, qualifications or languages) |
| Long content | Open `/tutors/t05` (long title and qualifications) at 390 px |

## Simulated operations and known limitations

- Everything is simulated: no payments, accounts, emails, video calls or server. Nothing leaves the browser.
- "Other students' bookings" are generated by `src/services/seedBookings.js` relative to today's date so full slots can be demonstrated.
- Bookings, shortlist and preferences are stored in this browser's `localStorage`. Name and email are stored only with a confirmed simulated booking (use fictional details). The unfinished booking saves only non-personal choices.
- Session slots are start times; a 120-minute session is not checked against the tutor's next slot.
- Tutors have no photos (initials are shown); the image fallback is in `src/components/Avatar.jsx`.
- Time zone is not converted (all times are Pakistan Standard Time).

## Concept map

| Concept | File | Component / function |
|---|---|---|
| Function components, imports/exports | `src/pages/*.jsx`, `src/components/*.jsx` | every component |
| JSX, expressions | `src/components/TutorCard.jsx` | `TutorCard` |
| Props | `src/components/TutorCard.jsx` | `tutor`, `nextSlot`, `isShortlisted` |
| Callback props | `src/components/FilterBar.jsx`, `ShortlistButton.jsx` | `onChange`, `onClear`, `onToggle` |
| Events, `preventDefault` | `src/pages/BookingPage.jsx` | `handleSubmit` |
| `useState`, controlled inputs | `src/pages/BookingPage.jsx` | `form`, `handleChange` |
| Functional updates | `src/context/ShortlistContext.jsx` | `toggle`, `setDuration` |
| Immutable object update | `src/pages/BookingPage.jsx` | `setForm(previous => ({ ...previous, ... }))` |
| Immutable array update | `src/context/ShortlistContext.jsx` | `filter`, `map`, spread in `toggle` |
| Lists and keys | `src/pages/FindTutorsPage.jsx` | `results.map(... key={tutor.id})` |
| Conditional rendering | `src/components/TutorDataGate.jsx`, `FindTutorsPage.jsx` | loading / error / empty / no matches |
| Shared state (context) | `src/context/*.jsx` | `TutorDataProvider`, `ShortlistProvider`, `BookingProvider`, `DemoProvider` |
| Derived values | `src/pages/FindTutorsPage.jsx`, `BookingPage.jsx` | `results`, `price`, `allErrors`, `slots` |
| Effects, dependencies, cleanup | `src/context/TutorDataContext.jsx`, `src/hooks/useNow.js` | `ignore` flag, `clearInterval` |
| Async/await, error handling | `src/services/mockLoader.js`, `TutorDataContext.jsx` | `loadTutors`, `try/catch` |
| localStorage | `src/hooks/useLocalStorage.js` | `useLocalStorage` |
| Routing, URL params, query string | `src/App.jsx`, `FindTutorsPage.jsx`, `TutorDetailsPage.jsx` | `Routes`, `useParams`, `useSearchParams` |
| Array methods, spread, destructuring | `src/utils/filtering.js` | `filterTutors`, `sortTutors` |
| Business rules | `src/rules/*.js` | `checkSlotCapacity`, `checkLevelEligibility`, `calculateSessionPrice` |
| Validation | `src/utils/validation.js` | `validateBooking` |
| Automated test | `src/rules/capacityRule.test.js` | `node:test` |

## Folder structure

```
src/
  components/  reusable pieces (cards, filters, slot picker, summaries, states)
  context/     shared state providers (tutor data, shortlist, booking, demo)
  data/        tutors.js, levels.js
  hooks/       useLocalStorage, useNow, useDocumentTitle
  pages/       one file per route
  rules/       business rules + capacityRule.test.js
  services/    mockLoader.js, seedBookings.js, demoSettings.js
  styles/      variables.css, base.css, layout.css, components.css, pages.css
  utils/       availability, dates, filtering, format, validation
```

## Deployment

Hosted on Vercel from the `main` branch. `vercel.json` rewrites every path to `index.html`, so
refreshing a nested route such as `/tutors/t01` works.
