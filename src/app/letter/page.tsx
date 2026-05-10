"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, Heart, Star, Sparkles } from "lucide-react";

// Animated paragraph block
function LetterParagraph({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.p
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className="font-body text-slate-700 text-base leading-8 tracking-wide"
    >
      {children}
    </motion.p>
  );
}

// Digital cake SVG
function DigitalCake() {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Plate */}
      <ellipse cx="80" cy="130" rx="56" ry="10" fill="rgba(186,230,253,0.4)" />

      {/* Bottom tier */}
      <rect x="28" y="95" width="104" height="38" rx="8" fill="url(#tier1)" />
      <rect x="28" y="95" width="104" height="14" rx="6" fill="url(#tier1top)" />
      {/* Frosting drips */}
      {[40, 58, 74, 90, 108].map((x, i) => (
        <ellipse key={i} cx={x} cy={97} rx={5} ry={8} fill="rgba(255,255,255,0.85)" />
      ))}

      {/* Middle tier */}
      <rect x="42" y="62" width="76" height="36" rx="8" fill="url(#tier2)" />
      <rect x="42" y="62" width="76" height="12" rx="6" fill="url(#tier2top)" />
      {/* Frosting drips */}
      {[54, 70, 86, 100].map((x, i) => (
        <ellipse key={i} cx={x} cy={64} rx={4} ry={7} fill="rgba(255,255,255,0.8)" />
      ))}

      {/* Top tier */}
      <rect x="56" y="36" width="48" height="28" rx="8" fill="url(#tier3)" />
      <rect x="56" y="36" width="48" height="10" rx="5" fill="url(#tier3top)" />
      {/* Frosting drips */}
      {[66, 80, 93].map((x, i) => (
        <ellipse key={i} cx={x} cy={37} rx={3.5} ry={6} fill="rgba(255,255,255,0.85)" />
      ))}

      {/* Candles */}
      {[68, 80, 92].map((x, i) => (
        <g key={i}>
          <rect x={x - 3} y={16} width={6} height={20} rx={3} fill={["#fda4af", "#7dd3fc", "#fcd34d"][i]} />
          {/* Flame */}
          <motion.ellipse
            cx={x}
            cy={13}
            rx={3}
            ry={4.5}
            fill={["#fb7185", "#38bdf8", "#f59e0b"][i]}
            animate={{ scaleY: [1, 1.3, 0.9, 1.2, 1], scaleX: [1, 0.8, 1.1, 0.9, 1] }}
            transition={{
              duration: 1.2 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
          {/* Glow */}
          <motion.ellipse
            cx={x}
            cy={13}
            rx={6}
            ry={6}
            fill="rgba(245,158,11,0.2)"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
          />
        </g>
      ))}

      {/* Diamond gems on cake */}
      <polygon points="50,110 54,103 58,110 54,117" fill="rgba(125,211,252,0.9)" />
      <polygon points="80,108 85,100 90,108 85,116" fill="rgba(186,230,253,0.9)" />
      <polygon points="110,110 114,103 118,110 114,117" fill="rgba(125,211,252,0.9)" />
      <polygon points="62,78 66,72 70,78 66,84" fill="rgba(253,164,175,0.9)" />
      <polygon points="95,77 99,71 103,77 99,83" fill="rgba(253,164,175,0.9)" />

      {/* Stars */}
      <motion.text
        x="20"
        y="50"
        fontSize="12"
        animate={{ opacity: [0.4, 1, 0.4], rotate: [0, 20, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ✦
      </motion.text>
      <motion.text
        x="130"
        y="55"
        fontSize="10"
        animate={{ opacity: [0.4, 1, 0.4], rotate: [0, -20, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        ✦
      </motion.text>
      <motion.text
        x="22"
        y="85"
        fontSize="8"
        animate={{ opacity: [0.3, 0.9, 0.3] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        ◆
      </motion.text>
      <motion.text
        x="132"
        y="90"
        fontSize="8"
        animate={{ opacity: [0.3, 0.9, 0.3] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      >
        ◆
      </motion.text>

      <defs>
        <linearGradient id="tier1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#7dd3fc" />
        </linearGradient>
        <linearGradient id="tier1top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>
        <linearGradient id="tier2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="100%" stopColor="#fb7185" />
        </linearGradient>
        <linearGradient id="tier2top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fecdd3" />
          <stop offset="100%" stopColor="#fda4af" />
        </linearGradient>
        <linearGradient id="tier3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>
        <linearGradient id="tier3top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0f9ff" />
          <stop offset="100%" stopColor="#e0f2fe" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Floating particle
function FloatingParticle({
  style,
  delay,
  content,
}: {
  style: React.CSSProperties;
  delay: number;
  content: string;
}) {
  return (
    <motion.div
      className="absolute text-sm pointer-events-none select-none"
      style={style}
      animate={{ y: [0, -16, 0], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 3 + delay, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      {content}
    </motion.div>
  );
}

export default function LetterPage() {
  const router = useRouter();

  const particles = [
    { style: { top: "8%", left: "4%" }, delay: 0, content: "💎" },
    { style: { top: "12%", right: "6%" }, delay: 0.5, content: "✦" },
    { style: { top: "30%", left: "2%" }, delay: 1, content: "◆" },
    { style: { top: "45%", right: "3%" }, delay: 0.7, content: "💙" },
    { style: { bottom: "30%", left: "4%" }, delay: 1.5, content: "✦" },
    { style: { bottom: "20%", right: "5%" }, delay: 0.3, content: "💎" },
    { style: { bottom: "10%", left: "10%" }, delay: 1.2, content: "◆" },
  ];

  return (
    <main className="min-h-screen relative bg-gradient-to-br from-sky-50 via-[#fffbf5] to-blush-50 overflow-x-hidden pb-16">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-diamond-100/40 blur-3xl -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-48 h-48 rounded-full bg-blush-100/40 blur-3xl translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-diamond-100/30 blur-3xl translate-y-1/3 pointer-events-none" />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <FloatingParticle key={i} style={p.style} delay={p.delay} content={p.content} />
      ))}

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 px-4 pt-4 pb-2 flex items-center"
      >
        <button
          onClick={() => router.push("/photobooth")}
          className="flex items-center gap-1 text-diamond-400 font-cute text-sm font-semibold hover:text-diamond-600 transition-colors"
        >
          <ChevronLeft size={18} />
          Photobooth
        </button>
      </motion.header>

      <div className="relative z-10 max-w-lg mx-auto px-5 flex flex-col items-center gap-8 pt-4">
        {/* Cake illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-40 h-40"
        >
          <DigitalCake />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-center space-y-2"
        >
          <p className="font-cute text-diamond-400 text-xs tracking-[0.3em] uppercase font-semibold">
            ✦ a letter for ✦
          </p>
          <h1 className="font-display text-4xl font-bold shimmer-text">Anggie</h1>
          <p className="font-cute text-blush-400 text-sm">
            Happy Birthday! 🎂
          </p>
        </motion.div>

        {/* Diamond divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center gap-2 w-full"
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-diamond-200" />
          <span className="text-diamond-400 text-lg">◆</span>
          <span className="text-diamond-300 text-sm">◆</span>
          <span className="text-diamond-400 text-lg">◆</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-diamond-200" />
        </motion.div>

{/* Letter container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="letter-paper w-full rounded-2xl p-7 border border-diamond-100 space-y-5 relative overflow-hidden"
        >
          {/* Paper texture accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-diamond-300 via-blush-300 to-diamond-300 rounded-t-2xl" />

          {/* Salutation */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="font-display text-2xl text-diamond-600 font-semibold italic"
          >
            Dear Anggie,
          </motion.p>

          <LetterParagraph delay={0.1}>
            Barakallah fii umrik, Anggie! Nda terasa sudah lewatmi lagi setahun. I know we’re both living very different lives now, chasing our own dreams on our own paths. But, I just want to take a moment to say how grateful I am to have you in my life.✨
          </LetterParagraph>

          <LetterParagraph delay={0.15}>
            Jujur, memang kita jarang sekali ketemu, mungkin cuma sekali atau dua kali setahun. Chatan pun bukan yang sering sekali. Tapi syukurnya sesibuk apa pun masih selaluji sempat buat catch up heheh.
          </LetterParagraph>

          <LetterParagraph delay={0.2}>
            Walaupun hidup kita sudah beda-beda arahnya, I'm just happy to at least know that you're doing well. I know life gets tough sometimes, tapi berharapka kau tetap ingat kalau kalau kau sehebat dan sekuat itu. You shine in your own way, and I hope this year you see yourself the way I see you—radiant, worthy, and extraordinary.
          </LetterParagraph>

          <LetterParagraph delay={0.25}>
            Semoga tahun ini makin bahagia, makin banyak senyumnya, makin kuat hadapin apa pun, dan dilancarin semua urusan serta impianmu. Aamiin. You deserve every bit of happiness. I'm always here to support you.💙
          </LetterParagraph>

          <LetterParagraph delay={0.3}>
            Anyway, let's make this year even better than the last one. Enjoy your day!🎉
          </LetterParagraph>

          {/* Closing */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="pt-2 space-y-1"
          >
            <p className="font-display text-slate-600 italic text-base">
              With lots of love,
            </p>
            <p className="font-display text-diamond-500 text-xl font-semibold italic">
              — Muthia
            </p>
          </motion.div>

          {/* Decorative corners */}
          <div className="absolute bottom-4 right-4 flex gap-1 opacity-30">
            <span className="text-diamond-400 text-xs">◆</span>
            <span className="text-blush-400 text-xs">◆</span>
            <span className="text-diamond-400 text-xs">◆</span>
          </div>
        </motion.div>

        {/* Outro flourish */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-3 text-center"
        >
          <div className="flex gap-2 items-center">
            {["💙", "◆", "✦", "◆", "💙"].map((icon, i) => (
              <motion.span
                key={i}
                className="text-lg"
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              >
                {icon}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Back to start button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onClick={() => router.push("/")}
          className="mb-4 flex items-center gap-2 text-diamond-400 font-cute text-sm font-semibold hover:text-diamond-600 transition-colors border border-diamond-200 rounded-full px-5 py-2.5 bg-white/60 backdrop-blur-sm hover:bg-white/90"
        >
          <span>↩</span> Back to beginning
        </motion.button>
      </div>
    </main>
  );
}
