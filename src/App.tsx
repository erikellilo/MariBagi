import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import BagiListPage from "@/pages/BagiListPage";
import BagiWizardPage from "@/pages/BagiWizardPage";
import BagiDetailPage from "@/pages/BagiDetailPage";
import NotFoundPage from "@/pages/NotFoundPage";

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
    element: <BagiWizardPage />,
  },
  {
    path: "/bagi/new/items",
    element: <BagiWizardPage />,
  },
  {
    path: "/bagi/new/sharing",
    element: <BagiWizardPage />,
  },
  {
    path: "/bagi/:bagiId",
    element: <BagiDetailPage />,
  },
  {
    path: "/bagi/:bagiId/edit",
    element: <BagiWizardPage />,
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
