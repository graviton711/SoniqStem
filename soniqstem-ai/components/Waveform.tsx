
import React from 'react';

interface WaveformProps {
  color: string;
  isPlaying: boolean;
}

const Waveform: React.FC<WaveformProps> = ({ color, isPlaying }) => {
  // Generate random fixed heights for the bars
  const bars = Array.from({ length: 60 }).map(() => Math.random() * 80 + 20);

  return (
    <div className="flex items-center justify-between gap-[2px] h-16 w-full">
      {bars.map((height, i) => (
        <div 
          key={i}
          className={`w-[3px] rounded-full transition-all duration-300 ${isPlaying ? 'animate-pulse' : 'opacity-60'}`}
          style={{ 
            height: isPlaying ? `${height}%` : `${height * 0.4}%`,
            backgroundColor: color,
            animationDelay: isPlaying ? `${i * 0.05}s` : '0s',
            boxShadow: isPlaying ? `0 0 10px ${color}44` : 'none'
          }}
        ></div>
      ))}
    </div>
  );
};

export default Waveform;
