import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { errorMonitor } from "./lib/error-monitoring";

// Initialize error monitoring for ProtoLab
console.log("ProtoLab error monitoring active:", errorMonitor.getStats());

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
