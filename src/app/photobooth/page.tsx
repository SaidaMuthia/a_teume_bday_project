"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Download, Mail, ChevronLeft, X } from "lucide-react";

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

function PhotoOverlay({ selectedFrame }: { selectedFrame: typeof FRAMES[0] }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-20" id="photo-overlay">
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

      <div className="absolute inset-2 border-2 border-dashed opacity-50" style={{ borderColor: selectedFrame.color }} />
      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 m-3" style={{ borderColor: selectedFrame.color }} />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 m-3" style={{ borderColor: selectedFrame.color }} />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 m-3" style={{ borderColor: selectedFrame.color }} />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 m-3" style={{ borderColor: selectedFrame.color }} />

      <div className="absolute bottom-[2.5rem] right-3 flex justify-end drop-shadow-xl z-30">
        <img src="/allmembers.png" alt="Treasure Members" className="w-[45%] object-contain opacity-95" crossOrigin="anonymous" />
      </div>

      <div 
        className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-12"
        style={{ background: `linear-gradient(to top, rgba(${selectedFrame.rgb},0.95), transparent)` }}
      >
        <div className="flex items-center justify-center gap-2 mt-1">
          <p className="font-cute text-white text-[10px] font-bold tracking-[0.3em]">TREASURE • 트레저</p>
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

    // AMBIL LANGSUNG DARI ELEMENT VIDEO MENTAH! (Mencegah kompresi dari react-webcam)
    const video = webcamRef.current.video;
    if (!video || video.readyState !== 4) return;

    setIsCapturing(true);
    setFlash(true);
    setTimeout(() => setFlash(false), 300);

    try {
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

      // ========================================================
      // MATEMATIKA ANTI-GEPENG MENGGUNAKAN RAW VIDEO
      // ========================================================
      const videoW = video.videoWidth;
      const videoH = video.videoHeight;
      const imgRatio = videoW / videoH;
      const canvasRatio = outputW / outputH;
      let sX = 0, sY = 0, sW = videoW, sH = videoH;

      if (imgRatio > canvasRatio) {
        // Kamera terlalu lebar (contoh: 16:9), potong samping kiri & kanan
        sW = videoH * canvasRatio;
        sX = (videoW - sW) / 2;
      } else {
        // Kamera terlalu tinggi, potong atas & bawah
        sH = videoW / canvasRatio;
        sY = (videoH - sH) / 2;
      }

      ctx.save();
      // Gambar video mentah yang sudah dipotong. 
      // Video mentah SECARA ALAMI tidak termirror (seperti dilihat orang lain), 
      // jadi teks akan terbaca normal tanpa perlu rumus ctx.scale(-1, 1).
      ctx.drawImage(video, sX, sY, sW, sH, 0, 0, outputW, outputH);
      ctx.restore();
      // ========================================================

      // Top Gradient
      const topGrad = ctx.createLinearGradient(0, 0, 0, outputH * 0.15);
      topGrad.addColorStop(0, `rgba(${selectedFrame.rgb},0.85)`);
      topGrad.addColorStop(1, `rgba(${selectedFrame.rgb},0)`);
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, outputW, outputH * 0.15);

      // Top Text
      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.font = `bold ${16 * scaleX}px 'Nunito', sans-serif`;
      ctx.fillText("✦ TEUME PHOTOBOOTH ✦", outputW / 2, 30 * scaleY);
      ctx.font = `italic ${24 * scaleX}px 'Playfair Display', serif`;
      ctx.fillText("Happy Birthday, Anggie! 🤍", outputW / 2, 60 * scaleY);

      // Borders & Corners
      ctx.strokeStyle = selectedFrame.color;
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 10]);
      const margin = 10 * scaleX;
      ctx.strokeRect(margin, margin, outputW - (margin*2), outputH - (margin*2));
      ctx.setLineDash([]);
      const cornerLen = 30 * scaleX;
      ctx.lineWidth = 6;
      const m = margin + 4;
      ctx.beginPath(); ctx.moveTo(m, m + cornerLen); ctx.lineTo(m, m); ctx.lineTo(m + cornerLen, m); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(outputW - m - cornerLen, m); ctx.lineTo(outputW - m, m); ctx.lineTo(outputW - m, m + cornerLen); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(m, outputH - m - cornerLen); ctx.lineTo(m, outputH - m); ctx.lineTo(m + cornerLen, outputH - m); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(outputW - m - cornerLen, outputH - m); ctx.lineTo(outputW - m, outputH - m); ctx.lineTo(outputW - m, outputH - m - cornerLen); ctx.stroke();

      // DRAW ALL MEMBERS
      const allMemImg = new Image();
      allMemImg.crossOrigin = "anonymous";
      await new Promise<void>((res) => { allMemImg.onload = () => res(); allMemImg.onerror = () => res(); allMemImg.src = "/allmembers.png"; });
      
      if (allMemImg.width > 0) {
        const imgW = outputW * 0.45; 
        const imgH = imgW * (allMemImg.height / allMemImg.width);
        const imgX = outputW - imgW - (15 * scaleX); 
        const imgY = outputH - imgH - (40 * scaleY); 
        ctx.drawImage(allMemImg, imgX, imgY, imgW, imgH);
      }

      // Bottom Gradient
      const botGrad = ctx.createLinearGradient(0, outputH * 0.85, 0, outputH);
      botGrad.addColorStop(0, `rgba(${selectedFrame.rgb},0)`);
      botGrad.addColorStop(1, `rgba(${selectedFrame.rgb},0.95)`);
      ctx.fillStyle = botGrad;
      ctx.fillRect(0, outputH * 0.85, outputW, outputH * 0.15);

      // Bottom Text
      ctx.fillStyle = "white";
      ctx.font = `bold ${14 * scaleX}px 'Nunito', sans-serif`;
      ctx.fillText("TREASURE • 트레저", outputW / 2, outputH - 20 * scaleY);

      setCapturedImage(canvas.toDataURL("image/jpeg", 0.95));
    } catch (err) {
      console.error(err);
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing, selectedFrame]);

  const handleRetake = () => {
    setCapturedImage(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-[#fffbf5] to-blue-50 flex flex-col">
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="px-4 pt-4 pb-2 flex justify-between items-center">
        <button onClick={() => router.push("/")} className="flex items-center text-diamond-500 font-cute text-sm font-bold"><ChevronLeft size={18} />Back</button>
        <span className="font-cute text-diamond-500 font-bold text-sm tracking-widest">PHOTOBOOTH</span>
        <div className="w-16" />
      </motion.header>

      <div className="flex-1 flex flex-col items-center gap-5 px-4 pb-6 max-w-lg mx-auto w-full">
        
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

        <motion.div ref={containerRef} className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100" style={{ aspectRatio: "3/4" }}>
          <AnimatePresence>
            {flash && <motion.div className="absolute inset-0 bg-white z-50" initial={{ opacity: 1 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} />}
          </AnimatePresence>

          {!cameraError ? (
            <AnimatePresence mode="wait">
              {capturedImage ? (
                <motion.img 
                  key="preview"
                  src={capturedImage} 
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              ) : (
                <motion.div key="webcam" className="w-full h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Webcam 
                    ref={webcamRef} 
                    audio={false} 
                    videoConstraints={videoConstraints} 
                    onUserMediaError={() => setCameraError(true)} 
                    className="w-full h-full object-cover" 
                    mirrored={true} 
                  />
                  <PhotoOverlay selectedFrame={selectedFrame} />
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center">
              <Camera size={40} className="text-slate-300 mb-2" />
              <p className="text-slate-400 text-sm font-cute">Camera access needed</p>
            </div>
          )}
        </motion.div>

        <div className="w-full flex flex-col gap-3">
          <AnimatePresence mode="wait">
            {capturedImage ? (
              <motion.div key="preview-btns" className="flex gap-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <button onClick={handleRetake} className="flex-1 flex justify-center items-center gap-2 bg-slate-200 text-slate-700 font-cute font-bold py-4 rounded-2xl active:scale-95 transition-transform">
                  <X size={20} /> Retake
                </button>
                <button onClick={() => {
                  const link = document.createElement("a");
                  link.href = capturedImage;
                  link.download = `teume-bday-${Date.now()}.jpg`;
                  link.click();
                }} className="flex-1 flex justify-center items-center gap-2 bg-slate-800 text-white font-cute font-bold py-4 rounded-2xl shadow-md active:scale-95 transition-transform">
                  <Download size={20} /> Save Photo 💾
                </button>
              </motion.div>
            ) : (
              <motion.button key="snap-btn" onClick={handleCapture} disabled={isCapturing} className="w-full flex justify-center items-center gap-2 bg-slate-800 text-white font-cute font-bold py-4 rounded-2xl shadow-md active:scale-95 transition-transform" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Camera size={20} /> {isCapturing ? "Capturing..." : "Snap Photo"}
              </motion.button>
            )}
          </AnimatePresence>

          <button onClick={() => router.push("/letter")} className="w-full flex justify-center items-center gap-2 bg-white border-2 border-slate-100 text-slate-500 font-cute font-bold py-4 rounded-2xl active:scale-95 transition-transform text-sm">
            <Mail size={18} /> Read Your Letter 💌
          </button>
        </div>
      </div>
    </main>
  );
}