"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Download, Mail, ChevronLeft, Sparkles } from "lucide-react";

// Thematic frames instead of members
const FRAMES = [
  { id: "diamond", name: "💎 Diamond Blue", color: "#38bdf8", rgb: "14,165,233" },
  { id: "blush", name: "🌸 Blossom Pink", color: "#fb7185", rgb: "244,63,94" },
  { id: "gold", name: "✨ Golden Star", color: "#fbbf24", rgb: "245,158,11" },
  { id: "holo", name: "🌌 Holographic", color: "#a78bfa", rgb: "139,92,246" },
];

function DiamondIcon({ size = 24, color = "rgba(255,255,255,0.9)", className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2L16 8H22L17 14L19 21L12 17.5L5 21L7 14L2 8H8L12 2Z" fill={color} stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" />
    </svg>
  );
}

// Overlay with Dynamic Theme
function PhotoOverlay({ selectedFrame }: { selectedFrame: typeof FRAMES[0] }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-20" id="photo-overlay">
      {/* Top banner gradient */}
      <div 
        className="absolute top-0 left-0 right-0 px-3 pt-3 pb-8"
        style={{ background: `linear-gradient(to bottom, rgba(${selectedFrame.rgb},0.85), transparent)` }}
      >
        <div className="flex items-center justify-between mb-1">
          <DiamondIcon size={18} />
          <p className="font-cute text-white text-[11px] font-bold tracking-[0.2em] uppercase">
            ✦ TEUME PHOTOBOOTH ✦
          </p>
          <DiamondIcon size={18} />
        </div>
        <p className="font-display text-white text-center text-lg font-semibold italic drop-shadow-md">
          Happy Birthday, Anggie! 🤍
        </p>
      </div>

      {/* Decorative Corners */}
      <div className="absolute inset-2 border-2 border-dashed opacity-50" style={{ borderColor: selectedFrame.color }} />
      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 m-3" style={{ borderColor: selectedFrame.color }} />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 m-3" style={{ borderColor: selectedFrame.color }} />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 m-3" style={{ borderColor: selectedFrame.color }} />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 m-3" style={{ borderColor: selectedFrame.color }} />

      {/* All Members Photo */}
      <div className="absolute bottom-[4.5rem] left-0 right-0 flex justify-center drop-shadow-xl">
        <img src="/allmembers.png" alt="Treasure Members" className="w-[85%] object-contain" crossOrigin="anonymous" />
      </div>

      {/* Bottom banner gradient */}
      <div 
        className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-8"
        style={{ background: `linear-gradient(to top, rgba(${selectedFrame.rgb},0.9), transparent)` }}
      >
        <div className="flex items-center justify-center gap-2 mt-4">
          <p className="font-cute text-white text-xs font-bold tracking-[0.3em]">TREASURE • 트레저</p>
        </div>
      </div>
    </div>
  );
}

