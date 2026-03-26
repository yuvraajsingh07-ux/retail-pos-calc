import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 1200,
        style: {
          background: "#1e293b",
          color: "#f8fafc",
          border: "1px solid #334155",
          fontSize: "13px",
        },
      }}
    />
  </>
);
