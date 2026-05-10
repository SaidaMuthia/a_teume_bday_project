"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Floating diamond sparkle component
function FloatingDiamond({
  style,
  delay,
  size = 16,
}: {
  style: React.CSSProperties;
  delay: number;
  size?: number;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={style}
      animate={{
        y: [0, -20, 0],
        opacity: [0.4, 1, 0.4],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 3 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2L15.5 8.5H22L17 13.5L18.5 21L12 17L5.5 21L7 13.5L2 8.5H8.5L12 2Z"
          fill="rgba(125, 211, 252, 0.8)"
          stroke="rgba(56, 189, 248, 0.6)"
          strokeWidth="0.5"
        />
      </svg>
    </motion.div>
  );
}

// Treasure Box SVG
function TreasureBox({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Box bottom */}
      <motion.rect
        x="20"
        y="90"
        width="160"
        height="80"
        rx="8"
        fill="url(#boxGrad)"
        stroke="rgba(56,189,248,0.8)"
        strokeWidth="2"
        animate={{ y: isOpen ? 10 : 0 }}
        transition={{ duration: 0.5 }}
      />
      {/* Box shine */}
      <rect x="30" y="100" width="40" height="8" rx="4" fill="rgba(255,255,255,0.3)" />

      {/* Lid */}
      <motion.g
        animate={isOpen ? { rotateX: -120, y: -60 } : { rotateX: 0, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ originX: "50%", originY: "90px" }}
      >
        <rect
          x="15"
          y="60"
          width="170"
          height="40"
          rx="8"
          fill="url(#lidGrad)"
          stroke="rgba(56,189,248,0.8)"
          strokeWidth="2"
        />
        {/* Lid shine */}
        <rect x="25" y="68" width="50" height="7" rx="3.5" fill="rgba(255,255,255,0.35)" />
        {/* Bow */}
        <ellipse cx="100" cy="60" rx="22" ry="12" fill="url(#bowGrad)" />
        <ellipse cx="100" cy="60" rx="14" ry="7" fill="url(#bowInner)" />
        <circle cx="100" cy="60" r="6" fill="url(#knobGrad)" />
      </motion.g>

      {/* Gems on box */}
      <motion.g animate={{ opacity: isOpen ? 0 : 1 }} transition={{ duration: 0.3 }}>
        <polygon points="60,130 65,120 70,130 65,140" fill="rgba(125,211,252,0.9)" />
        <polygon points="100,125 106,113 112,125 106,137" fill="rgba(186,230,253,0.9)" />
        <polygon points="140,130 145,120 150,130 145,140" fill="rgba(125,211,252,0.9)" />
      </motion.g>

      {/* Stars bursting when open */}
      <AnimatePresence>
        {isOpen && (
          <>
            {[
              { cx: 100, cy: 40, r: 5, delay: 0 },
              { cx: 60, cy: 30, r: 4, delay: 0.1 },
              { cx: 140, cy: 25, r: 6, delay: 0.15 },
              { cx: 40, cy: 55, r: 3, delay: 0.2 },
              { cx: 160, cy: 50, r: 4, delay: 0.05 },
            ].map((star, i) => (
              <motion.circle
                key={i}
                cx={star.cx}
                cy={star.cy}
                r={star.r}
                fill="rgba(245,158,11,0.9)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, delay: star.delay }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      <defs>
        <linearGradient id="boxGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="lidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="bowGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="100%" stopColor="#fb7185" />
        </linearGradient>
        <linearGradient id="bowInner" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fecdd3" />
          <stop offset="100%" stopColor="#fda4af" />
        </linearGradient>
        <radialGradient id="knobGrad">
          <stop offset="0%" stopColor="#fff1f2" />
          <stop offset="100%" stopColor="#fb7185" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const floatingDiamonds = [
    { style: { top: "8%", left: "5%" }, delay: 0, size: 20 },
    { style: { top: "15%", right: "8%" }, delay: 0.5, size: 14 },
    { style: { top: "40%", left: "3%" }, delay: 1, size: 18 },
    { style: { top: "60%", right: "5%" }, delay: 0.7, size: 22 },
    { style: { bottom: "20%", left: "8%" }, delay: 1.5, size: 12 },
    { style: { bottom: "10%", right: "10%" }, delay: 0.3, size: 16 },
    { style: { top: "25%", left: "50%" }, delay: 2, size: 10 },
    { style: { bottom: "35%", left: "15%" }, delay: 1.2, size: 14 },
  ];

  const handleBoxClick = async () => {
    if (isOpen) return;
    setIsOpen(true);
    setShowParticles(true);

    // Play global audio
    const audio = document.getElementById("global-bg-music") as HTMLAudioElement;
    if (audio) {
      audio.volume = 0.6;
      audio.play().catch(() => console.log("Audio play blocked by browser"));
    }
    
    if (audioRef.current) {
      audioRef.current.volume = 0.6;
      audioRef.current.play().catch(() => {});
    }

    // Launch canvas-confetti
    const confetti = (await import("canvas-confetti")).default;
    const colors = ["#7dd3fc", "#38bdf8", "#fda4af", "#fb7185", "#f59e0b", "#ffffff", "#bae6fd"];

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.55 },
      colors,
      shapes: ["circle", "square"],
      scalar: 1.2,
    });

    setTimeout(() => {
      confetti({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0, y: 0.6 }, colors });
      confetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1, y: 0.6 }, colors });
    }, 300);

    // Navigate after animation
    setTimeout(() => {
      router.push("/photobooth");
    }, 2800);
  };

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden starfield">
      {/* Gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-[#fffbf5] to-blue-50" />
      <div className="absolute inset-0 bg-gradient-to-t from-diamond-100/40 via-transparent to-blush-50/20" />

      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-diamond-200/20 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-blush-200/20 blur-3xl translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-diamond-100/30 blur-2xl -translate-x-1/2 -translate-y-1/2" />

      {/* Floating diamonds */}
      {floatingDiamonds.map((d, i) => (
        <FloatingDiamond key={i} style={d.style} delay={d.delay} size={d.size} />
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-1"
        >
          <p className="font-cute text-diamond-400 text-sm tracking-[0.25em] uppercase font-semibold">
            ✦ A special treasure for ✦
          </p>
          <h1 className="font-display text-5xl font-bold shimmer-text leading-tight">
            Anggie
          </h1>
        </motion.div>

        {/* Treasure Box */}
        <motion.button
          onClick={handleBoxClick}
          className="relative w-52 h-48 cursor-pointer focus:outline-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          whileHover={!isOpen ? { scale: 1.05 } : {}}
          whileTap={!isOpen ? { scale: 0.97 } : {}}
        >
          <div className="treasure-glow w-full h-full">
            <TreasureBox isOpen={isOpen} />
          </div>

          {/* Pulse ring */}
          {!isOpen && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-diamond-300/50"
              animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </motion.button>

        {/* CTA text */}
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.p
              key="cta"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="font-cute text-diamond-600 text-lg font-semibold max-w-xs leading-relaxed"
            >
              Tap to open your birthday treasure, Anggie! 💎
            </motion.p>
          ) : (
            <motion.p
              key="opening"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="font-cute text-blush-400 text-xl font-bold"
            >
              🎉 Your treasure awaits...
            </motion.p>
          )}
        </AnimatePresence>

        {/* Decorative diamonds row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex items-center gap-3"
        >
          {["opacity-40", "opacity-60", "opacity-100", "opacity-60", "opacity-40"].map(
            (op, i) => (
              <motion.span
                key={i}
                className={`text-diamond-400 text-lg ${op}`}
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              >
                ◆
              </motion.span>
            )
          )}
        </motion.div>
      </div>

      {/* Hidden audio */}
      <audio ref={audioRef} loop preload="none">
        <source src="/mytreasure.mp3" type="audio/mpeg" />
      </audio>
    </main>
  );
}