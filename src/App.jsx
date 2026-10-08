// App.jsx: the main shell. It decides which screen to show.
//   "#/read/<id>" -> Recipient view (the burn screen)
//   anything else -> Creator flow (create, then show the QR)
import { useState, useEffect } from "react";
import CreateView from "./components/CreateView.jsx";
import QrView from "./components/QrView.jsx";
import RecipientView from "./components/RecipientView.jsx";

export default function App() {
  // The current URL hash, e.g. "#/read/abc123". Kept in state so the
  // screen updates when the hash changes.
  const [hash, setHash] = useState(window.location.hash);

  // After generating a QR, we keep the id and expiry time here.
  const [drop, setDrop] = useState(null); // { id, expiresAt } or null

  // Listen for hash changes (e.g. when "Simulate Scan" is clicked).
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  // Check whether the URL points at a recipient page.
  const readMatch = hash.match(/^#\/read\/(\w+)/);

  let content;

  if (readMatch) {
    // RECIPIENT: the id from the URL is the key to the database.
    content = (
      <>
        <RecipientView id={readMatch[1]} />
        <button
          className="link"
          onClick={() => {
            window.location.hash = "";
            setDrop(null);
          }}
        >
          &lt; back to terminal
        </button>
      </>
    );
  } else if (drop) {
    // CREATOR: the QR code is showing.
    content = (
      <QrView
        id={drop.id}
        expiresAt={drop.expiresAt}
        onSimulateScan={() => {
          window.location.hash = "#/read/" + drop.id;
        }}
        onReset={() => setDrop(null)}
      />
    );
  } else {
    // CREATOR: the form.
    content = (
      <CreateView onCreate={(id, expiresAt) => setDrop({ id, expiresAt })} />
    );
  }

  return (
    <div className="wrap">
      <h1>DEAD//DROP</h1>
      <div className="sub">ephemeral · single-use · untraceable</div>
      {content}
    </div>
  );
}
