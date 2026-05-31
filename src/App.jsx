import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AssessmentProvider } from "./context/AssessmentContext";
import ProtectedRoute from "./component/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OnboardingPage from "./pages/OnBoardingPage";
import AssessmentForm from "./pages/AssessmentForm";
import PsychometricForm from "./pages/PsychometricForm";
import ResultPage from "./pages/ResultPage";
import UserProfilePage from "./pages/UserProfilePage";

function App() {
  return (
    <AssessmentProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Guest-only Routes */}
          <Route
            path="/login"
            element={
              <ProtectedRoute requireAuth={false}>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute requireAuth={false}>
                <Register />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessment/step1"
            element={
              <ProtectedRoute>
                <AssessmentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessment/step2"
            element={
              <ProtectedRoute>
                <PsychometricForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/result"
            element={
              <ProtectedRoute>
                <ResultPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AssessmentProvider>
  );
}

export default App;
