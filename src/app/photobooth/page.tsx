"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Download, Mail, ChevronLeft, X } from "lucide-react";
import type { FaceLandmarker } from "@mediapipe/tasks-vision";

const FRAMES = [
  { id: "diamond", name: "💎 Diamond Blue", color: "#38bdf8", rgb: "14,165,233" },
  { id: "blush",   name: "🌸 Blossom Pink", color: "#fb7185", rgb: "244,63,94"  },
  { id: "gold",    name: "✨ Golden Star",   color: "#fbbf24", rgb: "245,158,11" },
  { id: "holo",    name: "🌌 Holographic",   color: "#a78bfa", rgb: "139,92,246" },
];

type Frame = typeof FRAMES[0];
type Landmark = { x: number; y: number; z: number };

// MediaPipe FaceMesh key landmark indices
const LM = {
  FOREHEAD:   10,
  L_EYE_OUT:  33,
  R_EYE_OUT: 263,
  L_CHEEK:   234,
  R_CHEEK:   454,
  L_SIDE:    127,
  R_SIDE:    356,
};

function drawFaceFilter(
  ctx: CanvasRenderingContext2D,
  lms: Landmark[],
  frameId: string,
  w: number,
  h: number
) {
  const lx = (i: number) => (1 - lms[i].x) * w;
  const ly = (i: number) => lms[i].y * h;

  const faceW = Math.abs(lx(LM.L_SIDE) - lx(LM.R_SIDE));
  const eyeCX = (lx(LM.L_EYE_OUT) + lx(LM.R_EYE_OUT)) / 2;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const em = (emoji: string, ex: number, ey: number, size: number, color?: string) => {
    const prev = ctx.fillStyle;
    if (color) ctx.fillStyle = color;
    ctx.font = `${Math.max(size, 6)}px serif`;
    ctx.fillText(emoji, ex, ey);
    if (color) ctx.fillStyle = prev as string;
  };

  switch (frameId) {
    case "diamond":
      // Geser ke luar: R_CHEEK (sisi kiri display) dikurangi x, L_CHEEK (sisi kanan) ditambah x
      em("✨", lx(LM.R_CHEEK) - faceW * 0.08, ly(LM.R_CHEEK) + faceW * 0.18, faceW * 0.22, "#FFD700");
      em("✨", lx(LM.L_CHEEK) + faceW * 0.08, ly(LM.L_CHEEK) + faceW * 0.18, faceW * 0.22, "#FFD700");
      break;

    case "blush":
      em("🌸", lx(LM.R_CHEEK) - faceW * 0.08, ly(LM.R_CHEEK) + faceW * 0.18, faceW * 0.24);
      em("🌸", lx(LM.L_CHEEK) + faceW * 0.08, ly(LM.L_CHEEK) + faceW * 0.18, faceW * 0.24);
      break;

    case "gold":
      em("👑", eyeCX, ly(LM.FOREHEAD) - faceW * 0.50, faceW * 0.50);
      break;

    case "holo":
      // Topi ultah, posisi sama kayak mahkota
      em("🎩", eyeCX, ly(LM.FOREHEAD) - faceW * 0.50, faceW * 0.50);
      break;
  }

  ctx.textBaseline = "alphabetic";
}

function DiamondIcon({ size = 24, color = "rgba(255,255,255,0.9)", className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2L16 8H22L17 14L19 21L12 17.5L5 21L7 14L2 8H8L12 2Z" fill={color} stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" />
    </svg>
  );
}

