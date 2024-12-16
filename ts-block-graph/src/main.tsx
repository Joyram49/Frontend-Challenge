import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import DivCountProvider from "./provider/DivCountProvider";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <DivCountProvider>
      <App />
    </DivCountProvider>
  </StrictMode>
);
