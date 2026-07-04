import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import AddQuiz from "../pages/Addquiz";
import ProtectedRoute from "../components/ProtectedRoute";
import Result from "../pages/Result";
import Ranking from "../pages/Ranking";
import Profile from './../pages/Profile';
import TopicPage from "../pages/TopicPage";
import QuizPage from "../pages/QuizPage";
import MyQuiz from "../pages/MyQuiz";
import ErrorBoundary from "../components/ErrorBoundary";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },

      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      {
        path: "user",
        children: [
          {
            path: "Profile",
            element:
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
          },
        ],
      },

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
        path: "addquiz",
        element: (
          <ProtectedRoute>
            <AddQuiz />
          </ProtectedRoute>
        ),
      },

      {
        path: "my-quiz",
        element: (
          <ProtectedRoute>
            <MyQuiz />
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

      {
        path: "ranking",
        element: (
          <ProtectedRoute>
            <Ranking />
          </ProtectedRoute>
        ),
      },

      {
        path: "topic/:slug",
        element: <TopicPage />,
      },

      {
        path: "results/:slug",
        element: (
          <ProtectedRoute>
            <Result />
          </ProtectedRoute>
        ),
      },

      {
        path: "quiz/:quizSlug",
        element: <QuizPage />,
      },

      {
        path: "*",
        element: <ErrorBoundary />,
      },
    ],
  },
]);

export default router;