import React, { useState, useEffect } from "react";
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
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem("edupath_current_page") || "landing";
  });
  const [previousPage, setPreviousPage] = useState(null);
  const [academicData, setAcademicData] = useState(() => {
    const saved = localStorage.getItem("edupath_academic_data");
    return saved ? JSON.parse(saved) : null;
  });
  const [resultData, setResultData] = useState(() => {
    const saved = localStorage.getItem("edupath_result_data");
    return saved ? JSON.parse(saved) : null;
  });
  const [behavioralData, setBehavioralData] = useState(() => {
    const saved = localStorage.getItem("edupath_behavioral_data");
    return saved ? JSON.parse(saved) : null;
  });
  const [resultSource, setResultSource] = useState("form");

  const clearAssessmentSession = () => {
    // 1. Reset state React ke null
    setAcademicData(null);
    setBehavioralData(null);
    setResultData(null);

    // 2. Hapus key terkait dari localStorage
    localStorage.removeItem("edupath_academic_data");
    localStorage.removeItem("edupath_behavioral_data");
    localStorage.removeItem("edupath_result_data");
    localStorage.removeItem("edupath_current_page");
  };

  // Sinkronisasi data halaman aktif
  useEffect(() => {
    localStorage.setItem("edupath_current_page", currentPage);
  }, [currentPage]);

  // Sinkronisasi data akademik step 1
  useEffect(() => {
    if (academicData) {
      localStorage.setItem(
        "edupath_academic_data",
        JSON.stringify(academicData),
      );
    } else {
      localStorage.removeItem("edupath_academic_data");
    }
  }, [academicData]);

  // Sinkronisasi data perilaku/psikometri step 2
  useEffect(() => {
    if (behavioralData) {
      localStorage.setItem(
        "edupath_behavioral_data",
        JSON.stringify(behavioralData),
      );
    } else {
      localStorage.removeItem("edupath_behavioral_data");
    }
  }, [behavioralData]);

  // Sinkronisasi data hasil analisis AI
  useEffect(() => {
    if (resultData) {
      localStorage.setItem("edupath_result_data", JSON.stringify(resultData));
    } else {
      localStorage.removeItem("edupath_result_data");
    }
  }, [resultData]);

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
        onLoginSuccess={() => {
          clearAssessmentSession(); // <--- BERSIHKAN DATA SEBELUM MASUK LANDING
          setCurrentPage("landing");
        }}
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
        onLogout={() => {
          clearAssessmentSession(); // <--- BERSIHKAN DATA SAAT USER KELUAR
          setCurrentPage("landing");
        }}
        onNavigateToResult={(resData, acaData, behData) => {
          setResultData(resData);
          setAcademicData(acaData);
          setBehavioralData(behData);
          setResultSource("history");
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
        savedBehavioral={behavioralData}
        onSaveBehavioral={(data) => setBehavioralData(data)}
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
          setResultSource("form"); // <--- Atur penanda selesai isi form baru
          setCurrentPage("result");
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
        onProfileClick={handleNavigateToProfile}
        onRetry={() => {
          setAcademicData(null);
          setBehavioralData(null);
          setResultData(null);

          localStorage.removeItem("edupath_academic_data");
          localStorage.removeItem("edupath_behavioral_data");
          localStorage.removeItem("edupath_result_data");

          setCurrentPage("assessment_step1");
        }}
        onBack={() => {
          if (resultSource === "history") {
            setCurrentPage("profile");
          } else {
            setCurrentPage("landing");
          }
        }}
      />
    );
  }

  return null;
}

export default App;
