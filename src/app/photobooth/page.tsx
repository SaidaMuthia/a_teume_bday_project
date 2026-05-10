"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Download, Mail, ChevronLeft, Sparkles } from "lucide-react";

// Treasure members data
const MEMBERS = [
  { name: "Choi Hyunsuk", key: "hyunsuk", color: "#7dd3fc" },
  { name: "Jihoon", key: "jihoon", color: "#fda4af" },
  { name: "Yoshi", key: "yoshi", color: "#86efac" },
  { name: "Junkyu", key: "junkyu", color: "#c4b5fd" },
  { name: "Mashiho", key: "mashiho", color: "#fcd34d" },
  { name: "Jaehyuk", key: "jaehyuk", color: "#f9a8d4" },
  { name: "Asahi", key: "asahi", color: "#67e8f9" },
  { name: "Yedam", key: "yedam", color: "#a5b4fc" },
  { name: "Doyoung", key: "doyoung", color: "#6ee7b7" },
  { name: "Haruto", key: "haruto", color: "#fca5a5" },
  { name: "Jeongwoo", key: "jeongwoo", color: "#93c5fd" },
  { name: "Junghwan", key: "junghwan", color: "#fdba74" },
];

// Diamond SVG for overlay
function DiamondIcon({ size = 24, color = "rgba(125,211,252,0.9)", className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M12 2L16 8H22L17 14L19 21L12 17.5L5 21L7 14L2 8H8L12 2Z"
        fill={color}
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="0.5"
      />
    </svg>
  );
}

