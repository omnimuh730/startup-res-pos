
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { initAppTheme } from "./theme/appTheme";
  import "./styles/index.css";

  initAppTheme();
  createRoot(document.getElementById("root")!).render(<App />);
  
