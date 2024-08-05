import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import Home from "./pages/Home";
import Result from "./pages/Result";
import CalculatePage from "./pages/CalculatePage";
import { Navigate } from "react-router-dom";
import GlobalStyles from "./GlobalStyles";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "calculate",
        element: <CalculatePage />,
      },
      {
        path: "result/:resultId",
        element: <Result />,
      },
    ],
  },
]);

const App = () => {
  return (
    <>
      <GlobalStyles />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