export default function PhotoboothPage() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedFrame, setSelectedFrame] = useState(FRAMES[0]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [flash, setFlash] = useState(false);

  const videoConstraints = { width: { ideal: 720 }, height: { ideal: 960 }, facingMode: "user" };

  const handleCapture = useCallback(async () => {
    if (!webcamRef.current || isCapturing) return;
    setIsCapturing(true);
    setFlash(true);
    setTimeout(() => setFlash(false), 300);

    try {
      const webcamScreenshot = webcamRef.current.getScreenshot({ width: 720, height: 960 });
      if (!webcamScreenshot) throw new Error("Could not capture webcam frame");

      const container = containerRef.current;
      if (!container) throw new Error("No container ref");
      const { width: cW, height: cH } = container.getBoundingClientRect();

      const outputW = 720;
      const outputH = 960;
      const canvas = document.createElement("canvas");
      canvas.width = outputW;
      canvas.height = outputH;
      const ctx = canvas.getContext("2d")!;
      const scaleX = outputW / cW;
      const scaleY = outputH / cH;

      // 1. Draw Webcam
      const webcamImg = new Image();
      await new Promise<void>((res) => { webcamImg.onload = () => res(); webcamImg.src = webcamScreenshot; });
      ctx.save();
      ctx.translate(outputW, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(webcamImg, 0, 0, outputW, outputH);
      ctx.restore();

      // 2. Draw Top Gradient
      const topGrad = ctx.createLinearGradient(0, 0, 0, outputH * 0.15);
      topGrad.addColorStop(0, `rgba(${selectedFrame.rgb},0.85)`);
      topGrad.addColorStop(1, `rgba(${selectedFrame.rgb},0)`);
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, outputW, outputH * 0.15);

      // 3. Draw Top Text
      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.font = `bold ${16 * scaleX}px 'Nunito', sans-serif`;
      ctx.fillText("✦ TEUME PHOTOBOOTH ✦", outputW / 2, 30 * scaleY);
      ctx.font = `italic ${24 * scaleX}px 'Playfair Display', serif`;
      ctx.fillText("Happy Birthday, Anggie! 🤍", outputW / 2, 60 * scaleY);

      // 4. Draw Inner Dashed Border
      ctx.strokeStyle = selectedFrame.color;
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 10]);
      const margin = 10 * scaleX;
      ctx.strokeRect(margin, margin, outputW - (margin*2), outputH - (margin*2));
      ctx.setLineDash([]); // reset

      // 5. Draw Solid Corners
      const cornerLen = 30 * scaleX;
      ctx.lineWidth = 6;
      const m = margin + 4;
      // TL
      ctx.beginPath(); ctx.moveTo(m, m + cornerLen); ctx.lineTo(m, m); ctx.lineTo(m + cornerLen, m); ctx.stroke();
      // TR
      ctx.beginPath(); ctx.moveTo(outputW - m - cornerLen, m); ctx.lineTo(outputW - m, m); ctx.lineTo(outputW - m, m + cornerLen); ctx.stroke();
      // BL
      ctx.beginPath(); ctx.moveTo(m, outputH - m - cornerLen); ctx.lineTo(m, outputH - m); ctx.lineTo(m + cornerLen, outputH - m); ctx.stroke();
      // BR
      ctx.beginPath(); ctx.moveTo(outputW - m - cornerLen, outputH - m); ctx.lineTo(outputW - m, outputH - m); ctx.lineTo(outputW - m, outputH - m - cornerLen); ctx.stroke();

      // 6. Draw All Members Photo
      const allMemImg = new Image();
      allMemImg.crossOrigin = "anonymous";
      await new Promise<void>((res) => { allMemImg.onload = () => res(); allMemImg.onerror = () => res(); allMemImg.src = "/allmembers.png"; });
      
      if (allMemImg.width > 0) {
        const imgW = outputW * 0.85;
        const imgH = imgW * (allMemImg.height / allMemImg.width);
        const imgX = (outputW - imgW) / 2;
        const imgY = outputH - imgH - (70 * scaleY); // Just above bottom text
        ctx.drawImage(allMemImg, imgX, imgY, imgW, imgH);
      }

      // 7. Draw Bottom Gradient
      const botGrad = ctx.createLinearGradient(0, outputH * 0.85, 0, outputH);
      botGrad.addColorStop(0, `rgba(${selectedFrame.rgb},0)`);
      botGrad.addColorStop(1, `rgba(${selectedFrame.rgb},0.9)`);
      ctx.fillStyle = botGrad;
      ctx.fillRect(0, outputH * 0.85, outputW, outputH * 0.15);

      // 8. Draw Bottom Text
      ctx.fillStyle = "white";
      ctx.font = `bold ${18 * scaleX}px 'Nunito', sans-serif`;
      ctx.fillText("TREASURE • 트레저", outputW / 2, outputH - 25 * scaleY);

      setCapturedImage(canvas.toDataURL("image/jpeg", 0.95));
    } catch (err) {
      console.error(err);
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing, selectedFrame]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-[#fffbf5] to-blue-50 flex flex-col">
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="px-4 pt-4 pb-2 flex justify-between items-center">
        <button onClick={() => router.push("/")} className="flex items-center text-diamond-500 font-cute text-sm font-bold"><ChevronLeft size={18} />Back</button>
        <span className="font-cute text-diamond-500 font-bold text-sm tracking-widest">PHOTOBOOTH</span>
        <div className="w-16" />
      </motion.header>

      <div className="flex-1 flex flex-col items-center gap-5 px-4 pb-6 max-w-lg mx-auto w-full">
        
        {/* Frame Theme Selector */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
          <p className="font-cute text-slate-500 text-xs font-bold tracking-widest text-center mb-2 uppercase">Pick a Frame Theme</p>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 px-1">
            {FRAMES.map((frame) => (
              <button
                key={frame.id}
                onClick={() => setSelectedFrame(frame)}
                className="flex-shrink-0 px-4 py-2 rounded-xl font-cute text-sm font-bold transition-all border-2"
                style={{
                  backgroundColor: selectedFrame.id === frame.id ? frame.color : "transparent",
                  borderColor: frame.color,
                  color: selectedFrame.id === frame.id ? "#fff" : frame.color,
                  boxShadow: selectedFrame.id === frame.id ? `0 4px 14px rgba(${frame.rgb}, 0.4)` : "none",
                }}
              >
                {frame.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Camera Container */}
        <motion.div ref={containerRef} className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200" style={{ aspectRatio: "3/4" }}>
          <AnimatePresence>
            {flash && <motion.div className="absolute inset-0 bg-white z-30" initial={{ opacity: 1 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} />}
          </AnimatePresence>

          {!cameraError ? (
            <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" videoConstraints={videoConstraints} onUserMediaError={() => setCameraError(true)} className="w-full h-full object-cover" mirrored={true} />
          ) : (
            <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center">
              <Camera size={40} className="text-slate-300 mb-2" />
              <p className="text-slate-400 text-sm font-cute">Camera access needed</p>
            </div>
          )}
          <PhotoOverlay selectedFrame={selectedFrame} />
        </motion.div>

        {/* Result & Actions */}
        <div className="w-full flex flex-col gap-3">
          <button onClick={handleCapture} disabled={isCapturing} className="w-full flex justify-center items-center gap-2 bg-slate-800 text-white font-cute font-bold py-4 rounded-2xl shadow-md active:scale-95 transition-transform">
            <Camera size={20} /> {isCapturing ? "Say Cheese!..." : "Snap Photo"}
          </button>

          <AnimatePresence>
            {capturedImage && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex flex-col gap-3">
                <button onClick={() => {
                  const link = document.createElement("a");
                  link.href = capturedImage;
                  link.download = `teume-bday-${Date.now()}.jpg`;
                  link.click();
                }} className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-diamond-400 to-diamond-500 text-white font-cute font-bold py-4 rounded-2xl shadow-md active:scale-95 transition-transform">
                  <Download size={20} /> Download Photo 💾
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button onClick={() => router.push("/letter")} className="w-full flex justify-center items-center gap-2 bg-white border-2 border-slate-200 text-slate-700 font-cute font-bold py-4 rounded-2xl shadow-sm active:scale-95 transition-transform">
            <Mail size={20} /> Read Your Letter 💌
          </button>
        </div>
      </div>
    </main>
  );
}