import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Removed the "!" after getElementById
createRoot(document.getElementById("root")).render(<App />);