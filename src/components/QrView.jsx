// QrView.jsx: the QR Output View (Section 2).
// Shows the QR code, a live countdown, and the warning.
import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { deleteSecret } from "../db.js";

export default function QrView({ id, expiresAt, onSimulateScan, onReset }) {
  // Seconds remaining until the secret expires.
  const [secondsLeft, setSecondsLeft] = useState(
    Math.max(0, Math.round((expiresAt - Date.now()) / 1000))
  );

  // Update the countdown every second.
  useEffect(() => {
    const timer = setInterval(() => {
      const left = Math.max(0, Math.round((expiresAt - Date.now()) / 1000));
      setSecondsLeft(left);

      // TTL reached: delete the secret so it can't be opened anymore.
      if (left === 0) {
        deleteSecret(id);
        clearInterval(timer);
      }
    }, 1000);

    // Cleanup: stop the timer when this component is removed.
    return () => clearInterval(timer);
  }, [id, expiresAt]);

  // Format seconds as MM:SS.
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  // The link the QR code points to.
  const url =
    window.location.origin + window.location.pathname + "#/read/" + id;

  return (
    <div className="panel center">
      <div className="qr">
        <QRCode value={url} size={200} />
      </div>

      <div className="timer">{secondsLeft > 0 ? `${mm}:${ss}` : "EXPIRED"}</div>
      <div className="small">{url}</div>

      <div className="warn">
        ⚠️ SINGLE USE ONLY. ONCE SCANNED, IT WIPES FOREVER.
      </div>

      <button className="link" onClick={onSimulateScan}>
        [ Simulate Scan ]
      </button>
      <br />
      <button className="link" onClick={onReset}>
        [ New Drop ]
      </button>
    </div>
  );
}
