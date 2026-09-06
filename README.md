# Akshar Paaul Attendance

A single-page web app for **Akshar Paaul** (Pune, India) to record and track daily student attendance across its centres — built as one self-contained `index.html`, backed by Firebase, and hosted for free on GitHub Pages.

Coordinators see every centre; teachers log in and land straight on their own. No app to install — it opens like any web page and remembers a signed-in device, so teachers only log in once.

## Live app

https://pruthvieraj.github.io/Akshar-Paaul-Attendance/

## Features

- **Mark attendance** — a roll-call-style list built around the actual field task: swipe or tap each student present/absent, with a progress ring showing how many are marked for the current session. A banner nudges a teacher who still has unmarked students for the week.
- **Students & records** — full roster per centre, tap-to-edit details, search, and column sorting; a coordinator can add, edit, or delete students, a teacher can add and edit within their own centre. Each student can have a photo, added right from the detail panel.
- **CSV student import** — add a batch of students at once instead of one at a time: download a ready-made template, fill it in, and drop it on **Students & records → Import CSV** for a preview (with per-row OK/Skip status for anything missing a name or centre) before anything is actually saved. A teacher's import is automatically pinned to their own centre regardless of what the file says; a coordinator's file controls the centre per row. The template includes an optional **Name (Devanagari)** column (also recognized under a few common header spellings) for anyone who wants to set the exact Devanagari spelling on import instead of relying on the automatic transliteration described below.
- **Attendance risk flag** — a student with 3 or more absences in a row gets a small warning badge in Mark attendance, Students & records, and Reports, so a quiet dropout risk doesn't go unnoticed.
- **Tap-to-jump header stats** — the student/centre/needs-review/at-risk counts at the top of the app aren't just numbers: tapping **N students** opens the full roster with every filter cleared, **N centres** jumps to the Reports tab's centre-by-centre breakdown, and **N need review** / **N at risk** drop you straight into that filtered list in Students & records.
- **Attendance calendar** — open any student's detail panel and tap **View attendance calendar** for a familiar month-grid view (current month plus the two before it) with each session date shaded present/absent/unmarked — a quick visual instead of scanning a list of dates.
- **Absence reasons** — marking a student absent reveals an optional, one-tap reason (sick, travelling, moved away, dropped out, other) without slowing down the roll call itself.
- **This week at a glance** — the top of Reports summarises what needs a look right now: how many students are still unmarked for the current week per centre, how many are flagged as at-risk, and a tally of this week's absence reasons — so a coordinator doesn't have to click through every centre to find what's outstanding.
- **Attendance trend** — a month-by-month bar chart (Reports tab) showing the attendance rate over the student's whole recorded history, for a quick term-over-term or year-over-year read on whether things are improving.
- **Your centre, month to month** — teachers get a personal stat card comparing this month's attendance rate against last month's, with an up/down indicator, right at the top of their Reports tab.
- **Archive students** — a student who's left or graduated can be archived instead of deleted: they drop out of Mark attendance and the everyday reports, but their attendance history is kept, and a coordinator can restore them anytime from Students & records → **Show archived**.
- **Bulk actions** — a coordinator can select multiple students in Students & records (checkboxes + "select all") to move them to a different centre, archive them, or export just that selection to CSV in one action instead of one at a time.
- **Undo, right after the fact** — archiving a student (one at a time or in bulk) or bulk-changing a centre shows a brief **Undo** toast for a few seconds, so a slip of the finger doesn't mean digging back through Show archived or redoing a bulk action by hand. Permanent delete still asks for confirmation up front instead, since that one truly can't be undone.
- **Quick search** — a search icon in the corner (or pressing **/** or **Ctrl/Cmd+K** anywhere in the app) opens a jump-to-student search that drops you straight into that student's detail panel, from any tab.
- **Reports** — attendance percentage per student, a centre-by-centre comparison (coordinator view), flags for records that need review, and CSV export (totals, or a detailed per-date present/absent/reason grid). A one-tap **Copy this month's summary** puts a plain-text centre-by-centre summary on the clipboard — ready to paste into WhatsApp or email — and **This month's CSV** downloads just the current month's detailed grid, without needing to set up email or a paid Firebase plan.
- **Printable monthly register** — a per-centre, per-month attendance grid formatted for printing or saving as a PDF straight from the browser's print dialog — no extra software needed.
- **Printable annual/term report** — a year-long companion to the monthly register (Reports → **Annual report**, pick a year): centre and class attendance averages, a month-by-month trend, and a list of students worth checking in on, formatted the same print-or-save-as-PDF way — useful for an end-of-term or end-of-year review without re-building it by hand from twelve monthly registers.
- **Activity log** — coordinator-only history of who added, edited, deleted, archived, restored, or changed a photo on a student record, and when. Append-only: entries can't be edited or deleted by anyone, including a coordinator.
- **Full data backup export** — a coordinator can download everything in Firestore (teachers, students, attendance, activity log) as one JSON file from Reports → **Backup data** — a plain-language "keep this somewhere safe" copy outside Firebase, useful before a big bulk change or just as periodic peace of mind.
- **Works offline** — a tap that can't reach the server right away is queued on-device and synced automatically the moment the connection returns, with a banner showing what's still pending. Installable as a home-screen app (see **Progressive Web App** below) so it also *opens* without a signal.
- **Light/dark mode** — a toggle in the corner switches instantly and remembers the choice; it also follows the device's system setting until someone picks one explicitly.
- **English / Marathi / Hindi** — a language switcher next to the theme toggle translates essentially the whole app: navigation, buttons, field labels, table headers, toasts, confirmation dialogs, validation warnings, empty states, and the login screen. See the language note under **Known limitations** for the handful of things that stay in English on purpose.
- **Student names in Devanagari** — switching to Marathi or Hindi also transliterates every student's name on screen (Mark attendance, Students & records, Reports, printable register/annual report) into an approximate Devanagari spelling, computed automatically from the Latin name already on file — no re-entry needed. Since English spelling doesn't capture everything Devanagari needs (retroflex vs. dental consonants, long vs. short vowels), the auto-transliteration is a best-effort starting point, not a guarantee of correct spelling. Anyone can fix it per-student from the Details panel's **Name (Devanagari)** field (or by importing a CSV with a matching column — see below); once set, that manual spelling always wins over the automatic guess.
- **Privacy-aware by role** — a student's contact number, parents' education, and full home address are visible to coordinators only; teachers see everything else they need (name, class, gender, age, medium, attendance history, photo) with those fields shown as "Coordinator only." This applies to the on-screen detail panel and both CSV exports.

## Tech stack

- Plain HTML/CSS/JavaScript — no build step, no framework, no bundler. The app itself is one file; a handful of small static files (below) support the installable/offline behavior.
- [Firebase](https://firebase.google.com) Authentication (email/password) for logins, and Firestore for data — loaded straight from Google's CDN via `import()`, so there's nothing to `npm install`.
- A student photo is stored as a small (~128px) compressed JPEG directly on the Firestore student document — there's no Firebase Storage dependency, extra console setup, or billing tier to worry about.
- Hosted as static files on **GitHub Pages**, installable as a Progressive Web App via a small service worker.

## Repo contents

| File | Purpose |
|---|---|
| `index.html` | The entire app. This is the file you'd open to change anything. |
| `manifest.json` | PWA metadata (name, icons, colors) — lets a phone offer "Add to Home Screen." |
| `sw.js` | Service worker: caches the app shell so it still opens with no signal. |
| `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | App icons generated from the Akshar Paaul emblem. |
| `SETUP.md` | Step-by-step first-time setup (Firebase project, logins, hosting). |
| `SECURITY_UPDATE.md`, `RULES_UPDATE_2.md`, `RULES_UPDATE_3.md` | History of security/rules changes — see **Firestore security rules** below for the current, complete rules. |

All of the above should be deployed together — GitHub Pages serves whatever's in the repo, so just commit them all to the same folder as `index.html`.

**Do not commit `local_seed_tool_DO_NOT_UPLOAD.html`.** It's a local-only utility that contains the full student roster in its page source, used solely to re-seed a fresh Firebase project. Keep it off GitHub — a `.gitignore` with that filename is a good idea:

```
local_seed_tool_DO_NOT_UPLOAD.html
```

## Progressive Web App

`index.html` registers `sw.js` on load, which caches the app's own files (not Firebase/Firestore traffic — that still needs a connection and goes through the offline write queue described above). On a phone, opening the live link and choosing "Add to Home Screen" (or the automatic install prompt some browsers show) installs it as a normal-looking app with its own icon, so a teacher isn't hunting for a browser tab.

If you ever want visitors to pick up a fresh copy of the app shell sooner than the service worker otherwise would, bump `CACHE_NAME` in `sw.js` — the old cache is cleared automatically on the next visit.

## Data model (Firestore)

| Collection | Document ID | Key fields |
|---|---|---|
| `teachers` | login email | `name`, `centre`, `role` (`"coordinator"` or `"teacher"`) |
| `students` | generated ID | `name`, `centre`, `teacher`, `std`, `gender`, `age`, `medium`, `contact`, `mother_edu`, `father_edu`, `funding_partner`, `photo` (small base64 JPEG), `active` (omitted or `true` = active; `false` = archived), … |
| `attendance` | `{studentId}_{date}` | `studentId`, `date`, `centre`, `v` (1 = present, 0 = absent), `by`, `reason` (optional, absences only: `sick`/`travel`/`moved`/`dropped`/`other`) |
| `audit_log` | generated ID | `action` (`create`/`edit`/`delete`/`photo`/`archive`/`restore`), `studentId`, `studentName`, `by`, `byRole`, `at`, `details` — append-only, coordinator-read-only |

The `active` field is purely additive — no existing student document needed to change when archiving shipped. A document with no `active` field at all (every student that existed before this feature) is simply treated as active.

CSV import, the annual/term report, the attendance calendar, undo, and the full backup export (above) are all built entirely on this existing schema and the rules below — none of them needed a new collection, a new field, or a rules change to ship.

## Roles

- **Coordinator** — full access: every centre, every field, can add/edit/delete students and manage teacher accounts (via the Firebase console).
- **Teacher** — locked to their own centre. Can mark attendance, add and edit students there, but cannot delete students or see another centre's data. Contact number, parents' education, and full address are hidden in favor of a "Coordinator only" note.

This role split is enforced in two places: the app's own UI, and Firestore's security rules (below) — so a teacher account is blocked from reading or writing another centre's data even by editing requests directly, not just by what the interface shows them.

One caveat worth knowing: Firestore's security rules can grant or deny access to a whole document, but can't redact individual fields within a document a user is otherwise allowed to read. So the contact/education/address hiding described above is enforced by the app's interface, not by the database — a teacher who opened their browser's developer tools could still find those fields in the raw data for their own centre's students. True field-level enforcement would mean splitting those fields into a separate, coordinator-only Firestore collection, which this version doesn't do.

## Firestore security rules

Go to **Firestore Database → Rules** in the Firebase console and publish:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function signedIn() { return request.auth != null; }
    function myEmail() { return request.auth.token.email; }
    function myProfile() {
      return get(/databases/$(database)/documents/teachers/$(myEmail())).data;
    }
    function isCoordinator() { return signedIn() && myProfile().role == 'coordinator'; }
    function myCentre() { return myProfile().centre; }

    match /teachers/{email} {
      allow read: if signedIn() && (myEmail() == email || isCoordinator());
      allow write: if isCoordinator();
    }

    match /students/{studentId} {
      allow read, update: if signedIn() && (isCoordinator() || resource.data.centre == myCentre());
      allow create: if signedIn() && (isCoordinator() || request.resource.data.centre == myCentre());
      allow delete: if isCoordinator();
    }

    match /attendance/{attId} {
      allow read, delete: if signedIn() && (isCoordinator() || resource.data.centre == myCentre());
      allow create, update: if signedIn() && (isCoordinator() || request.resource.data.centre == myCentre());
    }

    match /audit_log/{entryId} {
      allow create: if signedIn();
      allow read: if signedIn() && isCoordinator();
      allow update, delete: if false;
    }
  }
}
```

Nobody who isn't signed in can read or write anything. A signed-in teacher is limited to their own centre's students and attendance; a coordinator can reach everything. Anyone signed in can add an activity-log entry (so their own edits get recorded), but only a coordinator can read the log back, and no one — coordinator included — can edit or delete an entry once written.

## Deploying

1. **Firebase** — create a project, turn on Firestore and Email/Password authentication, add one login per person (coordinator + each teacher), and publish the rules above. Full walkthrough in `SETUP.md`.
2. **Point the app at your project** — open `index.html`, find `FIREBASE_CONFIG` near the top of the last `<script>` tag, and paste in your Firebase project's web config (Project settings → Your apps → Web app). These values identify the project, not grant access — access is controlled entirely by the rules above and who has a login.
3. **GitHub Pages** — push `index.html` **along with** `manifest.json`, `sw.js`, and the three icon files to a public repo (same folder, all committed together), then in the repo's **Settings → Pages**, set the source to **Deploy from a branch**, branch `main`, folder `/ (root)`. GitHub gives you a live link a minute or two later.
4. **First login** — sign in once as the coordinator. On a brand-new, empty database this is also when you'd run the one-time student import (see `local_seed_tool_DO_NOT_UPLOAD.html`, kept local-only). After that, hand teachers their login IDs and passwords.

## Adding a new teacher

In the Firebase console, go to **Authentication → Users → Add user** to create their login, then **Firestore → Data → `teachers` → Add document** with the document ID set to that exact login email, and fields `name`, `centre`, `role: "teacher"`.

## Known limitations

- **No self-service password reset.** Teacher login IDs (e.g. `aruna@akshar-paaul.app`) aren't real inboxes, so Firebase's email-based reset flow won't reach them as configured. Resets go through the coordinator via the Firebase console. Switching teachers to real email addresses would unlock self-service reset.
- **Field-level privacy is UI-level, not server-level** — see the caveat under **Roles** above.
- **Marathi/Hindi coverage is comprehensive, with two deliberate exceptions.** The language switcher translates essentially everything a person reads on screen — navigation, buttons, field labels, table headers, toasts, confirmation dialogs, validation warnings, and empty-state text — not just the visible chrome. Two things stay in English on purpose rather than by omission: CSV export file content (headers and data, e.g. the roster/attendance downloads) stays in English so spreadsheets stay interoperable regardless of who opens them and don't silently change meaning depending on which language mode happened to be active at export time; and the Activity log's stored `details` text (e.g. "Archived student") stays in English because it's a permanent historical record — translating it would mean an old entry's wording changes depending on when someone happens to look at it, which is misleading for an audit trail.
- **Student-name transliteration is approximate, by nature.** Turning a Latin-alphabet name into Devanagari automatically is inherently lossy — English spelling doesn't distinguish retroflex from dental consonants, or mark vowel length reliably (e.g. "Shinde" could reasonably be शिंदे or शिन्दे; "Joshi" could end in a short इ or long ई). The built-in engine makes a reasonable rule-based guess with no external dependency, but it won't always match how a family actually spells their name. That's exactly what the manual **Name (Devanagari)** override (per-student, or via CSV import) is for — a five-second fix that permanently wins over the guess for that student, in every language mode, from then on.
- **Attendance risk flag is a simple heuristic.** "3 or more absences in a row" counts consecutive *marked* sessions, not calendar days — a long gap between sessions with nothing marked in between doesn't count against a student, only actual recorded absences do. It's meant to catch a student quietly trailing off, not as a precise dropout prediction.
- **Moving a student to a new centre doesn't relabel their past attendance.** Each attendance record stores the centre it was marked at, as a historical snapshot — reassigning a student (one at a time, or via the Students tab's bulk "Change centre") only changes where they show up *going forward*. A teacher whose access is scoped to one centre won't see that student's older attendance from a different centre, since it's still tagged with the old one; a coordinator can always see everything.
- **No automated emailed reports.** The one-tap **Copy this month's summary** and **This month's CSV** shortcuts on the Reports tab cover the common "send me the numbers" need without any setup. A truly automated monthly email would need a paid Firebase plan (for a scheduled Cloud Function) plus a separate email-sending service and its own API key — real running costs and setup, so it wasn't built by default. It's a reasonable next step if that's ever worth the cost.

## Contributors

- Pruthvieraj Ghule
- Kashish Chelwani
