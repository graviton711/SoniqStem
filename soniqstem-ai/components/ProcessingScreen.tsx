
import React, { useEffect, useState } from 'react';
import { Loader2, Zap, Brain, Activity, Layers } from 'lucide-react';

interface ProcessingScreenProps {
  fileName: string;
  isDone?: boolean;
}

const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ fileName, isDone }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: 'Connecting to YouTube servers...', icon: <Activity className="w-4 h-4" /> },
    { label: 'Downloading audio stream (best quality)...', icon: <Layers className="w-4 h-4" /> },
    { label: 'Neural Audio Processing (Demucs MDX)...', icon: <Brain className="w-4 h-4" /> },
    { label: 'Isolating vocals and accompaniment...', icon: <Zap className="w-4 h-4" /> },
    { label: 'Preparing high-fidelity WAV files...', icon: <Loader2 className="w-4 h-4 animate-spin" /> }
  ];

  useEffect(() => {
    // If it's already done, jump to 100
    if (isDone) {
      setProgress(100);
      setCurrentStep(steps.length - 1);
      return;
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 99) {
          return 99; // Stall at 99% until isDone is true
        }

        // Realistically slow down as we get closer
        let increment = 0;
        if (prev < 30) increment = Math.random() * 0.8; // Download phase
        else if (prev < 85) increment = Math.random() * 0.2; // Neural processing
        else increment = Math.random() * 0.05; // Finalizing

        const next = prev + increment;

        // Update steps based on progress
        const stepIndex = Math.floor((next / 100) * steps.length);
        if (stepIndex < steps.length) setCurrentStep(stepIndex);

        return next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isDone]);

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider mb-2">
          <Activity className="w-3 h-3" /> Processing in Progress
        </div>
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x truncate px-4">
          Separating: {fileName}
        </h2>
      </div>

      {/* Rainbow Processing Card */}
      <div className="relative p-[2px] rounded-3xl overflow-hidden">
        {/* Spinning Rainbow Border */}
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,red,orange,yellow,green,blue,indigo,violet,red)] animate-spin-slow opacity-75 blur-md"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,red,orange,yellow,green,blue,indigo,violet,red)] animate-spin-slow opacity-100"></div>

        <div className="relative bg-slate-950 dark:bg-slate-950 bg-white rounded-[22px] p-8 overflow-hidden">
          {/* Futuristic Visualizer Loop Inside Card */}
          <div className="relative h-48 flex items-center justify-center overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent skew-x-12 animate-pulse"></div>

            <div className="flex items-end gap-1 h-32">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-indigo-500/40 rounded-full dark:bg-indigo-500/40 bg-indigo-500/60"
                  style={{
                    height: `${20 + Math.sin(i * 0.5 + progress * 0.2) * 40 + Math.random() * 30}%`,
                    transition: 'height 0.1s ease-out',
                    opacity: 0.2 + (i / 40) * 0.8
                  }}
                ></div>
              ))}
            </div>

            {/* Neural Scan Line */}
            <div
              className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-indigo-400 to-transparent shadow-[0_0_15px_rgba(99,102,241,0.8)] z-20"
              style={{ left: `${progress}%` }}
            ></div>
          </div>

          <div className="relative h-4 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-black/5 dark:border-white/5 shadow-inner">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out flex items-center justify-end pr-2 overflow-hidden shadow-lg shadow-purple-500/30"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full w-20 bg-white/30 blur-md"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between text-sm font-bold pt-6">
        <span className="text-indigo-500 dark:text-indigo-400">{Math.round(progress)}% Complete</span>
        <span className="text-slate-500 uppercase tracking-widest text-xs">{steps[currentStep].label}</span>
      </div>

      <div className="grid grid-cols-1 gap-3 pt-4">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${i <= currentStep
              ? 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-white/10 opacity-100 shadow-sm dark:shadow-none'
              : 'bg-transparent border-transparent opacity-40 grayscale'
              }`}
          >
            <div className={`p-2 rounded-lg ${i < currentStep ? 'bg-green-500/20 text-green-500' : 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400'}`}>
              {i < currentStep ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : step.icon}
            </div>
            <span className={`text-sm font-medium ${i <= currentStep ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessingScreen;