function PhotoOverlay({ selectedFrame }: { selectedFrame: Frame }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* TOP GRADIENT */}
      <div
        className="absolute top-0 left-0 right-0 px-4 pt-3 pb-10"
        style={{ background: `linear-gradient(to bottom, rgba(${selectedFrame.rgb},0.93) 0%, rgba(${selectedFrame.rgb},0.55) 65%, transparent 100%)` }}
      >
        <div className="flex items-center justify-between mb-1">
          <DiamondIcon size={15} />
          <p className="font-cute text-white text-[10px] font-bold tracking-[0.25em] uppercase drop-shadow">✦ PHOTOBOOTH ✦</p>
          <DiamondIcon size={15} />
        </div>
        <div className="flex items-center gap-2 my-1 px-2">
          <div className="flex-1 h-px bg-white opacity-35" />
          <span className="text-white text-[7px] opacity-55">✦</span>
          <div className="flex-1 h-px bg-white opacity-35" />
        </div>
        <p className="font-display text-white text-center text-base font-semibold italic drop-shadow-md leading-tight">
          Happy Birthday, Anggie! 🤍
        </p>
      </div>

      {/* BORDERS */}
      <div className="absolute inset-[9px] border border-dashed opacity-45" style={{ borderColor: selectedFrame.color }} />
      <div className="absolute inset-[15px] border opacity-15" style={{ borderColor: selectedFrame.color }} />

      {/* CORNER BRACKETS */}
      <div className="absolute top-[9px] left-[9px] w-8 h-8 border-t-[2.5px] border-l-[2.5px]" style={{ borderColor: selectedFrame.color }}>
        <span className="absolute top-[3px] left-[3px] text-[6px] font-bold leading-none" style={{ color: selectedFrame.color }}>✦</span>
      </div>
      <div className="absolute top-[9px] right-[9px] w-8 h-8 border-t-[2.5px] border-r-[2.5px]" style={{ borderColor: selectedFrame.color }}>
        <span className="absolute top-[3px] right-[3px] text-[6px] font-bold leading-none" style={{ color: selectedFrame.color }}>✦</span>
      </div>
      <div className="absolute bottom-[9px] left-[9px] w-8 h-8 border-b-[2.5px] border-l-[2.5px]" style={{ borderColor: selectedFrame.color }}>
        <span className="absolute bottom-[3px] left-[3px] text-[6px] font-bold leading-none" style={{ color: selectedFrame.color }}>✦</span>
      </div>
      <div className="absolute bottom-[9px] right-[9px] w-8 h-8 border-b-[2.5px] border-r-[2.5px]" style={{ borderColor: selectedFrame.color }}>
        <span className="absolute bottom-[3px] right-[3px] text-[6px] font-bold leading-none" style={{ color: selectedFrame.color }}>✦</span>
      </div>

      {/* SIDE SPARKLES */}
      <span className="absolute left-[5px] top-1/2 -translate-y-1/2 text-[8px] leading-none" style={{ color: selectedFrame.color, opacity: 0.5 }}>✦</span>
      <span className="absolute right-[5px] top-1/2 -translate-y-1/2 text-[8px] leading-none" style={{ color: selectedFrame.color, opacity: 0.5 }}>✦</span>

      {/* MEMBERS IMAGE */}
      <div className="absolute bottom-[2.8rem] right-3 flex justify-end drop-shadow-xl z-30">
        <img src="/allmembers.png" alt="Treasure Members" className="w-[45%] object-contain opacity-95" crossOrigin="anonymous" />
      </div>

      {/* BOTTOM GRADIENT */}
      <div
        className="absolute bottom-0 left-0 right-0 px-4 pb-2.5 pt-12"
        style={{ background: `linear-gradient(to top, rgba(${selectedFrame.rgb},0.95) 0%, rgba(${selectedFrame.rgb},0.5) 60%, transparent 100%)` }}
      >
        <div className="flex items-center justify-center gap-1.5">
          <span className="text-white text-[7px] opacity-55">✦</span>
          <p className="font-cute text-white text-[9px] font-bold tracking-[0.35em]">TREASURE • 트레저</p>
          <span className="text-white text-[7px] opacity-55">✦</span>
        </div>
      </div>
    </div>
  );
}

