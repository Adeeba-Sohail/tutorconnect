# Edge-case and improvement verification checklist

## A. Edge cases

| # | Case | Actions | Expected | Observed | Pass? |
|---|---|---|---|---|---|
| 1 | Missing information | Open `/tutors/t12` | Fallback text for biography, qualifications, languages; layout intact | Showed "This tutor has not added a biography yet", "Qualifications have not been listed yet" and "Not listed" for languages; layout intact | Yes |
| 2 | Lengthy content | Open `/tutors/t05` and the Find Tutors page at 390 px | Long title is clamped on the card; no horizontal scroll | Title cut to two lines on the card; no horizontal scroll at 390 px | Yes |
| 3 | Missing image | Look at any avatar (no photos exist) | Initials shown instead of a broken image | Initials (for example "HS") shown on every card and profile | Yes |
| 4 | Empty search results | Open `/tutors?subject=Physics&level=a-level&maxRate=1500` | "No tutors match" with removable-filter suggestions and "Clear all filters" | Message shown with the button "Remove 'Up to PKR 1,500 per hour' (2 tutors)" and "Clear all filters" | Yes |
| 5 | Empty dataset | Demo controls: empty tutor list, reload | "No tutors are listed right now" (different from no matches) | Showed "No tutors are listed right now", a different message from case 4 | Yes |
| 6 | Invalid URL | Open `/nothing-here` | "Page not found" with links | "Page not found" with links to Find Tutors and Home | Yes |
| 7 | Invalid tutor ID | Open `/tutors/t99` and `/book/t99` | "We could not find that tutor" with a link to browse | Both pages showed "We could not find that tutor" with a link | Yes |
| 8 | Invalid form input | Submit empty booking form | Error summary, field messages, focus on first problem | "Please fix 6 problems" summary, a message under each field, focus moved to Student name | Yes |
| 9 | Valid input preserved | Fill name and email, enter bad level, submit | Name and email stay in the form | Name and email were still in the form after the failed submit | Yes |
| 10 | Level not eligible | Primary level with Hira Siddiqui | Message names her range; booking blocked | "Hira Siddiqui teaches Matric (Grades 9-10) to A Level. Primary (Grades 1-5) is outside that range." Submit blocked | Yes |
| 11 | Loading failure | Demo controls: loading failure, reload | Error with "Try again" | "Something went wrong" message with a "Try again" button | Yes |
| 12 | Retry | Choose "Load normally", press "Try again" | Tutor list loads | While failure was on, retry failed again; after "Load normally", retry loaded the list | Yes |
| 13 | Changed availability | Pick a slot, then "Fill my saved time slot" | Message "slot is full"; slot disabled; booking blocked | "This slot is full (4 of 4 places taken)" shown; slot disabled with "Full"; submit blocked | Yes |
| 14 | Restored invalid selection | After 13, refresh the page | Warning box explains the conflict; other choices restored | Warning "Some of your earlier choices need to be changed" shown; level and date restored | Yes |
| 15 | Tutor unavailable | "Mark my saved tutor unavailable" | Booking blocked with message; card and profile show badge | Card showed "Not accepting bookings"; profile showed a badge and a disabled "Booking unavailable" button; booking form said "Hira Siddiqui is not accepting bookings right now" | Yes |
| 16 | Removed saved tutor | "Add a saved tutor that no longer exists", open `/shortlist` | Warning with a Remove button | "1 saved tutor is no longer listed" with a Remove button | Yes |
| 17 | Console | Visit every page | No errors or React warnings | No errors or warnings on any page, including a full booking | Yes |
| 18 | Keyboard | Tab through Find Tutors and the booking form | All controls reachable, focus ring visible, form submits with Enter | Tab reached the skip link, navigation, Book, Save and each slot link in order with a visible focus ring; Enter in a form field submitted the form | Yes |

## B. Rule boundaries

| Rule | Input | Expected | Observed |
|---|---|---|---|
| Capacity | Slot with 3 bookings | Allowed ("Last place left") | Slot showed "Last place left" and could be selected |
| Capacity | Slot with 4 bookings | Disabled, "Full" | Slot showed "Full" and was disabled |
| Eligibility | Level at the lowest/highest level of the tutor | Allowed | For Hira (Matric to A Level), Matric and A Level showed no error |
| Eligibility | One level outside the range | Blocked with message | Middle and Undergraduate each showed the "outside that range" message |
| Discount | 60 minutes | No discount | Summary showed "Discount: None" (PKR 2,200) |
| Discount | 90 minutes | 10% discount | Summary showed "− PKR 330" and total PKR 2,970 |

## C. Improvements

| Improvement | Actions | Expected | Observed |
|---|---|---|---|
| Direct booking | Open `/tutors/t01` and click a free slot | Booking form opens with that date and time selected; confirmation after submit | Form opened with the date and time already selected; after submitting, the confirmation page showed a reference |
| Filters on mobile | At 390 px open `/tutors`, open the filter toggle, choose a subject | Search visible; filters collapsed with "(n active)"; chip appears; Clear removes it | Search stayed visible and filters were collapsed; after choosing a subject the toggle showed "(1 active)" and a chip appeared; Clear removed it; no sideways scroll |
| Standard cards | Open `/tutors` and compare cards | Same rows on every card; one hourly price; fallback for missing qualification | All 12 cards showed levels, experience, qualification, rating, next free slot and hourly price; Talha Mehmood's card showed "Not listed yet" |