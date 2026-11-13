# Frontend decisions
# Frontend decisions

## Decision 1: Book directly from a free slot (interaction / state)

| Field | Content |
|---|---|
| **Problem** | tutor.com.pk (https://tutor.com.pk/tutor/maniha/): the profile offers "Book a free trial lesson", "Send a message" and "Request contact number" (the tutor decides whether to share it), and the schedule is in a separate tab. [WRITE what you saw when you clicked "Book a free trial lesson".] |
| **Decision** | Free slots appear at the top of the tutor profile as links to `/book/:id?date=YYYY-MM-DD&time=HH:MM`. Clicking one opens the booking form with that date and time already selected; the student completes details and reaches a confirmation page. Full slots stay disabled and say "full". No message to the tutor is needed. |
| **Alternative** | A "send a message to ask about times" form on the profile. |
| **Reason** | Availability is what a student needs to choose, and a completed booking is the business goal, so the shortest path is slot, form, confirmation. |
| **Tradeoff** | Students cannot ask a question first (messaging is out of scope). The slot in the URL must be validated (bad values are ignored), and a slot can fill before submit, so the capacity rule is checked again on submit. |
| **Code location** | `src/components/AvailabilityOverview.jsx` (slot links), `src/pages/BookingPage.jsx` (`hasPreset`, `useSearchParams`), `src/pages/TutorDetailsPage.jsx`, `src/rules/capacityRule.js`, `src/utils/validation.js`. |
| **Evidence** | [YOUR screenshots]. Steps: 1) Open `/tutors/t01`. 2) Click a free slot such as "5:00 PM, 3 left". 3) The booking form opens with that date and time selected. 4) Complete the form and submit: the confirmation page appears. |

## Decision 2: Collapsible filters with visible selections (mobile layout)

| Field | Content |
|---|---|
| **Problem** | etutors.pk (https://etutors.pk/search-tutor): the filter panel lists Subjects, Grade/Level, Teaching Mode, Province/Region, City, Specific Area, Tutor Gender and Verification, plus an "Apply Filters" button. [WRITE what you saw at 390 px.] |
| **Decision** | The search box is always visible. On screens narrower than 48 rem the other filters and sorting are collapsed behind "Show filters and sorting (n active)". Selected filters are shown as removable chips, one "Clear filters" button resets everything, and filters apply immediately (no Apply step). |
| **Alternative** | Keep all filters open above the results, or use a pop-up panel with an Apply button. |
| **Reason** | On a phone the results should be reachable quickly, and the chips keep the student aware of what is selected even when the panel is closed. |
| **Tradeoff** | One extra tap to open the filters, and fewer filter types than the reference (no city or gender). |
| **Code location** | `src/components/FilterBar.jsx` (`open` state, `.filter-toggle`), `src/components/ActiveFilters.jsx`, `src/pages/FindTutorsPage.jsx`, `.filter-fields` in `src/styles/components.css`. |
| **Evidence** | [YOUR 390 px screenshots]. Steps: 1) Open `/tutors` at 390 px: search and the toggle are visible, results start below. 2) Tap the toggle and choose a subject. 3) A chip appears; the toggle shows "(1 active)". 4) Tap the chip or "Clear filters". |

## Decision 3: Standard tutor cards and simple navigation (information hierarchy)

| Field | Content |
|---|---|
| **Problem** | tuition.pk (Find Tutors): one listing shows three price lines in different forms ("PKR 5K-40K/M (3H/Day)", "PKR 1.0-1.1K/M (2H/Day)", "PKR 20K-60K/M (3H/Day)"), the biography is cut off before qualifications ("...tutoring experienc..."), and the header has several dropdown menus, a banner and a search bar. [ADD what else you saw.] |
| **Decision** | The header has three links only. Every tutor card shows the same rows in the same order: subjects, levels, experience, qualification, rating, next free slot and one price in PKR per hour with the discount note. A missing qualification shows "Not listed yet". |
| **Alternative** | Show several price packages (monthly, daily) on each card, as the reference does. |
| **Reason** | Identical rows and a single price unit let a student compare tutors at a glance. |
| **Tradeoff** | Cards are taller, monthly packages cannot be shown, and long titles and qualifications are cut to two lines until the profile is opened. |
| **Code location** | `src/components/TutorCard.jsx`, `src/components/Header.jsx`, `src/utils/filtering.js` (`sortTutors`). |
| **Evidence** | [YOUR screenshot]. Steps: 1) Open `/tutors`. 2) Compare three cards: same rows, one hourly price. 3) Find Talha Mehmood: the qualification row says "Not listed yet". |