// Sparkle SVG
function SparkleIcon({ size = 16, color = "rgba(245,158,11,0.9)", className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// The overlay that appears on top of the webcam
// Also used as reference for canvas drawing
function PhotoOverlay({
  selectedMember,
  overlayRef,
}: {
  selectedMember: (typeof MEMBERS)[0] | null;
  overlayRef?: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 pointer-events-none"
      id="photo-overlay"
    >
      {/* Top banner */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[rgba(14,165,233,0.85)] to-transparent px-3 pt-3 pb-6">
        <div className="flex items-center justify-between mb-1">
          <DiamondIcon size={18} color="rgba(255,255,255,0.9)" />
          <p className="font-cute text-white text-xs font-bold tracking-widest uppercase">
            ✦ TEUME PHOTOBOOTH ✦
          </p>
          <DiamondIcon size={18} color="rgba(255,255,255,0.9)" />
        </div>
        <p className="font-display text-white text-center text-base font-semibold italic">
          Happy Birthday, Anggie! 💙
        </p>
      </div>

      {/* Corner frames */}
      {/* TL */}
      <div className="absolute top-0 left-0 w-12 h-12">
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-diamond-300" />
        <DiamondIcon
          size={10}
          color="rgba(125,211,252,0.9)"
          className="absolute top-1 left-1"
        />
      </div>
      {/* TR */}
      <div className="absolute top-0 right-0 w-12 h-12">
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-diamond-300" />
        <DiamondIcon
          size={10}
          color="rgba(125,211,252,0.9)"
          className="absolute top-1 right-1"
        />
      </div>
      {/* BL */}
      <div className="absolute bottom-0 left-0 w-12 h-12">
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-diamond-300" />
        <DiamondIcon
          size={10}
          color="rgba(125,211,252,0.9)"
          className="absolute bottom-1 left-1"
        />
      </div>
      {/* BR */}
      <div className="absolute bottom-0 right-0 w-12 h-12">
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-diamond-300" />
        <DiamondIcon
          size={10}
          color="rgba(125,211,252,0.9)"
          className="absolute bottom-1 right-1"
        />
      </div>

      {/* Floating diamonds */}
      <DiamondIcon
        size={14}
        color="rgba(125,211,252,0.7)"
        className="absolute top-14 left-3"
      />
      <DiamondIcon
        size={10}
        color="rgba(186,230,253,0.7)"
        className="absolute top-20 right-3"
      />
      <SparkleIcon
        size={14}
        color="rgba(245,158,11,0.8)"
        className="absolute top-16 right-6"
      />
      <SparkleIcon
        size={10}
        color="rgba(245,158,11,0.8)"
        className="absolute top-14 left-8"
      />

      {/* Member image — bottom right */}
      {selectedMember && (
        <div
          className="absolute bottom-20 right-2 w-24 h-24 rounded-full overflow-hidden"
          style={{
            border: `2px solid ${selectedMember.color}`,
            boxShadow: `0 0 12px ${selectedMember.color}`,
            background: `radial-gradient(circle, ${selectedMember.color}22, transparent)`,
          }}
        >
          <img
            src={`/members/${selectedMember.key}.png`}
            alt={selectedMember.name}
            className="w-full h-full object-cover object-top"
            crossOrigin="anonymous"
            onError={(e) => {
              // Fallback placeholder
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          {/* Name tag */}
          <div
            className="absolute bottom-0 left-0 right-0 text-center py-0.5"
            style={{ background: `${selectedMember.color}cc` }}
          >
            <span className="font-cute text-white text-[9px] font-bold">
              {selectedMember.key.toUpperCase()}
            </span>
          </div>
        </div>
      )}

      {/* Bottom banner */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(14,165,233,0.8)] to-transparent px-3 pb-2 pt-6">
        <div className="flex items-center justify-center gap-2">
          <DiamondIcon size={10} color="rgba(255,255,255,0.8)" />
          <p className="font-cute text-white text-[10px] font-semibold tracking-widest">
            TREASURE • 트레저
          </p>
          <DiamondIcon size={10} color="rgba(255,255,255,0.8)" />
        </div>
      </div>
    </div>
  );
}

export default function PhotoboothPage() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedMember, setSelectedMember] = useState<(typeof MEMBERS)[0] | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [flash, setFlash] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const videoConstraints = {
    width: { ideal: 720 },
    height: { ideal: 960 },
    facingMode: "user",
  };

  // Core capture logic: composite webcam + overlay onto a canvas
  const handleCapture = useCallback(async () => {
    if (!webcamRef.current || isCapturing) return;
    setIsCapturing(true);
    setFlash(true);
    setTimeout(() => setFlash(false), 300);

    try {
      // 1. Grab the raw webcam screenshot as a data URL
      const webcamScreenshot = webcamRef.current.getScreenshot({
        width: 720,
        height: 960,
      });
      if (!webcamScreenshot) throw new Error("Could not capture webcam frame");

      // 2. Get container dimensions for proper scaling
      const container = containerRef.current;
      if (!container) throw new Error("No container ref");
      const { width: cW, height: cH } = container.getBoundingClientRect();

      // 3. Create a canvas at device pixel ratio for crisp output
      const dpr = window.devicePixelRatio || 1;
      const outputW = 720;
      const outputH = 960;
      const canvas = document.createElement("canvas");
      canvas.width = outputW;
      canvas.height = outputH;
      const ctx = canvas.getContext("2d")!;

      // 4. Draw the webcam image (mirror it like the CSS transform)
      const webcamImg = new Image();
      await new Promise<void>((resolve, reject) => {
        webcamImg.onload = () => resolve();
        webcamImg.onerror = reject;
        webcamImg.src = webcamScreenshot;
      });
      // Mirror horizontally (webcam feed is CSS-mirrored, screenshot is not)
      ctx.save();
      ctx.translate(outputW, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(webcamImg, 0, 0, outputW, outputH);
      ctx.restore();

      // 5. Draw overlay elements directly with canvas API
      const scaleX = outputW / cW;
      const scaleY = outputH / cH;

      // --- Top gradient banner ---
      const topGrad = ctx.createLinearGradient(0, 0, 0, outputH * 0.18);
      topGrad.addColorStop(0, "rgba(14,165,233,0.88)");
      topGrad.addColorStop(1, "rgba(14,165,233,0)");
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, outputW, outputH * 0.18);

      // --- Top text ---
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.font = `bold ${18 * scaleX}px 'Nunito', sans-serif`;
      ctx.fillText("✦ TEUME PHOTOBOOTH ✦", outputW / 2, 36 * scaleY);
      ctx.font = `italic ${22 * scaleX}px 'Playfair Display', serif`;
      ctx.fillText("Happy Birthday, Anggie! 💙", outputW / 2, 62 * scaleY);

      // --- Corner diamonds (simple polygons) ---
      const drawDiamond = (cx: number, cy: number, size: number) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy - size);
        ctx.lineTo(cx + size * 0.6, cy);
        ctx.lineTo(cx, cy + size);
        ctx.lineTo(cx - size * 0.6, cy);
        ctx.closePath();
        ctx.fillStyle = "rgba(125,211,252,0.85)";
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();
      };

      const drawCorner = (x: number, y: number, dx: number, dy: number) => {
        const len = 30 * Math.min(scaleX, scaleY);
        ctx.beginPath();
        ctx.moveTo(x + dx * len, y);
        ctx.lineTo(x, y);
        ctx.lineTo(x, y + dy * len);
        ctx.strokeStyle = "rgba(125,211,252,0.85)";
        ctx.lineWidth = 3;
        ctx.lineJoin = "round";
        ctx.stroke();
        drawDiamond(x + dx * 8, y + dy * 8, 7 * Math.min(scaleX, scaleY));
      };

      const margin = 12 * Math.min(scaleX, scaleY);
      drawCorner(margin, margin, 1, 1);
      drawCorner(outputW - margin, margin, -1, 1);
      drawCorner(margin, outputH - margin, 1, -1);
      drawCorner(outputW - margin, outputH - margin, -1, -1);

      // --- Member image ---
      if (selectedMember) {
        const memberImg = new Image();
        memberImg.crossOrigin = "anonymous";
        const memberLoaded = await new Promise<boolean>((resolve) => {
          memberImg.onload = () => resolve(true);
          memberImg.onerror = () => resolve(false);
          memberImg.src = `/members/${selectedMember.key}.png`;
        });

        if (memberLoaded) {
          const imgSize = 110 * Math.min(scaleX, scaleY);
          const imgX = outputW - imgSize - 16 * scaleX;
          const imgY = outputH - imgSize - 70 * scaleY;

          // Circle clip
          ctx.save();
          ctx.beginPath();
          ctx.arc(imgX + imgSize / 2, imgY + imgSize / 2, imgSize / 2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(memberImg, imgX, imgY, imgSize, imgSize);
          ctx.restore();

          // Circle border
          ctx.beginPath();
          ctx.arc(imgX + imgSize / 2, imgY + imgSize / 2, imgSize / 2, 0, Math.PI * 2);
          ctx.strokeStyle = selectedMember.color;
          ctx.lineWidth = 3;
          ctx.stroke();

          // Name tag
          ctx.fillStyle = selectedMember.color + "cc";
          ctx.fillRect(imgX, imgY + imgSize - 18 * scaleY, imgSize, 18 * scaleY);
          ctx.fillStyle = "white";
          ctx.font = `bold ${11 * scaleX}px 'Nunito', sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText(
            selectedMember.key.toUpperCase(),
            imgX + imgSize / 2,
            imgY + imgSize - 5 * scaleY
          );
        }
      }

      // --- Bottom gradient banner ---
      const botGrad = ctx.createLinearGradient(0, outputH * 0.82, 0, outputH);
      botGrad.addColorStop(0, "rgba(14,165,233,0)");
      botGrad.addColorStop(1, "rgba(14,165,233,0.82)");
      ctx.fillStyle = botGrad;
      ctx.fillRect(0, outputH * 0.82, outputW, outputH * 0.18);

      // --- Bottom text ---
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = `bold ${15 * scaleX}px 'Nunito', sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("TREASURE • 트레저", outputW / 2, outputH - 18 * scaleY);

      // 6. Export as blob and set preview
      const finalDataUrl = canvas.toDataURL("image/jpeg", 0.93);
      setCapturedImage(finalDataUrl);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Capture failed:", err);
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing, selectedMember]);

  // Download the captured image
  const handleDownload = useCallback(() => {
    if (!capturedImage) return;
    const link = document.createElement("a");
    link.href = capturedImage;
    link.download = `anggie-birthday-teume-${Date.now()}.jpg`;
    link.click();
  }, [capturedImage]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-[#fffbf5] to-blue-50 flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 px-4 pt-4 pb-2 flex items-center justify-between"
      >
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1 text-diamond-400 font-cute text-sm font-semibold hover:text-diamond-600 transition-colors"
        >
          <ChevronLeft size={18} />
          Back
        </button>
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-diamond-400" />
          <span className="font-cute text-diamond-500 font-bold text-sm tracking-wider">
            TEUME PHOTOBOOTH
          </span>
          <Sparkles size={16} className="text-diamond-400" />
        </div>
        <div className="w-16" />
      </motion.header>

      <div className="flex-1 flex flex-col items-center gap-4 px-4 pb-6 max-w-lg mx-auto w-full">
        {/* Bias Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full"
        >
          <p className="font-cute text-diamond-500 text-xs font-semibold tracking-widest text-center mb-2 uppercase">
            ◆ Choose your bias ◆
          </p>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {MEMBERS.map((member) => (
              <motion.button
                key={member.key}
                onClick={() =>
                  setSelectedMember(
                    selectedMember?.key === member.key ? null : member
                  )
                }
                whileTap={{ scale: 0.93 }}
                className="flex-shrink-0 px-3 py-1.5 rounded-full font-cute text-xs font-bold transition-all duration-200 border-2 whitespace-nowrap"
                style={{
                  backgroundColor:
                    selectedMember?.key === member.key
                      ? member.color
                      : "transparent",
                  borderColor: member.color,
                  color:
                    selectedMember?.key === member.key
                      ? "#fff"
                      : member.color,
                  boxShadow:
                    selectedMember?.key === member.key
                      ? `0 0 12px ${member.color}`
                      : "none",
                }}
              >
                {member.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Camera + Overlay Container */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-diamond-200"
          style={{ aspectRatio: "3/4" }}
        >
          {/* Flash effect */}
          <AnimatePresence>
            {flash && (
              <motion.div
                className="absolute inset-0 bg-white z-30"
                initial={{ opacity: 0.9 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>

          {/* Webcam */}
          {!cameraError ? (
            <div className="webcam-container w-full h-full">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                screenshotQuality={0.95}
                videoConstraints={videoConstraints}
                onUserMediaError={() => setCameraError(true)}
                className="w-full h-full object-cover"
                mirrored={true}
              />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-diamond-100 to-diamond-200 flex flex-col items-center justify-center gap-3">
              <Camera size={40} className="text-diamond-400 opacity-50" />
              <p className="font-cute text-diamond-500 text-sm text-center px-8">
                Camera not available. Allow camera access and reload.
              </p>
            </div>
          )}

          {/* Photo Overlay (decorative, on top of webcam) */}
          <PhotoOverlay
            selectedMember={selectedMember}
            overlayRef={overlayRef}
          />
        </motion.div>

        {/* Captured Preview */}
        <AnimatePresence>
          {capturedImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="w-full"
            >
              <p className="font-cute text-diamond-500 text-xs font-semibold tracking-widest text-center mb-2 uppercase">
                ◆ Your photo! ◆
              </p>
              <div className="relative rounded-xl overflow-hidden border-2 border-diamond-200 shadow-lg">
                <img
                  src={capturedImage}
                  alt="Your birthday photo"
                  className="w-full"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Toast */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-diamond-500 text-white px-5 py-2.5 rounded-full font-cute text-sm font-bold shadow-lg z-50 flex items-center gap-2"
            >
              ✨ Photo captured! Scroll down to download.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full flex flex-col gap-3"
        >
          {/* Snap button */}
          <button
            onClick={handleCapture}
            disabled={isCapturing}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-diamond-500 to-diamond-400 hover:from-diamond-600 hover:to-diamond-500 text-white font-cute font-bold text-base py-3.5 rounded-2xl shadow-lg shadow-diamond-200 transition-all duration-200 active:scale-95 disabled:opacity-60"
          >
            <Camera size={20} />
            {isCapturing ? "Capturing..." : "✦ Snap Photo ✦"}
          </button>

          {/* Download button */}
          {capturedImage && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blush-400 to-blush-300 hover:from-blush-500 hover:to-blush-400 text-white font-cute font-bold text-base py-3.5 rounded-2xl shadow-lg shadow-blush-200 transition-all duration-200 active:scale-95"
            >
              <Download size={20} />
              Save to Gallery 💾
            </motion.button>
          )}

          {/* Letter button */}
          <button
            onClick={() => router.push("/letter")}
            className="w-full flex items-center justify-center gap-2 bg-white/80 hover:bg-white border-2 border-diamond-200 hover:border-diamond-300 text-diamond-600 font-cute font-bold text-base py-3.5 rounded-2xl backdrop-blur-sm transition-all duration-200 active:scale-95"
          >
            <Mail size={20} />
            Read Your Letter 💌
          </button>
        </motion.div>
      </div>
    </main>
  );
}
