import ReactDOM from "react-dom/client";
import App from "./App";
import { StyleSheetManager } from "styled-components";
import { StrictMode } from "react";
import React from "react";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <StyleSheetManager shouldForwardProp={() => true}>
      <App />
    </StyleSheetManager>
  </StrictMode>
);
