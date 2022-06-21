import React from "react";
import {StrictMode} from "react";
import "./index.css";

import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import {createRoot} from "react-dom/client";
import {BrowserRouter as Router} from "react-router-dom";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);

reportWebVitals();
