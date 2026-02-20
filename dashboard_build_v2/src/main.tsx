import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./theme/tokens.css";
import { initTheme } from "./theme/dark-mode";

// Initialize dark mode before rendering to prevent flash
initTheme();

// App component will be created in a later plan
// For now, render a placeholder to verify the build toolchain works
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div>Kompete v2</div>
  </StrictMode>,
);
