import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import Home from "./pages/Home";
import Result from "./pages/Result";
import CalculatePage from "./pages/CalculatePage";
import { Navigate } from "react-router-dom";
import GlobalStyles from "./GlobalStyles";
import { store } from "./store";
import { Provider } from "react-redux";

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
    <Provider store={store}>
      <GlobalStyles />
      <RouterProvider router={router} />
    </Provider>
  );
};

export default App;
