"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, ChevronRight, ChevronLeft, Clock } from "lucide-react";

// ==========================================
// 1. CONFIGURATION (DATA PERTANYAAN DISINI)
// ==========================================
const QUIZ_DATA = [
  {
    id: 1,
    question: "Apa singkatan dari HTML?",
    options: [
      { label: "A", text: "Hyper Text Markup Language" },
      { label: "B", text: "Hyperlinks and Text Marking Language" },
      { label: "C", text: "Home Tool Markup Language" },
      { label: "D", text: "Hyper Tool Markup Level" },
    ],
    correctAnswer: "A", // Opsional, utk validasi jika perlu nnti
  },
  {
    id: 2,
    question: "Siapa penemu lampu pijar?",
    options: [
      { label: "A", text: "Nikola Tesla" },
      { label: "B", text: "Thomas Alva Edison" },
      { label: "C", text: "Alexander Graham Bell" },
      { label: "D", text: "Isaac Newton" },
    ],
  },
  {
    id: 3,
    question: "Pertanyaan 1 follower 1mm di server tpi ko ni web aja yang teraneh?",
    options: [
      { label: "A", text: "Jawaban Aneh Satu" },
      { label: "B", text: "Jawaban Aneh Dua" },
      { label: "C", text: "Jawaban Paling Masuk Akal" },
      { label: "D", text: "Semua Benar" },
    ],
  },
  {
    id: 4,
    question: "Ibukota Indonesia yang baru bernama?",
    options: [
      { label: "A", text: "Jakarta" },
      { label: "B", text: "Nusantara" },
      { label: "C", text: "Penajam" },
      { label: "D", text: "Balikpapan" },
    ],
  },
  {
    id: 5,
    question: "Berapa hasil dari 1 + 1 x 0?",
    options: [
      { label: "A", text: "0" },
      { label: "B", text: "1" },
      { label: "C", text: "2" },
      { label: "D", text: "Tak Terhingga" },
    ],
  },
];

const TIMER_START = 180; // 3 Menit dalam detik

// ==========================================
// 2. COMPONENTS
// ==========================================

