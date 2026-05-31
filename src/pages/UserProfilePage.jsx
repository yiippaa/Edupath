import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAssessment } from "../context/AssessmentContext";
import { fetchWithAuth, handleLogout as backendLogout } from "../Utils/auth";
import { API_URL } from "../config";

function UserProfilePage() {
  const navigate = useNavigate();
  const {
    setAcademicData,
    setResultData,
    setBehavioralData,
    setResultSource,
    clearAssessmentSession,
  } = useAssessment();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Memuat Profile...");

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ full_name: "", school_name: "" });

  const [historyList, setHistoryList] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fetchUserProfile = async () => {
    setLoadingText("Memuat Profile...");
    setIsLoading(true);
    setErrorMsg("");
    try {
      // MENGGUNAKAN fetchWithAuth (Otomatis handle Bearer Token & Refresh Token)
      const response = await fetchWithAuth(`${API_URL}/profiles/me`);
      const result = await response.json();

      if (!result.success)
        throw new Error(result.message || "Gagal mengambil profil.");

      setProfileData(result.data);
      setFormData({
        full_name: result.data.full_name || "",
        school_name: result.data.school_name || "",
      });
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAssessmentHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/assessments`);
      const result = await response.json();

      if (result.success && result.data) {
        // Saring array agar hanya menyimpan data dengan status 'processed'
        const completedAssessments = result.data.filter(
          (item) => item.status === "processed",
        );

        setHistoryList(completedAssessments);
      }
    } catch (error) {
      console.error("Gagal mengambil riwayat asesmen:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchAssessmentHistory();
  }, []);

  const handleViewResult = async (item) => {
    setLoadingText("Memuat Detail Hasil...");
    setIsLoading(true);
    try {
      const assRes = await fetchWithAuth(
        `${API_URL}/assessments/${item.assessment_id}`,
      );
      const assData = await assRes.json();

      if (!assData.success) throw new Error("Gagal mengambil detail asesmen");

      let recommendationId = item.recommendation_id;

      if (!recommendationId) {
        const predictRes = await fetchWithAuth(
          `${API_URL}/recommendations/predict`,
          {
            method: "POST",
            body: JSON.stringify({ assessment_id: item.assessment_id }),
          },
        );
        const predictData = await predictRes.json();
        if (predictData.success && predictData.data?.recommendation_id) {
          recommendationId = predictData.data.recommendation_id;
        }
      }

      if (!recommendationId)
        throw new Error("Gagal mendapatkan ID rekomendasi");

      const recRes = await fetchWithAuth(
        `${API_URL}/recommendations/${recommendationId}`,
      );
      const recData = await recRes.json();

      if (!recData.success)
        throw new Error("Gagal mengambil detail rekomendasi");

      const academicData = {
        Matematika: assData.data.math_score,
        Fisika: assData.data.physics_score,
        Kimia: assData.data.chemistry_score,
        Biologi: assData.data.biology_score,
        Sejarah: assData.data.history_score,
        Geografi: assData.data.geography_score,
        "Bahasa Inggris": assData.data.english_score,
      };

      const behavioralData = {
        weekly_self_study_hours: assData.data.weekly_self_study_hours,
        absence_days: assData.data.absence_days,
        part_time_job: assData.data.part_time_job,
        extracurricular: assData.data.extracurricular,
      };

      setResultData(recData);
      setAcademicData(academicData);
      setBehavioralData(behavioralData);
      setResultSource("history");
      navigate("/result");
    } catch (error) {
      console.error(error);
      alert("Gagal memuat hasil asesmen.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetail = async (assessmentId) => {
    setShowModal(true);
    setIsLoadingDetail(true);
    setSelectedDetail(null);

    try {
      // MENGGUNAKAN fetchWithAuth
      const response = await fetchWithAuth(
        `${API_URL}/assessments/${assessmentId}`,
      );
      const result = await response.json();

      if (result.success) {
        setSelectedDetail(result.data);
      } else {
        throw new Error("Gagal memuat detail data");
      }
    } catch (error) {
      console.error(error);
      setSelectedDetail({ error: true });
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // MENGGUNAKAN fetchWithAuth (Hanya perlu mengirim method dan body)
      const response = await fetchWithAuth(`${API_URL}/profiles/me`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (!result.success) {
        let errorMessage = "Gagal memperbarui profil.";
        if (
          result.error?.code === "VALIDATION_ERROR" &&
          Array.isArray(result.error.details)
        ) {
          errorMessage = result.error.details
            .map((err) => err.message)
            .join(", ");
        } else if (typeof result.error?.details === "string") {
          errorMessage = result.error.details;
        }
        throw new Error(errorMessage);
      }

      setProfileData(result.data);
      setIsEditing(false);
      setSuccessMsg("Profil berhasil diperbarui!");

      if (result.data.full_name)
        localStorage.setItem("user_name", result.data.full_name);
      if (result.data.school_name)
        localStorage.setItem("user_school", result.data.school_name);

      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoutClick = () => {
    setIsLoggingOut(true);
    backendLogout(() => {
      clearAssessmentSession();
      navigate("/");
    });
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-blue-600 animate-pulse">{loadingText}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 pb-12">
      {/* OVERLAY LOADING FULL SCREEN FOR LOGOUT */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-md animate-fadeIn">
          <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-5 shadow-lg"></div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-1 tracking-tight">
            Sedang Keluar...
          </h2>
          <p className="text-slate-500 font-medium">
            Menghapus sesi otentikasi Anda
          </p>
        </div>
      )}

      {/* HEADER UTAMA */}
      <header className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-md transition-all duration-300 ease-in-out border-b border-slate-200">
        <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
          <div className="flex-1 flex items-center">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-slate-600 hover:text-primary transition font-semibold"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
          </div>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="font-h2 text-h2 text-primary tracking-tight font-bold text-center text-xl cursor-pointer hover:opacity-80 transition-opacity"
          >
            EduPath
          </button>
          <div className="flex-1"></div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-8">
        {/* KARTU PROFIL PENGGUNA */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 h-24 relative">
            <div className="absolute -bottom-8 left-8">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-xl font-extrabold text-blue-600 shadow-sm border-4 border-white">
                {getInitials(profileData?.full_name)}
              </div>
            </div>
          </div>

          <div className="pt-10 px-8 pb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  {profileData?.full_name || "Nama Tidak Tersedia"}
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  {profileData?.email || "Email Tidak Tersedia"}
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4 border border-red-100">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="bg-green-50 text-green-700 text-sm p-3 rounded-xl mb-4 border border-green-100">
                {successMsg}
              </div>
            )}

            {!isEditing ? (
              <div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Asal Sekolah
                  </p>
                  <p className="font-semibold text-slate-700 text-sm">
                    {profileData?.school_name || "-"}
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                  {/* TOMBOL LOGOUT DIPERBARUI */}
                  <button
                    onClick={handleLogoutClick}
                    className="px-4 py-2 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      ></path>
                    </svg>
                    Keluar
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-5 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    Edit Profil
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      required
                      value={formData.full_name}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Asal Sekolah
                    </label>
                    <input
                      type="text"
                      name="school_name"
                      required
                      value={formData.school_name}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    className="px-5 py-2 text-slate-500 text-xs font-bold rounded-lg hover:bg-slate-100 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`px-5 py-2 text-white text-xs font-bold rounded-lg transition ${isSaving ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
                  >
                    {isSaving ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* BAGIAN RIWAYAT ASESMEN */}
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-lg font-bold text-slate-800 flex items-center">
              <span className="text-blue-500 mr-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  ></path>
                </svg>
              </span>{" "}
              Riwayat Asesmen
            </h2>
            <span className="text-xs font-bold text-slate-400 bg-slate-200 px-2.5 py-1 rounded-full">
              {historyList.length} Total
            </span>
          </div>

          {isLoadingHistory ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-400 rounded-full animate-spin mb-3"></div>
              <p className="text-sm text-slate-500 font-medium">
                Memuat riwayat...
              </p>
            </div>
          ) : historyList.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-slate-200 border-dashed text-center">
              <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              </div>
              <h3 className="font-bold text-slate-700 mb-1">
                Belum Ada Riwayat
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Kamu belum pernah menyelesaikan asesmen. Mulai asesmen pertamamu
                sekarang!
              </p>
              <button
                onClick={() => navigate("/onboarding")}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-all text-xs cursor-pointer"
              >
                Mulai Asesmen Sekarang
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {historyList.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition flex flex-col group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                      Asesmen #{historyList.length - index}
                    </div>
                    {item.status === "processed" ? (
                      <span className="text-green-500 bg-green-50 rounded-full p-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </span>
                    ) : (
                      <span className="text-amber-500 bg-amber-50 rounded-full p-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1">
                    {formatDate(item.created_at)}
                  </h3>

                  {/* Menampilkan Singkat Rekomendasi Karir */}
                  {item.top_career ? (
                    <div className="mb-4 mt-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Rekomendasi Teratas
                      </p>
                      <div className="flex gap-2 flex-col pt-2">
                        <p className="text-sm font-semibold text-slate-800 flex items-center">
                          <svg
                            className="w-4 h-4 mr-1.5 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          {item.top_career}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 mb-4 mt-2 italic flex items-center gap-1">
                      <span className="w-3 h-3 border-2 border-slate-200 border-t-slate-400 rounded-full animate-spin"></span>
                      Memuat rekomendasi...
                    </p>
                  )}

                  <div className="mt-auto pt-4 border-t border-slate-100 flex gap-2">
                    <button
                      onClick={() => handleViewDetail(item.assessment_id)}
                      className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-[11px] font-bold rounded-xl transition border border-slate-200 shadow-sm flex items-center justify-center gap-1"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        ></path>
                      </svg>
                      Detail Nilai
                    </button>
                    <button
                      onClick={() => handleViewResult(item)}
                      className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-[11px] font-bold rounded-xl transition border border-blue-200 shadow-sm flex items-center justify-center gap-1"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        ></path>
                      </svg>
                      Lihat Hasil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* POP-UP MODAL: DETAIL ASESMEN */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-slideUp">
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg mr-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    ></path>
                  </svg>
                </span>
                Detail Nilai Asesmen
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            {/* Isi Modal */}
            <div className="p-6 overflow-y-auto">
              {isLoadingDetail ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-sm font-medium text-slate-500">
                    Membuka detail nilai...
                  </p>
                </div>
              ) : selectedDetail?.error ? (
                <div className="text-center py-10 text-red-500 text-sm font-bold bg-red-50 rounded-2xl">
                  Gagal memuat detail data asesmen ini.
                </div>
              ) : selectedDetail ? (
                <div className="space-y-6">
                  {/* Tanggal & ID */}
                  <div className="flex flex-wrap justify-between items-center text-xs text-slate-500 pb-2 border-b border-slate-100">
                    <span>
                      Dikirim pada:{" "}
                      <strong className="text-slate-700">
                        {formatDate(selectedDetail.created_at)}
                      </strong>
                    </span>
                    <span className="font-mono bg-slate-100 px-2 py-1 rounded">
                      ID: {selectedDetail.assessment_id?.substring(0, 8)}...
                    </span>
                  </div>

                  {/* Ringkasan Rata-rata */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
                      <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">
                        Sains
                      </p>
                      <p className="text-2xl font-black text-blue-700">
                        {selectedDetail.science_avg}
                      </p>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center">
                      <p className="text-[10px] font-bold text-amber-500 uppercase mb-1">
                        Sosial
                      </p>
                      <p className="text-2xl font-black text-amber-600">
                        {selectedDetail.social_avg}
                      </p>
                    </div>
                    <div className="bg-slate-800 rounded-2xl p-4 text-center shadow-md">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                        Overall
                      </p>
                      <p className="text-2xl font-black text-white">
                        {selectedDetail.overall_score}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nilai Mata Pelajaran */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center border-b border-slate-100 pb-2">
                        <svg
                          className="w-4 h-4 mr-1.5 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          ></path>
                        </svg>
                        Mata Pelajaran
                      </h4>
                      <ul className="space-y-2.5 text-xs">
                        <li className="flex justify-between">
                          <span className="text-slate-500">Matematika</span>
                          <span className="font-bold text-slate-700">
                            {selectedDetail.math_score}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-slate-500">Fisika</span>
                          <span className="font-bold text-slate-700">
                            {selectedDetail.physics_score}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-slate-500">Kimia</span>
                          <span className="font-bold text-slate-700">
                            {selectedDetail.chemistry_score}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-slate-500">Biologi</span>
                          <span className="font-bold text-slate-700">
                            {selectedDetail.biology_score}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-slate-500">Sejarah</span>
                          <span className="font-bold text-slate-700">
                            {selectedDetail.history_score}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-slate-500">Geografi</span>
                          <span className="font-bold text-slate-700">
                            {selectedDetail.geography_score}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-slate-500">B. Inggris</span>
                          <span className="font-bold text-slate-700">
                            {selectedDetail.english_score}
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* Profil Perilaku */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center border-b border-slate-100 pb-2">
                        <svg
                          className="w-4 h-4 mr-1.5 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          ></path>
                        </svg>
                        Profil Perilaku
                      </h4>
                      <ul className="space-y-3.5 text-xs">
                        <li className="flex justify-between items-center">
                          <span className="text-slate-500">Jam Belajar</span>
                          <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                            {selectedDetail.weekly_self_study_hours} Jam
                          </span>
                        </li>
                        <li className="flex justify-between items-center">
                          <span className="text-slate-500">Ketidakhadiran</span>
                          <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                            {selectedDetail.absence_days} Hari
                          </span>
                        </li>
                        <li className="flex justify-between items-center">
                          <span className="text-slate-500">
                            Ekstrakurikuler
                          </span>
                          {selectedDetail.extracurricular ? (
                            <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                              Aktif
                            </span>
                          ) : (
                            <span className="font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              Tidak
                            </span>
                          )}
                        </li>
                        <li className="flex justify-between items-center">
                          <span className="text-slate-500">Part Time</span>
                          {selectedDetail.part_time_job ? (
                            <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                              Ya
                            </span>
                          ) : (
                            <span className="font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              Tidak
                            </span>
                          )}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Footer Modal */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-900 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfilePage;
