import React, { useState } from "react";
import LandingPage from "./component/LandingPage";
import OnboardingPage from "./component/OnBoardingPage";
import AssessmentForm from "./component/AssessmentForm";
import PsychometricForm from "./component/PsychometricForm";
import ResultPage from "./component/ResultPage";
import LoadingPage from "./component/LoadingPage";
import Login from "./component/Login";
import Register from "./component/Register";
import UserProfilePage from "./component/UserProfilePage";

function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [previousPage, setPreviousPage] = useState(null);
  const [academicData, setAcademicData] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [behavioralData, setBehavioralData] = useState(null);

  const handleNavigateToProfile = () => {
    setPreviousPage(currentPage);
    setCurrentPage("profile");
  };

  if (currentPage === "landing") {
    return (
      <LandingPage
        onStart={() => setCurrentPage("onboarding")}
        onLoginClick={() => setCurrentPage("login")}
        onRegisterClick={() => setCurrentPage("register")}
        onProfileClick={handleNavigateToProfile}
      />
    );
  }

  if (currentPage === "login") {
    return (
      <Login
        onLoginSuccess={() => setCurrentPage("landing")}
        onNavigateRegister={() => setCurrentPage("register")}
        onBack={() => setCurrentPage("landing")}
      />
    );
  }

  if (currentPage === "register") {
    return (
      <Register
        onRegisterSuccess={() => setCurrentPage("login")}
        onLoginClick={() => setCurrentPage("login")}
        onBack={() => setCurrentPage("landing")}
      />
    );
  }

  if (currentPage === "profile") {
    return (
      <UserProfilePage
        onBack={() => setCurrentPage(previousPage || "landing")}
        onLogout={() => setCurrentPage("landing")}
        onNavigateToResult={(resData, acaData, behData) => {
          setResultData(resData);
          setAcademicData(acaData);
          setBehavioralData(behData);
          setCurrentPage("result");
        }}
      />
    );
  }

  if (currentPage === "onboarding") {
    return (
      <OnboardingPage
        onNext={() => setCurrentPage("assessment_step1")}
        onBack={() => setCurrentPage("landing")}
        onProfileClick={handleNavigateToProfile}
      />
    );
  }

  if (currentPage === "assessment_step1") {
    return (
      <AssessmentForm
        initialGrades={academicData} // <-- Kirim data yang tersimpan
        onBack={() => setCurrentPage("onboarding")}
        onProfileClick={handleNavigateToProfile}
        onNext={(data) => {
          setAcademicData(data); // Simpan data nilai ke App.jsx
          setCurrentPage("assessment_step2");
        }}
      />
    );
  }

  if (currentPage === "assessment_step2") {
    return (
      <PsychometricForm
        academicData={academicData}
        savedBehavioral={behavioralData} // <-- Kirim data yang tersimpan
        onSaveBehavioral={(data) => setBehavioralData(data)} // <-- Fungsi untuk menyimpan saat tombol back ditekan
        onProfileClick={handleNavigateToProfile}
        onBack={(target) => {
          if (target === "home") {
            setCurrentPage("landing");
          } else {
            setCurrentPage("assessment_step1");
          }
        }}
        onSubmitSuccess={(apiResponse, payloadStep2) => {
          setResultData(apiResponse);
          setBehavioralData(payloadStep2);
          setCurrentPage("result"); // Hapus baris loading ganda agar langsung masuk ke result
        }}
      />
    );
  }

  if (currentPage === "loading") {
    return <LoadingPage />;
  }

  if (currentPage === "result") {
    return (
      <ResultPage
        resultData={resultData}
        academicData={academicData}
        behavioralData={behavioralData}
        onRetry={() => {
          setAcademicData(null);
          setResultData(null);
          setBehavioralData(null);
          setCurrentPage("assessment_step1");
        }}
        onBack={() => setCurrentPage("landing")}
      />
    );
  }

  return null;
}

export default App;
