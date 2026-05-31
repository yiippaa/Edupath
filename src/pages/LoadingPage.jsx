import React, { useEffect, useState } from 'react';

function LoadingPage() {
  const [text, setText] = useState('Menghubungkan pola...');

  // Efek teks berubah-ubah
  useEffect(() => {
    const messages = [
      'Menghubungkan pola...',
      'Mengkalkulasi skor kognitif...',
      'Mencocokkan profil karir...',
      'Menyusun rekomendasi akademik...'
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setText(messages[i]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#ffffff] flex items-center justify-center relative overflow-hidden" 
         style={{ 
           backgroundSize: '24px 24px' 
         }}>
      
      {/* Kartu Loading */}
      <div className="bg-white w-[90%] max-w-lg rounded-2xl shadow-xl p-12 flex flex-col items-center animate-fadeIn">
        
        {/* Icon Header */}
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-8">
           <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-200">
             <svg className="w-6 h-6 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
             </svg>
           </div>
        </div>

        {/* Text Area */}
        <h2 className="text-xl font-bold text-blue-700 mb-2 tracking-tight">Menganalisis Data</h2>
        <p className="text-slate-400 text-sm font-medium mb-8 h-4">{text}</p>

        {/* Loading Bar Animasi */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full bg-blue-600 rounded-full animate-loadingBar"></div>
        </div>
      </div>

      
    </div>
  );
}

export default LoadingPage;