export default function PhotoboothPage() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const lastLandmarksRef = useRef<Landmark[] | null>(null);
  const animFrameRef = useRef<number>(0);
  const selectedFrameRef = useRef(FRAMES[0]);

  const [selectedFrame, setSelectedFrame] = useState(FRAMES[0]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [flash, setFlash] = useState(false);
  const [filterReady, setFilterReady] = useState(false);

  const videoConstraints = { width: { ideal: 720 }, height: { ideal: 960 }, facingMode: "user" };

  // Keep selectedFrameRef in sync to avoid stale closure in rAF loop
  useEffect(() => { selectedFrameRef.current = selectedFrame; }, [selectedFrame]);

  // Init MediaPipe FaceLandmarker
  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
        );
        const fl = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numFaces: 1,
        });
        if (!cancelled) {
          faceLandmarkerRef.current = fl;
          setFilterReady(true);
        }
      } catch (e) {
        console.error("FaceLandmarker init failed:", e);
      }
    }
    init();
    return () => {
      cancelled = true;
      cancelAnimationFrame(animFrameRef.current);
      faceLandmarkerRef.current?.close();
    };
  }, []);

  // Real-time face detection loop
  useEffect(() => {
    if (!filterReady || capturedImage) {
      cancelAnimationFrame(animFrameRef.current);
      const canvas = overlayCanvasRef.current;
      if (canvas) canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let lastTs = -1;

    function loop() {
      animFrameRef.current = requestAnimationFrame(loop);
      const video = webcamRef.current?.video;
      const canvas = overlayCanvasRef.current;
      const container = containerRef.current;
      if (!video || !canvas || !container || video.readyState !== 4) return;

      const { width, height } = container.getBoundingClientRect();
      const rw = Math.round(width), rh = Math.round(height);
      if (canvas.width !== rw || canvas.height !== rh) {
        canvas.width = rw;
        canvas.height = rh;
      }

      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, rw, rh);

      const now = performance.now();
      if (now === lastTs) return;
      lastTs = now;

      const results = faceLandmarkerRef.current?.detectForVideo(video, now);
      if (results?.faceLandmarks?.[0]) {
        lastLandmarksRef.current = results.faceLandmarks[0] as Landmark[];
        drawFaceFilter(ctx, lastLandmarksRef.current, selectedFrameRef.current.id, rw, rh);
      } else {
        lastLandmarksRef.current = null;
      }
    }

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [filterReady, capturedImage]);

  const handleCapture = useCallback(async () => {
    if (!webcamRef.current || isCapturing) return;
    const video = webcamRef.current.video;
    if (!video || video.readyState !== 4) return;

    setIsCapturing(true);
    setFlash(true);
    setTimeout(() => setFlash(false), 300);

    try {
      const container = containerRef.current;
      if (!container) throw new Error("No container ref");
      const { width: cW, height: cH } = container.getBoundingClientRect();

      const outputW = 720, outputH = 960;
      const canvas = document.createElement("canvas");
      canvas.width = outputW;
      canvas.height = outputH;
      const ctx = canvas.getContext("2d")!;
      const scaleX = outputW / cW;
      const scaleY = outputH / cH;

      // Draw mirrored video
      const videoW = video.videoWidth, videoH = video.videoHeight;
      const imgRatio = videoW / videoH, canvasRatio = outputW / outputH;
      let sX = 0, sY = 0, sW = videoW, sH = videoH;
      if (imgRatio > canvasRatio) { sW = videoH * canvasRatio; sX = (videoW - sW) / 2; }
      else { sH = videoW / canvasRatio; sY = (videoH - sH) / 2; }

      ctx.save();
      ctx.translate(outputW, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, sX, sY, sW, sH, 0, 0, outputW, outputH);
      ctx.restore();

      // Draw face filter stickers on saved photo
      if (lastLandmarksRef.current) {
        drawFaceFilter(ctx, lastLandmarksRef.current, selectedFrame.id, outputW, outputH);
      }

      // Top gradient
      const topGrad = ctx.createLinearGradient(0, 0, 0, outputH * 0.19);
      topGrad.addColorStop(0, `rgba(${selectedFrame.rgb},0.93)`);
      topGrad.addColorStop(0.65, `rgba(${selectedFrame.rgb},0.55)`);
      topGrad.addColorStop(1, `rgba(${selectedFrame.rgb},0)`);
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, outputW, outputH * 0.19);

      // Header
      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.font = `bold ${14 * scaleX}px 'Nunito', sans-serif`;
      ctx.fillText("✦ PHOTOBOOTH ✦", outputW / 2, 32 * scaleY);

      // Divider
      const divY = 47 * scaleY, divMX = 85 * scaleX;
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 1; ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(divMX, divY); ctx.lineTo(outputW/2 - 12*scaleX, divY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(outputW/2 + 12*scaleX, divY); ctx.lineTo(outputW - divMX, divY); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.font = `${9 * scaleX}px 'Nunito', sans-serif`;
      ctx.fillText("✦", outputW / 2, divY + 4 * scaleY);

      // Birthday text
      ctx.fillStyle = "white";
      ctx.font = `italic ${22 * scaleX}px 'Playfair Display', serif`;
      ctx.fillText("Happy Birthday, Anggie! 🤍", outputW / 2, 70 * scaleY);

      // Borders
      ctx.strokeStyle = selectedFrame.color;
      ctx.lineWidth = 2; ctx.setLineDash([8, 8]);
      const margin = 9 * scaleX;
      ctx.strokeRect(margin, margin, outputW - margin*2, outputH - margin*2);

      ctx.globalAlpha = 0.18; ctx.lineWidth = 1; ctx.setLineDash([]);
      const innerM = 15 * scaleX;
      ctx.strokeRect(innerM, innerM, outputW - innerM*2, outputH - innerM*2);
      ctx.globalAlpha = 1;

      // Corner brackets
      const cLen = 28 * scaleX;
      ctx.lineWidth = 3.5; ctx.strokeStyle = selectedFrame.color;
      const m = margin + 2;
      ctx.beginPath(); ctx.moveTo(m, m+cLen); ctx.lineTo(m, m); ctx.lineTo(m+cLen, m); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(outputW-m-cLen, m); ctx.lineTo(outputW-m, m); ctx.lineTo(outputW-m, m+cLen); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(m, outputH-m-cLen); ctx.lineTo(m, outputH-m); ctx.lineTo(m+cLen, outputH-m); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(outputW-m-cLen, outputH-m); ctx.lineTo(outputW-m, outputH-m); ctx.lineTo(outputW-m, outputH-m-cLen); ctx.stroke();

      // ✦ in corners
      ctx.fillStyle = selectedFrame.color; ctx.globalAlpha = 0.85;
      ctx.font = `bold ${10 * scaleX}px 'Nunito', sans-serif`;
      ctx.textAlign = "left";  ctx.fillText("✦", m + 4*scaleX, m + 14*scaleY);
      ctx.textAlign = "right"; ctx.fillText("✦", outputW-m-4*scaleX, m + 14*scaleY);
      ctx.textAlign = "left";  ctx.fillText("✦", m + 4*scaleX, outputH-m-4*scaleY);
      ctx.textAlign = "right"; ctx.fillText("✦", outputW-m-4*scaleX, outputH-m-4*scaleY);
      ctx.globalAlpha = 1;

      // Side sparkles
      ctx.globalAlpha = 0.5; ctx.fillStyle = selectedFrame.color;
      ctx.font = `${10 * scaleX}px 'Nunito', sans-serif`; ctx.textAlign = "center";
      ctx.fillText("✦", 6*scaleX, outputH/2 + 4*scaleY);
      ctx.fillText("✦", outputW-6*scaleX, outputH/2 + 4*scaleY);
      ctx.globalAlpha = 1;

      // Members image
      const allMemImg = new Image();
      allMemImg.crossOrigin = "anonymous";
      await new Promise<void>((res) => { allMemImg.onload = () => res(); allMemImg.onerror = () => res(); allMemImg.src = "/allmembers.png"; });
      if (allMemImg.width > 0) {
        const imgW = outputW * 0.45;
        const imgH = imgW * (allMemImg.height / allMemImg.width);
        ctx.drawImage(allMemImg, outputW - imgW - 15*scaleX, outputH - imgH - 40*scaleY, imgW, imgH);
      }

      // Bottom gradient
      const botGrad = ctx.createLinearGradient(0, outputH*0.84, 0, outputH);
      botGrad.addColorStop(0, `rgba(${selectedFrame.rgb},0)`);
      botGrad.addColorStop(0.4, `rgba(${selectedFrame.rgb},0.5)`);
      botGrad.addColorStop(1, `rgba(${selectedFrame.rgb},0.95)`);
      ctx.fillStyle = botGrad;
      ctx.fillRect(0, outputH*0.84, outputW, outputH*0.16);

      // Bottom text
      ctx.textAlign = "center"; ctx.fillStyle = "white";
      ctx.font = `bold ${13 * scaleX}px 'Nunito', sans-serif`;
      ctx.fillText("TREASURE • 트레저", outputW/2, outputH - 18*scaleY);
      ctx.globalAlpha = 0.55; ctx.font = `${8 * scaleX}px 'Nunito', sans-serif`;
      ctx.fillText("✦", outputW/2 - 68*scaleX, outputH - 18*scaleY);
      ctx.fillText("✦", outputW/2 + 68*scaleX, outputH - 18*scaleY);
      ctx.globalAlpha = 1;

      setCapturedImage(canvas.toDataURL("image/jpeg", 0.95));
    } catch (err) {
      console.error(err);
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing, selectedFrame]);

  const handleRetake = () => setCapturedImage(null);

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
                <motion.img key="preview" src={capturedImage} className="w-full h-full object-cover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
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
                  {/* Face-tracked sticker canvas */}
                  <canvas
                    ref={overlayCanvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ zIndex: 15 }}
                  />
                  <PhotoOverlay selectedFrame={selectedFrame} />
                  {!filterReady && (
                    <div className="absolute bottom-20 inset-x-0 flex justify-center z-40">
                      <span className="bg-black/40 text-white text-[10px] font-cute px-3 py-1 rounded-full tracking-wider animate-pulse">
                        loading filter...
                      </span>
                    </div>
                  )}
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
                  link.download = `photobooth-bday-${Date.now()}.jpg`;
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