/* =====================================================================
   MOCK DATABASE: this file handles storing and DELETING secrets.
   ---------------------------------------------------------------------
   We fake a backend with localStorage, so "refresh = tombstone" works.
   To switch to Firebase later, keep the same function names and replace
   the bodies:

     saveSecret(id, record) -> await setDoc(doc(db, "drops", id), record)
     deleteSecret(id)       -> await deleteDoc(doc(db, "drops", id))
     readAndBurn(id)        -> runTransaction(): read the doc, then delete
                               it in the SAME transaction, so two people
                               can never read the same secret.
   ===================================================================== */

const DB_KEY = "deaddrop_db";

// Load the whole fake database (an object of id -> record).
function loadDb() {
  try {
    return JSON.parse(localStorage.getItem(DB_KEY)) || {};
  } catch {
    return {};
  }
}

// Save the whole fake database back to storage.
function saveDb(db) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    // Storage full or blocked. Ignore for this demo.
  }
}

// CREATE: store a secret under its random id.
export function saveSecret(id, record) {
  const db = loadDb();
  db[id] = record;
  saveDb(db);
}

// DELETE: permanently erase one record from the database.
export function deleteSecret(id) {
  const db = loadDb();
  delete db[id]; // The data is gone from storage after this line.
  saveDb(db);
}

// READ + BURN: fetch a secret and, if "burn after reading" is on,
// erase it BEFORE returning it to the UI.
// Returns the record, or null if it never existed, was already burned,
// or has expired.
export function readAndBurn(id) {
  const record = loadDb()[id];

  // Nothing there? It was already burned or never existed.
  if (!record) return null;

  // Past its time-to-live? Erase it and treat it as gone.
  if (Date.now() > record.expiresAt) {
    deleteSecret(id);
    return null;
  }

  // THE BURN: delete first, then return the message.
  // After this, a refresh or second scan finds nothing.
  if (record.burnAfterReading) {
    deleteSecret(id);
  }

  return record;
}

// Make a random id like "k3x9a1b2".
export function makeId() {
  return Math.random().toString(36).slice(2, 10);
}
