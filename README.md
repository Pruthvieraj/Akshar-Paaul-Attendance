# Akshar Paaul Attendance

A single-page web app for **Akshar Paaul** (Pune, India) to record and track daily student attendance across its centres — built as one self-contained `index.html`, backed by Firebase, and hosted for free on GitHub Pages.

Coordinators see every centre; teachers log in and land straight on their own. No app to install — it opens like any web page and remembers a signed-in device, so teachers only log in once.

## Live app

`https://<your-github-username>.github.io/<repo-name>/`

(Fill this in once GitHub Pages is turned on — see **Deploying** below.)

## Features

- **Mark attendance** — a roll-call-style list built around the actual field task: swipe or tap each student present/absent, with a progress ring showing how many are marked for the day.
- **Students & records** — full roster per centre, tap-to-edit details, search, and column sorting; a coordinator can add, edit, or delete students, a teacher can add and edit within their own centre.
- **Reports** — attendance percentage per student, flags for records that need review, and CSV export (totals, or a detailed per-date present/absent grid).
- **Works offline** — a tap that can't reach the server right away is queued on-device and synced automatically the moment the connection returns, with a banner showing what's still pending.
- **Light/dark mode** — a toggle in the corner switches instantly and remembers the choice; it also follows the device's system setting until someone picks one explicitly.
- **Privacy-aware by role** — a student's contact number, parents' education, and full home address are visible to coordinators only; teachers see everything else they need (name, class, gender, age, medium, attendance history) with those fields shown as "Coordinator only." This applies to both the on-screen detail panel and the CSV exports.

## Tech stack

- Plain HTML/CSS/JavaScript — no build step, no framework, no bundler. The whole app is one file.
- [Firebase](https://firebase.google.com) Authentication (email/password) for logins, and Firestore for data — loaded straight from Google's CDN via `import()`, so there's nothing to `npm install`.
- Hosted as a static file on **GitHub Pages**.

## Repo contents

| File | Purpose |
|---|---|
| `index.html` | The entire app. This is the only file that needs to be deployed. |
| `SETUP.md` | Step-by-step first-time setup (Firebase project, logins, hosting). |
| `SECURITY_UPDATE.md`, `RULES_UPDATE_2.md` | History of security/rules changes — see **Firestore security rules** below for the current rules. |

**Do not commit `local_seed_tool_DO_NOT_UPLOAD.html`.** It's a local-only utility that contains the full student roster in its page source, used solely to re-seed a fresh Firebase project. Keep it off GitHub — a `.gitignore` with that filename is a good idea:

```
local_seed_tool_DO_NOT_UPLOAD.html
```

## Data model (Firestore)

| Collection | Document ID | Key fields |
|---|---|---|
| `teachers` | login email | `name`, `centre`, `role` (`"coordinator"` or `"teacher"`) |
| `students` | generated ID | `name`, `centre`, `teacher`, `std`, `gender`, `age`, `medium`, `contact`, `mother_edu`, `father_edu`, `funding_partner`, … |
| `attendance` | `{studentId}_{date}` | `studentId`, `date`, `centre`, `v` (1 = present, 0 = absent), `by` |

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
  }
}
```

Nobody who isn't signed in can read or write anything. A signed-in teacher is limited to their own centre's students and attendance; a coordinator can reach everything.

## Deploying

1. **Firebase** — create a project, turn on Firestore and Email/Password authentication, add one login per person (coordinator + each teacher), and publish the rules above. Full walkthrough in `SETUP.md`.
2. **Point the app at your project** — open `index.html`, find `FIREBASE_CONFIG` near the top of the last `<script>` tag, and paste in your Firebase project's web config (Project settings → Your apps → Web app). These values identify the project, not grant access — access is controlled entirely by the rules above and who has a login.
3. **GitHub Pages** — push `index.html` to a public repo, then in the repo's **Settings → Pages**, set the source to **Deploy from a branch**, branch `main`, folder `/ (root)`. GitHub gives you a live link a minute or two later.
4. **First login** — sign in once as the coordinator. On a brand-new, empty database this is also when you'd run the one-time student import (see `local_seed_tool_DO_NOT_UPLOAD.html`, kept local-only). After that, hand teachers their login IDs and passwords.

## Adding a new teacher

In the Firebase console, go to **Authentication → Users → Add user** to create their login, then **Firestore → Data → `teachers` → Add document** with the document ID set to that exact login email, and fields `name`, `centre`, `role: "teacher"`.

## Known limitations

- **No self-service password reset.** Teacher login IDs (e.g. `aruna@akshar-paaul.app`) aren't real inboxes, so Firebase's email-based reset flow won't reach them as configured. Resets go through the coordinator via the Firebase console. Switching teachers to real email addresses would unlock self-service reset.
- **Field-level privacy is UI-level, not server-level** — see the caveat under **Roles** above.

## Contributors

- Pruthvieraj Ghule
- Kashish Chelwani
