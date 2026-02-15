import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./theme/tokens.css";
import { initTheme } from "./theme/dark-mode";
import { App } from "./app/App";

// Initialize dark mode before rendering to prevent flash
initTheme();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
