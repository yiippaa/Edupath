import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LandingPageIlustration from "../assets/ilustration1.png";

function LandingPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [initials, setInitials] = useState("");

  // Footer Interactive State
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert("Harap isi semua kolom.");
      return;
    }
    setContactSubmitted(true);
    setTimeout(() => {
      setIsContactOpen(false);
      setContactSubmitted(false);
      setContactForm({ name: "", email: "", message: "" });
      alert("Pesan Anda berhasil dikirim! Terima kasih.");
    }, 1500);
  };

  // status login setiap kali Landing Page dibuka
  useEffect(() => {
    const token = localStorage.getItem("user_token");
    const fullName = localStorage.getItem("user_name");

    if (token) {
      setIsLoggedIn(true);

      if (fullName) {
        // Mengambil nama depan
        const nameParts = fullName.trim().split(" ");
        setFirstName(
          nameParts.length > 1
            ? `${nameParts[0]} ${nameParts[1]}`
            : nameParts[0],
        );

        // Membuat inisial
        const ini =
          nameParts.length > 1
            ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
            : nameParts[0][0].toUpperCase();
        setInitials(ini);
      } else {
        setFirstName("Siswa");
        setInitials("S");
      }
    }
  }, []);

  const scrollToY = (to, duration = 600) => {
    const start = window.scrollY || window.pageYOffset;
    const change = to - start;
    const increment = 20;
    let currentTime = 0;

    const easeInOutQuad = (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };

    const animateScroll = () => {
      currentTime += increment;
      const val = easeInOutQuad(currentTime, start, change, duration);
      window.scrollTo(0, val);
      if (currentTime < duration) {
        requestAnimationFrame(animateScroll);
      }
    };
    animateScroll();
  };

  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    if (targetId === "top") {
      scrollToY(0, 600);
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition +
          (window.scrollY || window.pageYOffset) -
          headerOffset;
        scrollToY(offsetPosition, 600);
      }
    }
  };

  return (
    <div className="bg-surface-background text-on-surface antialiased pt-[80px] min-h-screen flex flex-col font-sans">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md transition-all duration-300 ease-in-out border-b border-slate-100">
        <div className="flex justify-between items-center px-gutter py-4 max-w-container-max mx-auto">
          <div className="flex justify-between gap-10">
            <div className="font-h2 text-h2 text-primary tracking-tight font-bold">
              EduPath
            </div>
            <nav className="hidden md:flex items-center space-x-8 font-body-md text-body-md">
              <a
                className="text-text-secondary dark:text-on-surface-variant hover:text-primary transition-colors"
                href="#"
                onClick={(e) => handleScrollTo(e, "top")}
              >
                About
              </a>
              <a
                className="text-text-secondary dark:text-on-surface-variant hover:text-primary transition-colors"
                href="#features"
                onClick={(e) => handleScrollTo(e, "features")}
              >
                How it Works
              </a>
              <a
                className="text-text-secondary dark:text-on-surface-variant hover:text-primary transition-colors"
                href="#footer"
                onClick={(e) => handleScrollTo(e, "footer")}
              >
                Contact
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop-only Profile/Login buttons */}
            <div className="hidden md:flex items-center">
              {isLoggedIn ? (
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-3 hover:bg-slate-200 p-1.5 lg:pl-4 rounded-full transition group"
                >
                  <span className="font-bold text-slate-700 hidden md:block">
                    {firstName}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-md group-hover:shadow-lg transition">
                    {initials}
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 hover:bg-slate-200 p-2 rounded-full transition text-slate-600 font-medium"
                  title="Log In"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-slate-400">
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      ></path>
                    </svg>
                  </div>
                </button>
              )}
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-full transition cursor-pointer"
              title="Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-[72px] left-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 py-6 px-6 z-40 shadow-lg animate-fadeIn flex flex-col space-y-4 font-body-md font-semibold">
          <a
            onClick={(e) => {
              handleScrollTo(e, "top");
              setIsMenuOpen(false);
            }}
            className="text-slate-600 hover:text-primary transition-colors py-2 border-b border-slate-100"
            href="#"
          >
            About
          </a>
          <a
            onClick={(e) => {
              handleScrollTo(e, "features");
              setIsMenuOpen(false);
            }}
            className="text-slate-600 hover:text-primary transition-colors py-2 border-b border-slate-100"
            href="#features"
          >
            How it Works
          </a>
          <a
            onClick={(e) => {
              handleScrollTo(e, "footer");
              setIsMenuOpen(false);
            }}
            className="text-slate-600 hover:text-primary transition-colors py-2 border-b border-slate-100"
            href="#footer"
          >
            Contact
          </a>

          {/* Mobile Profile / Auth Buttons Section */}
          {isLoggedIn ? (
            <div className="pt-2">
              <button
                onClick={() => {
                  navigate("/profile");
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 py-2 px-3 hover:bg-slate-100 rounded-xl transition text-left cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                  {initials}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 leading-none mb-1">
                    {firstName}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Lihat Profil
                  </span>
                </div>
                <svg
                  className="w-5 h-5 text-slate-400 ml-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>
            </div>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  navigate("/login");
                  setIsMenuOpen(false);
                }}
                className="w-full text-center bg-primary hover:bg-primary-container text-on-primary font-bold py-3 rounded-xl transition cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  navigate("/register");
                  setIsMenuOpen(false);
                }}
                className="w-full text-center bg-surface-white text-primary border-2 border-primary font-bold py-3 rounded-xl transition hover:bg-slate-50 cursor-pointer"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-container-max mx-auto px-gutter py-12 lg:py-24 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <h1 className="font-display text-[40px] lg:text-[48px] font-extrabold text-text-primary leading-[1.2] tracking-tight">
              Temukan Jalur Karier dan Jurusan yang Paling Sesuai Untukmu
            </h1>
            <p className="font-body-lg text-lg text-text-secondary max-w-xl">
              Gunakan kekuatan pemetaan AI untuk menganalisis minat, bakat, dan
              nilai akademis Anda. Kami membantu mengurangi kebingungan dalam
              memilih masa depan dengan memberikan rekomendasi berbasis data
              yang tenang dan dapat diandalkan.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              {isLoggedIn ? (
                <button
                  onClick={() => navigate("/onboarding")}
                  className="bg-primary hover:bg-primary-container text-on-primary font-bold py-4 px-10 rounded-full shadow-lg transition-all flex items-center gap-2 group cursor-pointer"
                >
                  Mulai Asesmen Sekarang
                  <span
                    className="material-symbols-outlined transition-transform group-hover:translate-x-1"
                    style={{
                      fontVariationSettings:
                        "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                    }}
                  >
                    arrow_forward
                  </span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-primary hover:bg-primary-container text-on-primary font-bold py-4 px-10 rounded-full shadow-lg transition-all cursor-pointer"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="bg-surface-white text-primary border-2 border-primary font-bold py-4 px-10 rounded-full shadow-sm hover:bg-surface-container-low transition-all cursor-pointer"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 w-full flex justify-center items-center relative md:h-[500px]">
            <img
              src={LandingPageIlustration}
              alt="Ilustrasi siswa belajar dengan EduPath AI"
              className="w-full h-auto rounded-3xl object-cover drop-shadow-2xl"
              loading="lazy"
            />
          </div>
        </section>

        {/* Features Z-Pattern Section */}
        <section
          id="features"
          className="bg-surface-container-low py-12 lg:py-24 scroll-mt-20"
        >
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="font-h1 text-[32px] font-bold text-text-primary mb-4">
                Kenapa Memilih EduPath?
              </h2>
              <p className="font-body-md text-text-secondary">
                Pendekatan komprehensif untuk masa depan yang lebih jelas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: Berbasis AI */}
              <div className="bg-white p-8 rounded-2xl shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/50 border border-slate-100 transition-all duration-300 hover:-translate-y-1 flex flex-col items-start space-y-6">
                <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center text-on-primary-container">
                  <span
                    className="material-symbols-outlined text-3xl"
                    style={{
                      fontVariationSettings:
                        "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                    }}
                  >
                    smart_toy
                  </span>
                </div>
                <div className="space-y-3">
                  <h3 className="font-h2 text-xl font-bold text-text-primary">
                    Berbasis AI
                  </h3>
                  <p className="font-body-md text-text-secondary leading-relaxed">
                    Algoritma cerdas kami memproses data kompleks Anda untuk
                    memberikan prediksi dan rekomendasi yang sangat akurat.
                    Pendekatan ini memastikan setiap rekomendasi didasarkan pada
                    analisis pola yang mendalam.
                  </p>
                </div>
              </div>

              {/* Card 2: Holistic Assessment */}
              <div className="bg-white p-8 rounded-2xl shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/50 border border-slate-100 transition-all duration-300 hover:-translate-y-1 flex flex-col items-start space-y-6">
                <div className="w-16 h-16 bg-secondary-container rounded-2xl flex items-center justify-center text-on-secondary-container">
                  <span
                    className="material-symbols-outlined text-3xl"
                    style={{
                      fontVariationSettings:
                        "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                    }}
                  >
                    psychology
                  </span>
                </div>
                <div className="space-y-3">
                  <h3 className="font-h2 text-xl font-bold text-text-primary">
                    Penilaian Holistik
                  </h3>
                  <p className="font-body-md text-text-secondary leading-relaxed">
                    Evaluasi menyeluruh yang mencakup nilai rapor, tes
                    kepribadian, dan minat karir untuk gambaran lengkap potensi
                    Anda. Kami tidak hanya melihat angka, tetapi memahami siapa
                    Anda sebenarnya.
                  </p>
                </div>
              </div>

              {/* Card 3: Visualisasi Interaktif */}
              <div className="bg-white p-8 rounded-2xl shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/50 border border-slate-100 transition-all duration-300 hover:-translate-y-1 flex flex-col items-start space-y-6">
                <div className="w-16 h-16 bg-purple-700 rounded-2xl flex items-center justify-center text-on-tertiary">
                  <span
                    className="material-symbols-outlined text-3xl"
                    style={{
                      fontVariationSettings:
                        "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                    }}
                  >
                    insert_chart
                  </span>
                </div>
                <div className="space-y-3">
                  <h3 className="font-h2 text-xl font-bold text-text-primary">
                    Visualisasi Interaktif
                  </h3>
                  <p className="font-body-md text-text-secondary leading-relaxed">
                    Lihat hasil Anda melalui grafik radar dan chart yang bersih
                    dan mudah dipahami, mengubah prediksi abstrak menjadi
                    wawasan konkret. Pahami kekuatan Anda dalam hitungan detik.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Mission Section */}
        <section
          id="mission"
          className="relative py-16 lg:py-32 bg-primary overflow-hidden scroll-mt-20"
        >
          <div className="absolute inset-0 z-0">
            <img
              alt="Students collaborating"
              className="w-full h-full object-cover opacity-20 mix-blend-multiply"
              src={LandingPageIlustration}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-primary/70"></div>
          </div>
          <div className="relative z-10 max-w-container-max mx-auto px-gutter text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="font-label-md text-md font-bold uppercase tracking-[0.2em] text-primary-fixed">
                Misi Kami
              </div>
              <h2 className="font-display text-4xl lg:text-6xl font-bold text-on-primary leading-[1.1] tracking-tight">
                Mengakhiri Era <br />
                <span className="text-secondary-fixed">"Salah Jurusan"</span>
              </h2>
              <div className="space-y-6 text-on-primary/90 font-body-lg leading-[1.8] max-w-3xl mx-auto mt-8">
                <p>
                  Menurut data riset pendidikan nasional, hampir{" "}
                  <span className="text-surface-white font-bold">
                    70% mahasiswa
                  </span>{" "}
                  merasa salah memilih jurusan di tahun pertama mereka. Hal ini
                  berdampak pada motivasi belajar dan potensi karier di masa
                  depan.
                </p>
                <p>
                  EduPath lahir dari keresahan tersebut. Dengan memadukan model{" "}
                  <strong className="text-surface-white font-bold">
                    Deep Learning
                  </strong>{" "}
                  dan metrik psikometrik teruji, kami membangun sistem yang
                  bertindak sebagai penasihat akademik pribadi Anda—objektif,
                  presisi, dan bebas dari bias emosional.
                </p>
              </div>
              <div className="pt-8">
                <span className="inline-flex items-center gap-2 text-primary-fixed font-bold text-body-lg cursor-default"></span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        id="footer"
        className="w-full bg-slate-900 text-slate-400 border-t border-slate-800/80 transition-opacity duration-200 mt-auto scroll-mt-20 relative overflow-hidden"
      >
        {/* Decorative Glow Orb */}
        <div className="absolute top-0 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-container-max mx-auto px-gutter py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
            <div className="space-y-6 md:col-span-6 lg:col-span-6">
              <div
                className="font-h2 text-h2 text-white tracking-tight font-bold hover:text-blue-400 transition-colors duration-300 cursor-pointer"
                onClick={(e) => handleScrollTo(e, "top")}
              >
                EduPath
              </div>
              <p className="font-body-md text-slate-400 text-sm leading-relaxed max-w-md">
                Platform penasihat akademik berbasis AI yang mendampingi Anda
                memahami potensi dan pilihan akademik dengan dukungan data.
              </p>
              {/* Social Media Icons */}
              <div className="flex gap-3 pt-2">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-blue-600 hover:text-white flex items-center justify-center text-slate-400 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
                  aria-label="GitHub"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-blue-600 hover:text-white flex items-center justify-center text-slate-400 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-blue-600 hover:text-white flex items-center justify-center text-slate-400 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
                  aria-label="Twitter"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-blue-600 hover:text-white flex items-center justify-center text-slate-400 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div className="md:col-span-3 lg:col-span-3">
              <h4 className="font-label-md text-white mb-6 uppercase tracking-wider font-bold">
                Eksplorasi
              </h4>
              <ul className="space-y-4 font-body-md text-slate-400">
                <li>
                  <a
                    href="#"
                    onClick={(e) => handleScrollTo(e, "top")}
                    className="hover:text-blue-400 hover:translate-x-1 transition-all duration-300 inline-block cursor-pointer"
                  >
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    onClick={(e) => handleScrollTo(e, "features")}
                    className="hover:text-blue-400 hover:translate-x-1 transition-all duration-300 inline-block cursor-pointer"
                  >
                    Fitur Utama
                  </a>
                </li>
                <li>
                  <a
                    href="#mission"
                    onClick={(e) => handleScrollTo(e, "mission")}
                    className="hover:text-blue-400 hover:translate-x-1 transition-all duration-300 inline-block cursor-pointer"
                  >
                    Misi Kami
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-3 lg:col-span-3">
              <h4 className="font-label-md text-white mb-6 uppercase tracking-wider font-bold">
                Bantuan
              </h4>
              <ul className="space-y-4 font-body-md text-slate-400">
                <li>
                  <button
                    onClick={() => setIsFAQOpen(true)}
                    className="hover:text-blue-400 hover:translate-x-1 transition-all duration-300 inline-block cursor-pointer text-left focus:outline-none"
                  >
                    FAQ
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsContactOpen(true)}
                    className="hover:text-blue-400 hover:translate-x-1 transition-all duration-300 inline-block cursor-pointer text-left focus:outline-none"
                  >
                    Hubungi Dukungan
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-caption text-slate-500">
            <p>© 2026 EduPath. Professional Academic Advisory Platform.</p>
            <div className="flex items-center gap-6">
              <p className="flex items-center gap-1.5">
                <span
                  className="material-symbols-outlined text-[14px]"
                  style={{
                    fontVariationSettings:
                      "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                  }}
                >
                  public
                </span>{" "}
                Global Edition
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* FAQ Modal */}
      {isFAQOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
              <h3 className="font-h2 text-xl font-bold text-slate-800">
                Tanya Jawab (FAQ)
              </h3>
              <button
                onClick={() => setIsFAQOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4 overflow-y-auto pr-1 flex-1">
              {[
                {
                  q: "Bagaimana cara kerja analisis AI EduPath?",
                  a: "EduPath menggabungkan nilai akademis Anda dengan metrik psikometri minat-bakat melalui model AI Deep Learning kami untuk menghasilkan kecocokan karir dan jurusan terbaik.",
                },
                {
                  q: "Apakah data pribadi saya aman?",
                  a: "Sangat aman. Seluruh data nilai rapor dan hasil evaluasi Anda dienkripsi penuh di server kami dan tidak akan dibagikan kepada pihak manapun tanpa izin Anda.",
                },
                {
                  q: "Apakah rekomendasi karir ini mutlak?",
                  a: "Rekomendasi ini dibuat secara ilmiah berdasarkan data akademis dan minat sebagai referensi utama Anda. Keputusan akhir tetap berada pada Anda, orang tua, dan pembimbing.",
                },
              ].map((item, idx) => (
                <div key={idx} className="border-b border-slate-100 pb-4">
                  <h4 className="font-semibold text-slate-800 mb-2 text-sm flex items-start gap-2">
                    <span className="bg-blue-50 text-blue-600 rounded px-1.5 py-0.5 text-xs font-bold mt-0.5">
                      Q
                    </span>
                    {item.q}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed pl-7">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsFAQOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-2.5 rounded-full text-xs transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Support Modal */}
      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
              <h3 className="font-h2 text-xl font-bold text-slate-800">
                Hubungi Dukungan
              </h3>
              <button
                onClick={() => setIsContactOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {contactSubmitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
                  <span className="material-symbols-outlined text-4xl">
                    check_circle
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 text-lg">
                  Pesan Dikirim!
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                  Terima kasih telah menghubungi kami. Tim dukungan EduPath akan
                  merespons pesan Anda dalam waktu 1-2 hari kerja.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    placeholder="Masukkan nama Anda"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    placeholder="nama@email.com"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Pesan Anda
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        message: e.target.value,
                      })
                    }
                    placeholder="Tuliskan kendala atau pertanyaan Anda di sini..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                  ></textarea>
                </div>
                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setIsContactOpen(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-full text-xs transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-full text-xs transition cursor-pointer"
                  >
                    Kirim Pesan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
