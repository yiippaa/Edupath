import React, { useState, useEffect } from 'react';
import { fetchWithAuth, handleLogout as backendLogout } from '../Utils/auth';

function UserProfilePage({ onBack, onLogout }) {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', school_name: '' });

  const [historyList, setHistoryList] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchUserProfile();
    fetchAssessmentHistory();
  }, []);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      // MENGGUNAKAN fetchWithAuth (Otomatis handle Bearer Token & Refresh Token)
      const response = await fetchWithAuth('https://edupath-backend.vercel.app/api/v1/profiles/me');
      const result = await response.json();

      if (!result.success) throw new Error(result.message || 'Gagal mengambil profil.');

      setProfileData(result.data);
      setFormData({
        full_name: result.data.full_name || '',
        school_name: result.data.school_name || ''
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
      // MENGGUNAKAN fetchWithAuth
      const response = await fetchWithAuth('https://edupath-backend.vercel.app/api/v1/assessments');
      const result = await response.json();

      if (result.success && result.data) {
        setHistoryList(result.data);
      }
    } catch (error) {
      console.error("Gagal mengambil riwayat asesmen:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleViewDetail = async (assessmentId) => {
    setShowModal(true);
    setIsLoadingDetail(true);
    setSelectedDetail(null);

    try {
      // MENGGUNAKAN fetchWithAuth
      const response = await fetchWithAuth(`https://edupath-backend.vercel.app/api/v1/assessments/${assessmentId}`);
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
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // MENGGUNAKAN fetchWithAuth (Hanya perlu mengirim method dan body)
      const response = await fetchWithAuth('https://edupath-backend.vercel.app/api/v1/profiles/me', {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      const result = await response.json();

      if (!result.success) {
        let errorMessage = 'Gagal memperbarui profil.';
        if (result.error?.code === 'VALIDATION_ERROR' && Array.isArray(result.error.details)) {
          errorMessage = result.error.details.map(err => err.message).join(', ');
        } else if (typeof result.error?.details === 'string') {
          errorMessage = result.error.details;
        }
        throw new Error(errorMessage);
      }

      setProfileData(result.data);
      setIsEditing(false);
      setSuccessMsg('Profil berhasil diperbarui!');
      
      if (result.data.full_name) localStorage.setItem('user_name', result.data.full_name);
      if (result.data.school_name) localStorage.setItem('user_school', result.data.school_name);

      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // MENGGUNAKAN FUNGSI LOGOUT DARI authUtils
  const handleLogoutClick = () => {
    backendLogout(() => {
      if (onLogout) onLogout(); // Panggil fungsi transisi halaman dari App.jsx
    });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-50 flex justify-center items-center font-bold text-blue-600">Memuat Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 pb-12">
      
      {/* HEADER UTAMA */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center text-blue-700 font-bold text-lg">
          <span className="mr-2">🎓</span> EduPath Dashboard
        </div>
        <button onClick={onBack} className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition">
          Kembali
        </button>
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
                <h1 className="text-xl font-bold text-slate-900">{profileData?.full_name || 'Nama Tidak Tersedia'}</h1>
                <p className="text-sm text-slate-500 font-medium">{profileData?.email || 'Email Tidak Tersedia'}</p>
              </div>
            </div>

            {errorMsg && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4 border border-red-100">{errorMsg}</div>}
            {successMsg && <div className="bg-green-50 text-green-700 text-sm p-3 rounded-xl mb-4 border border-green-100">{successMsg}</div>}

            {!isEditing ? (
              <div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Asal Sekolah</p>
                  <p className="font-semibold text-slate-700 text-sm">{profileData?.school_name || '-'}</p>
                </div>
                
                <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                  {/* TOMBOL LOGOUT DIPERBARUI */}
                  <button onClick={handleLogoutClick} className="px-4 py-2 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition flex items-center">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Keluar
                  </button>
                  <button onClick={() => setIsEditing(true)} className="px-5 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-blue-50 hover:text-blue-600 transition">
                    Edit Profil
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                    <input type="text" name="full_name" required value={formData.full_name} onChange={handleEditChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Asal Sekolah</label>
                    <input type="text" name="school_name" required value={formData.school_name} onChange={handleEditChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-2">
                  <button type="button" onClick={() => setIsEditing(false)} disabled={isSaving} className="px-5 py-2 text-slate-500 text-xs font-bold rounded-lg hover:bg-slate-100 transition">Batal</button>
                  <button type="submit" disabled={isSaving} className={`px-5 py-2 text-white text-xs font-bold rounded-lg transition ${isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {isSaving ? 'Menyimpan...' : 'Simpan'}
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
              <span className="text-blue-500 mr-2">📂</span> Riwayat Asesmen
            </h2>
            <span className="text-xs font-bold text-slate-400 bg-slate-200 px-2.5 py-1 rounded-full">
              {historyList.length} Total
            </span>
          </div>

          {isLoadingHistory ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-sm text-slate-500 animate-pulse">
              Memuat riwayat...
            </div>
          ) : historyList.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-slate-200 border-dashed text-center">
              <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">📝</div>
              <h3 className="font-bold text-slate-700 mb-1">Belum Ada Riwayat</h3>
              <p className="text-xs text-slate-500">Kamu belum pernah menyelesaikan asesmen. Mulai asesmen pertamamu sekarang!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {historyList.map((item, index) => (
                <div 
                  key={index} 
                  onClick={() => handleViewDetail(item.assessment_id)}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                      Asesmen #{historyList.length - index}
                    </div>
                    {item.status === 'processed' ? (
                      <span className="text-green-500 bg-green-50 rounded-full p-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></span>
                    ) : (
                      <span className="text-amber-500 bg-amber-50 rounded-full p-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1">{formatDate(item.created_at)}</h3>
                  <p className="text-xs text-slate-400 font-medium group-hover:text-blue-500 transition flex items-center">
                    Klik untuk melihat detail nilai
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </p>
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
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                </span>
                Detail Nilai Asesmen
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Isi Modal */}
            <div className="p-6 overflow-y-auto">
              {isLoadingDetail ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-sm font-medium text-slate-500">Membuka detail nilai...</p>
                </div>
              ) : selectedDetail?.error ? (
                <div className="text-center py-10 text-red-500 text-sm font-bold bg-red-50 rounded-2xl">
                  Gagal memuat detail data asesmen ini.
                </div>
              ) : selectedDetail ? (
                <div className="space-y-6">
                  
                  {/* Tanggal & ID */}
                  <div className="flex flex-wrap justify-between items-center text-xs text-slate-500 pb-2 border-b border-slate-100">
                    <span>Dikirim pada: <strong className="text-slate-700">{formatDate(selectedDetail.created_at)}</strong></span>
                    <span className="font-mono bg-slate-100 px-2 py-1 rounded">ID: {selectedDetail.assessment_id?.substring(0,8)}...</span>
                  </div>

                  {/* Ringkasan Rata-rata */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
                      <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">Sains</p>
                      <p className="text-2xl font-black text-blue-700">{selectedDetail.science_avg}</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center">
                      <p className="text-[10px] font-bold text-amber-500 uppercase mb-1">Sosial</p>
                      <p className="text-2xl font-black text-amber-600">{selectedDetail.social_avg}</p>
                    </div>
                    <div className="bg-slate-800 rounded-2xl p-4 text-center shadow-md">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Overall</p>
                      <p className="text-2xl font-black text-white">{selectedDetail.overall_score}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nilai Mata Pelajaran */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center border-b border-slate-100 pb-2">📚 Mata Pelajaran</h4>
                      <ul className="space-y-2.5 text-xs">
                        <li className="flex justify-between"><span className="text-slate-500">Matematika</span><span className="font-bold text-slate-700">{selectedDetail.math_score}</span></li>
                        <li className="flex justify-between"><span className="text-slate-500">Fisika</span><span className="font-bold text-slate-700">{selectedDetail.physics_score}</span></li>
                        <li className="flex justify-between"><span className="text-slate-500">Kimia</span><span className="font-bold text-slate-700">{selectedDetail.chemistry_score}</span></li>
                        <li className="flex justify-between"><span className="text-slate-500">Biologi</span><span className="font-bold text-slate-700">{selectedDetail.biology_score}</span></li>
                        <li className="flex justify-between"><span className="text-slate-500">Sejarah</span><span className="font-bold text-slate-700">{selectedDetail.history_score}</span></li>
                        <li className="flex justify-between"><span className="text-slate-500">Geografi</span><span className="font-bold text-slate-700">{selectedDetail.geography_score}</span></li>
                        <li className="flex justify-between"><span className="text-slate-500">B. Inggris</span><span className="font-bold text-slate-700">{selectedDetail.english_score}</span></li>
                      </ul>
                    </div>

                    {/* Profil Perilaku */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center border-b border-slate-100 pb-2">🚀 Profil Perilaku</h4>
                      <ul className="space-y-3.5 text-xs">
                        <li className="flex justify-between items-center">
                          <span className="text-slate-500">Jam Belajar</span>
                          <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{selectedDetail.weekly_self_study_hours} Jam</span>
                        </li>
                        <li className="flex justify-between items-center">
                          <span className="text-slate-500">Ketidakhadiran</span>
                          <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{selectedDetail.absence_days} Hari</span>
                        </li>
                        <li className="flex justify-between items-center">
                          <span className="text-slate-500">Ekstrakurikuler</span>
                          {selectedDetail.extracurricular 
                            ? <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">Aktif</span>
                            : <span className="font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Tidak</span>
                          }
                        </li>
                        <li className="flex justify-between items-center">
                          <span className="text-slate-500">Part Time</span>
                          {selectedDetail.part_time_job 
                            ? <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">Ya</span>
                            : <span className="font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Tidak</span>
                          }
                        </li>
                      </ul>
                    </div>
                  </div>

                </div>
              ) : null}
            </div>
            
            {/* Footer Modal */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setShowModal(false)} className="px-5 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-900 transition">
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