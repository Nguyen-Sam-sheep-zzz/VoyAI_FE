"use client";

import React, { useEffect, useState, useRef } from "react";
import { Plane, MapPin, Sparkles, Brain, Cloud, Map } from "lucide-react";

interface GeneratingOverlayProps {
  loadingStep: number;
  messages: string[];
}

// Cac buoc tao ke hoach voi icon va mau sac
const STEPS = [
  {
    icon: MapPin,
    label: "Tìm kiếm địa điểm",
    color: "text-orange-500",
    bgColor: "bg-orange-100",
    borderColor: "border-orange-200",
    activeBg: "bg-orange-500",
  },
  {
    icon: Cloud,
    label: "Dự báo thời tiết",
    color: "text-sky-500",
    bgColor: "bg-sky-100",
    borderColor: "border-sky-200",
    activeBg: "bg-sky-500",
  },
  {
    icon: Brain,
    label: "AI thiết kế lịch trình",
    color: "text-violet-500",
    bgColor: "bg-violet-100",
    borderColor: "border-violet-200",
    activeBg: "bg-violet-500",
  },
  {
    icon: Sparkles,
    label: "Tổng hợp và hoàn thiện",
    color: "text-amber-500",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-200",
    activeBg: "bg-amber-500",
  },
];

// Particle floating animation
function Particle({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  return (
    <div
      className="absolute rounded-full opacity-20 animate-ping"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        backgroundColor: "#f97316",
        animationDuration: `${2 + delay}s`,
        animationDelay: `${delay * 0.3}s`,
      }}
    />
  );
}

export default function GeneratingOverlay({ loadingStep, messages }: GeneratingOverlayProps) {
  const [dots, setDots] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [particles] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      delay: Math.random() * 4,
    }))
  );
  const startTimeRef = useRef(Date.now());

  // Hieu ung cham ...
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Dem thoi gian cho
  useEffect(() => {
    startTimeRef.current = Date.now();
    setElapsedSeconds(0);
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const progress = Math.min(((loadingStep + 1) / STEPS.length) * 100, 100);
  const currentStep = STEPS[Math.min(loadingStep, STEPS.length - 1)];
  const CurrentStepIcon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
      {/* Nen gradient dong bo FE */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/80 via-amber-900/70 to-orange-800/80 backdrop-blur-lg" />

      {/* Particles */}
      {particles.map((p) => (
        <Particle key={p.id} x={p.x} y={p.y} size={p.size} delay={p.delay} />
      ))}

      {/* Plane bay ngang o nen */}
      <div className="absolute top-1/4 left-0 opacity-10 pointer-events-none">
        <div
          className="text-white"
          style={{
            animation: "flyAcross 8s linear infinite",
          }}
        >
          <Plane size={48} />
        </div>
      </div>

      {/* Card chinh */}
      <div className="relative w-[92%] max-w-lg">
        {/* Glow effect */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-500/30 via-amber-500/30 to-orange-500/30 blur-xl" />

        <div className="relative rounded-3xl border border-white/20 bg-white/10 backdrop-blur-2xl overflow-hidden shadow-2xl">
          {/* Top gradient bar */}
          <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400" />

          <div className="p-8">
            {/* Icon chinh voi vong quay */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Vong quay ngoai */}
                <div className="w-24 h-24 rounded-full border-4 border-white/10 border-t-orange-400 border-r-amber-400 animate-spin" style={{ animationDuration: "2.5s" }} />
                {/* Vong quay trong */}
                <div className="absolute inset-2 w-20 h-20 rounded-full border-2 border-white/5 border-b-orange-300 animate-spin" style={{ animationDuration: "4s", animationDirection: "reverse" }} />
                {/* Icon step hien tai */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-14 h-14 rounded-full ${currentStep.bgColor} flex items-center justify-center shadow-lg transition-all duration-500`}>
                    <CurrentStepIcon className={`w-7 h-7 ${currentStep.color}`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Tieu de chinh */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white tracking-wide mb-1">
                AI đang thiết kế{dots}
              </h3>
              <p className="text-orange-200 text-sm">
                {messages[Math.min(loadingStep, messages.length - 1)]}
              </p>
            </div>

            {/* Step indicators */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {STEPS.map((step, i) => {
                const StepIcon = step.icon;
                const isDone = i < loadingStep;
                const isActive = i === loadingStep;
                const isPending = i > loadingStep;

                return (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 ${
                        isDone
                          ? "bg-white/20 border-white/30 scale-95"
                          : isActive
                          ? `${step.bgColor} ${step.borderColor} scale-110 shadow-lg`
                          : "bg-white/5 border-white/10 scale-90 opacity-50"
                      }`}
                    >
                      {isDone ? (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <StepIcon className={`w-4 h-4 ${isActive ? step.color : "text-white/40"}`} />
                      )}
                    </div>
                    <span
                      className={`text-[9px] text-center leading-tight font-medium transition-colors duration-300 ${
                        isActive ? "text-white" : isDone ? "text-white/60" : "text-white/30"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Thanh tien trinh */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-white/60 font-medium">Tiến trình</span>
                <span className="text-xs text-orange-300 font-bold">{Math.round(progress)}%</span>
              </div>
              <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
                {/* Shimmer */}
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.8s linear infinite",
                  }}
                />
              </div>
            </div>

            {/* Footer info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
                <span className="text-xs text-white/50">VoyAI - đang xử lí</span>
              </div>
              <span className="text-xs text-white/40 font-mono">
                {elapsedSeconds}s
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes flyAcross {
          0% { transform: translateX(-100px) translateY(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(calc(100vw + 100px)) translateY(-30px) rotate(5deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
