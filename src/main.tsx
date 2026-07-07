import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import App from "./App";
import "./index.css";

async function bootstrap(): Promise<void> {
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/browser");
    await worker.start({
      onUnhandledRequest: "bypass",
    });
  }

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

bootstrap();
