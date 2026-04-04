import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import AddQuiz from "../pages/Addquiz";
import ProtectedRoute from "../components/ProtectedRoute";
import Result from "../pages/Result"

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },

      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },

      {
        path: "add-quiz",
        element: (
          <ProtectedRoute>
            <AddQuiz />
          </ProtectedRoute>
        ),
      },

      {
        path: "results",
        element: (
          <ProtectedRoute>
            <Result />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;