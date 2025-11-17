import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import ScrollToTop from "./Components/ScrollToTop.jsx";
import { AppContextProvider } from "./Context/AppContext.jsx";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <ScrollToTop />
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </BrowserRouter>
);
