# DEAD//DROP: Self-Destructing QR Generator

URL:https://deaddrop-qr.vercel.app/

A cyberpunk-style demo where you write a secret, get a QR code, and the
secret is erased from the "database" once it is read (or when its timer runs out).


A self-destructing QR secret generator. Write a message, get a QR code, and the message is erased once it is read or when its timer runs out.

Features
Secret message composer
TTL presets: 1 min, 10 min, 1 hour, 24 hours
Burn after reading (delete on first open)
QR code output with live countdown
Decrypting text animation
TOMBSTONE screen on refresh, rescan, or expiry
Requirements
Node.js LTS (v18+)
VS Code (optional)
Setup & Run
bash
cd dead-drop
npm install
npm run dev

Open http://localhost:5173 (or the URL the terminal prints).

Command	Action
npm run dev	Start dev server
npm run build	Build to dist/
npm run preview	Preview the build

Stop the server with Ctrl+C.

How to Test
Write a message and click GENERATE QR.
Click [ Simulate Scan ]. The message decrypts and is deleted.
Refresh the page. You see the TOMBSTONE screen.
Project Structure
src/
├── components/
│   ├── CreateView.jsx     # Create form
│   ├── QrView.jsx         # QR + countdown
│   └── RecipientView.jsx  # Burn + decrypt
├── App.jsx                # Screen router
├── db.js                  # Save / read / delete logic
├── index.css              # Theme
└── main.jsx               # Entry point

Delete logic lives in src/db.js: saveSecret, readAndBurn, deleteSecret, makeId.

Notes
Storage is localStorage, so it only works in one browser.
Secrets are not encrypted. This is a demo, not a secure product.
To use a real backend, see the Firebase sketch in the comments of src/db.js.
Troubleshooting
npm not found: install Node.js LTS and restart VS Code.
Blank page: open the browser console (F12) and check for errors.
Changes not showing: save the file and confirm npm run dev is running.

- Storage is `localStorage`, so it only works in the same browser.
  See the comments in `src/db.js` to switch to Firebase.
