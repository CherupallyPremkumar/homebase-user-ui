import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// import { initMonitoring } from "./lib/monitoring";

// Initialize monitoring and analytics
// TODO: Enable monitoring later after configuration
// initMonitoring();

createRoot(document.getElementById("root")!).render(<App />);
