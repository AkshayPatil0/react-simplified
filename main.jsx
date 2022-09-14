import createRoot from "./src/react-dom/create-root";
import App from "./App";
import React from "./src/react";

const root = createRoot(document.querySelector("#app"));
root.render(<App />);
