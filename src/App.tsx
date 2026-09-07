import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import BagiListPage from "@/pages/BagiListPage";
import SetupPage from "@/pages/SetupPage";
import BagiDetailPage from "@/pages/BagiDetailPage";
import NotFoundPage from "@/pages/NotFoundPage";
import BagiFormPageItem from "@/pages/BagiFormPageItem";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/bagi" replace />,
  },
  {
    path: "/bagi",
    element: <BagiListPage />,
  },
  {
    path: "/bagi/new",
    element: <SetupPage />,
  },
  {
    path: "/bagi/:bagiId/edit",
    element: <SetupPage />,
  },
  { path: "/bagi/:bagiId/items", element: <BagiFormPageItem /> },
  {
    path: "/bagi/:bagiId",
    element: <BagiDetailPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