export default function QuizApp() {
  const [gameState, setGameState] = useState<"start" | "playing" | "finished">("start");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_START);
  const [isPaused, setIsPaused] = useState(false);
  const [showPopup, setShowPopup] = useState<"timeout" | null>(null);

  // Audio refs (opsional jika mau tambah sfx)
  // const audioRef = useRef(null);

  // --- LOGIC: TIMER ---
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (gameState === "playing" && !isPaused && timeLeft > 0 && !showPopup) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showPopup) {
      handleTimeOut();
    }

    return () => clearInterval(interval);
  }, [gameState, isPaused, timeLeft, showPopup]);

  // --- LOGIC: KEYBOARD SHORTCUTS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;

      if (e.key === "ArrowRight") nextQuestion();
      if (e.key === "ArrowLeft") prevQuestion();
      if (e.key === " ") setIsPaused((prev) => !prev); // Space to pause
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, currentIdx]);

  // --- HANDLERS ---
  const handleStart = () => {
    setGameState("playing");
    setTimeLeft(TIMER_START);
    setCurrentIdx(0);
  };

  const handleTimeOut = () => {
    setShowPopup("timeout");
    setTimeout(() => {
      setShowPopup(null);
      nextQuestion();
    }, 3000); // Tampil popup selama 3 detik lalu auto skip
  };

  const nextQuestion = () => {
    if (currentIdx < QUIZ_DATA.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setTimeLeft(TIMER_START); // Reset timer tiap pertanyaan (opsional, hapus baris ini jika timer global)
    } else {
      setGameState("finished");
    }
  };

  const prevQuestion = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      setTimeLeft(TIMER_START);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // --- RENDER HELPERS ---
  const currentQuestion = QUIZ_DATA[currentIdx];

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gray-900 text-white font-sans selection:bg-orange-500 selection:text-white">
      {/* BACKGROUND ANIMATED GRADIENT */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-orange-900 animate-gradient-slow opacity-80" />
      <div className="absolute inset-0 -z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>

      {/* --- START SCREEN --- */}
      <AnimatePresence mode="wait">
        {gameState === "start" && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-screen space-y-8 p-4 text-center"
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-pink-600 drop-shadow-sm"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              QUICK QUIZ
            </motion.h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl">
              Siapkan diri kalian! Gunakan tombol panah untuk navigasi manual jika diperlukan.
            </p>
            <button
              onClick={handleStart}
              className="group relative px-12 py-4 bg-orange-500 hover:bg-orange-600 rounded-full text-2xl font-bold transition-all shadow-[0_0_20px_rgba(249,115,22,0.5)] hover:shadow-[0_0_40px_rgba(249,115,22,0.8)]"
            >
              <span className="flex items-center gap-2">
                MULAI <Play fill="currentColor" />
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- PLAYING SCREEN --- */}
      <AnimatePresence mode="wait">
        {gameState === "playing" && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen p-6 md:p-12 relative"
          >
            {/* Header: Group Name & Timer */}
            <header className="flex justify-between items-start mb-10 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl text-orange-400 font-bold tracking-widest uppercase">KELOMPOK 1</h2>
                <p className="text-gray-400 text-sm">Presentasi Ekonomi</p>
              </div>
              
              <div className={`flex items-center gap-3 text-6xl md:text-8xl font-mono font-bold tracking-tighter ${timeLeft < 10 ? "text-red-500 animate-pulse" : "text-white"}`}>
                <Clock className="w-10 h-10 md:w-16 md:h-16 text-gray-400" />
                {formatTime(timeLeft)}
              </div>
            </header>

            {/* Question Area */}
            <div className="flex-1 flex flex-col justify-center w-full max-w-7xl mx-auto">
              <motion.div
                key={currentQuestion.id} // Re-animate on new question
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="mb-12"
              >
                 <span className="inline-block px-4 py-1 bg-white/10 rounded-full text-sm mb-4 border border-white/20">
                    Pertanyaan {currentIdx + 1} / {QUIZ_DATA.length}
                 </span>
                <h3 className="text-3xl md:text-5xl font-bold leading-tight drop-shadow-lg">
                  {currentQuestion.question}
                </h3>
              </motion.div>

              {/* Options Grid (Table-like but Buttons) */}
              <div className="grid grid-cols-1 gap-6">
                {currentQuestion.options.map((opt, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative group"
                  >
                    {/* The Option Card */}
                    <div className="flex items-center w-full p-1 rounded-2xl bg-gradient-to-r from-orange-500/20 to-pink-500/20 hover:from-orange-500 hover:to-pink-500 transition-all duration-300 border border-white/10 hover:border-transparent cursor-pointer">
                      <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-black/40 rounded-xl m-2 text-2xl md:text-3xl font-bold text-orange-400 group-hover:bg-white group-hover:text-orange-600 transition-colors">
                        {opt.label}
                      </div>
                      <div className="flex-1 px-6 py-4">
                        <span className="text-xl md:text-3xl font-medium text-gray-100 group-hover:text-white">
                          {opt.text}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer Controls */}
            <footer className="mt-8 flex justify-between items-center text-gray-400 text-sm md:text-base">
               <div className="flex gap-4">
                  <button onClick={() => setIsPaused(!isPaused)} className="hover:text-white flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg">
                    {isPaused ? <Play size={20} /> : <Pause size={20} />} {isPaused ? "Resume" : "Pause Timer"}
                  </button>
               </div>
               <div className="flex gap-4">
                  <button onClick={prevQuestion} className="hover:text-white flex items-center gap-1"><ChevronLeft /> Prev (Left)</button>
                  <button onClick={nextQuestion} className="hover:text-white flex items-center gap-1">Next (Right) <ChevronRight /></button>
               </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- POPUP: WAKTU HABIS --- */}
      <AnimatePresence>
        {showPopup === "timeout" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <div className="bg-red-600 p-10 rounded-3xl shadow-[0_0_100px_rgba(220,38,38,0.6)] text-center border-4 border-red-400">
              <h2 className="text-6xl font-black text-white mb-2 uppercase tracking-tighter">WAKTU HABIS!</h2>
              <p className="text-xl text-red-100">Lanjut ke pertanyaan berikutnya...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FINISHED SCREEN --- */}
      <AnimatePresence>
        {gameState === "finished" && (
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="flex flex-col items-center justify-center min-h-screen text-center p-8 space-y-6"
          >
             <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
               Selesai 5/5
             </h2>
             <div className="bg-white/10 p-8 rounded-2xl border border-white/20 backdrop-blur-md max-w-3xl">
               <p className="text-2xl md:text-4xl leading-relaxed">
                 "Dahh selesai yaa pertanyaannya. <br/>
                 <span className="font-bold text-orange-400">Tugasnya tolong dikumpul ke Abel.</span>"
               </p>
             </div>
             <button 
                onClick={() => window.location.reload()}
                className="mt-10 text-gray-500 hover:text-white underline"
             >
                Ulangi dari awal
             </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes gradient-slow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-slow {
          background-size: 400% 400%;
          animation: gradient-slow 15s ease infinite;
        }
      `}</style>
    </main>
  );
}
