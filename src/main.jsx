// Entry point: mounts <App /> into the <div id="root"> in index.html.
// We do NOT use <React.StrictMode> here. In development it runs effects
// twice, which would make the "burn once" logic fire twice.
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(<App />);
