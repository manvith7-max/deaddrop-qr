// RecipientView.jsx: the Recipient View / "Burn" mechanism (Section 3).
//
// Flow:
//   1. On load, readAndBurn() fetches the secret and deletes it.
//   2. If nothing comes back, show the TOMBSTONE error.
//   3. Otherwise, play the "decrypting" animation and reveal the text.
import { useState, useEffect, useRef } from "react";
import { readAndBurn } from "../db.js";

// Characters used for the scrambling effect.
const GLYPHS = "!<>-_\\/[]{}=+*^?#01";

export default function RecipientView({ id }) {
  // phase: "loading" | "decrypting" | "revealed" | "tombstone"
  const [phase, setPhase] = useState("loading");
  const [display, setDisplay] = useState("");

  // Guard so the burn runs only once, even if the effect re-runs.
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    // STEP 1: fetch AND delete. This happens the moment the view loads.
    const record = readAndBurn(id);

    // STEP 2: nothing came back, so it was already destroyed.
    if (!record) {
      setPhase("tombstone");
      return;
    }

    // STEP 3: the decrypting animation.
    // The message now lives only in this component's memory, not in the database.
    const secret = record.message;
    let revealed = 0; // How many characters are decoded so far.
    setPhase("decrypting");

    const anim = setInterval(() => {
      revealed += 0.5;

      // Decoded letters for the first N characters, random glyphs for the rest.
      const text = secret
        .split("")
        .map((ch, i) => {
          if (ch === " " || ch === "\n") return ch; // Keep spaces and line breaks.
          return i < revealed
            ? ch
            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");

      setDisplay(text);

      // Animation finished: show the full message.
      if (revealed >= secret.length) {
        clearInterval(anim);
        setDisplay(secret);
        setPhase("revealed");
      }
    }, 40);

    // Cleanup: stop the animation if the component is removed.
    return () => clearInterval(anim);
  }, [id]);

  // Red error screen for destroyed or expired payloads.
  if (phase === "tombstone") {
    return (
      <div className="panel tomb">
        <h2>☠ TOMBSTONE</h2>
        <p>Signal Lost. This payload has been destroyed.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <label>
        &gt;{" "}
        {phase === "revealed"
          ? "Decrypted payload"
          : phase === "loading"
          ? "Fetching..."
          : "Decrypting..."}
      </label>

      <div className="secret">{display}</div>

      {phase === "revealed" && (
        <div className="small" style={{ marginTop: 14 }}>
          This message is now erased from the server. Copy it now. Refreshing
          will destroy access.
        </div>
      )}
    </div>
  );
}
