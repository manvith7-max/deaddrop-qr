// CreateView.jsx: the Creation Dashboard (Section 1).
// The user types a secret, picks security settings, and generates a drop.
import { useState } from "react";
import { saveSecret, makeId } from "../db.js";

export default function CreateView({ onCreate }) {
  // Form values, each stored in React state.
  const [message, setMessage] = useState("");
  const [burn, setBurn] = useState(true);
  const [ttlMinutes, setTtlMinutes] = useState(10);

  function handleGenerate() {
    const id = makeId();

    // Build the record we want to store.
    const record = {
      message,
      burnAfterReading: burn,
      // Turn "minutes from now" into an absolute timestamp.
      expiresAt: Date.now() + ttlMinutes * 60 * 1000,
    };

    saveSecret(id, record); // "Upload" to our database.
    onCreate(id, record.expiresAt); // Tell App to show the QR code.
  }

  return (
    <div className="panel">
      <label>&gt; Secret Message</label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type the payload to hide..."
      />

      <label>&gt; Time-To-Live</label>
      <select
        value={ttlMinutes}
        onChange={(e) => setTtlMinutes(Number(e.target.value))}
      >
        <option value={1}>1 minute</option>
        <option value={10}>10 minutes</option>
        <option value={60}>1 hour</option>
        <option value={1440}>24 hours</option>
      </select>

      <label className="row">
        <input
          type="checkbox"
          checked={burn}
          onChange={(e) => setBurn(e.target.checked)}
        />
        Burn after reading
      </label>

      {/* Disabled until there is some text to send. */}
      <button
        className="btn"
        disabled={!message.trim()}
        onClick={handleGenerate}
      >
        Generate QR
      </button>
    </div>
  );
}
