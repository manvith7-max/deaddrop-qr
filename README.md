# DEAD//DROP: Self-Destructing QR Generator

A cyberpunk-style demo where you write a secret, get a QR code, and the
secret is erased from the "database" once it is read (or when its timer runs out).

## Run it in VS Code

1. Open this folder in VS Code (`File > Open Folder`).
2. Open a terminal (`Ctrl+`` ` or `Cmd+` ``) and run:

   ```bash
   npm install
   npm run dev
   ```

3. Click the local URL it prints (usually http://localhost:5173).

## How to test the burn

1. Type a message and press **Generate QR**.
2. Press **[ Simulate Scan ]**: the message decrypts and is deleted.
3. Refresh the page: you get the red TOMBSTONE screen.

## Project map

| File | Purpose |
| --- | --- |
| `src/db.js` | Fake database. All save / read / delete logic lives here. |
| `src/App.jsx` | Chooses which screen to show based on the URL. |
| `src/components/CreateView.jsx` | Creation form. |
| `src/components/QrView.jsx` | QR code + countdown. |
| `src/components/RecipientView.jsx` | Burn + decrypt animation. |
| `src/index.css` | Cyberpunk theme. |

## Notes

- Storage is `localStorage`, so it only works in the same browser.
  See the comments in `src/db.js` to switch to Firebase.
