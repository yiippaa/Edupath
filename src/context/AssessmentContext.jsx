import React, { createContext, useContext, useState, useEffect } from "react";

const AssessmentContext = createContext();

export function AssessmentProvider({ children }) {
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
    setAcademicData(null);
    setBehavioralData(null);
    setResultData(null);

    localStorage.removeItem("edupath_academic_data");
    localStorage.removeItem("edupath_behavioral_data");
    localStorage.removeItem("edupath_result_data");
    localStorage.removeItem("edupath_current_page");
  };

  // Sync academic data
  useEffect(() => {
    if (academicData) {
      localStorage.setItem("edupath_academic_data", JSON.stringify(academicData));
    } else {
      localStorage.removeItem("edupath_academic_data");
    }
  }, [academicData]);

  // Sync behavioral data
  useEffect(() => {
    if (behavioralData) {
      localStorage.setItem("edupath_behavioral_data", JSON.stringify(behavioralData));
    } else {
      localStorage.removeItem("edupath_behavioral_data");
    }
  }, [behavioralData]);

  // Sync result data
  useEffect(() => {
    if (resultData) {
      localStorage.setItem("edupath_result_data", JSON.stringify(resultData));
    } else {
      localStorage.removeItem("edupath_result_data");
    }
  }, [resultData]);

  return (
    <AssessmentContext.Provider
      value={{
        academicData,
        setAcademicData,
        resultData,
        setResultData,
        behavioralData,
        setBehavioralData,
        resultSource,
        setResultSource,
        clearAssessmentSession,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessment must be used within an AssessmentProvider");
  }
  return context;
}
