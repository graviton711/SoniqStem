
import React, { useCallback, useState } from 'react';
import { Upload, Music, FileAudio, CheckCircle } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  onUrlSubmit: (url: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, onUrlSubmit }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [url, setUrl] = useState('');

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('audio/')) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onUrlSubmit(url);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Separate Music & Vocals <br />
          <span className="text-indigo-600 dark:text-indigo-500">with Surgical Precision</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
          Paste a YouTube link or upload any song. Our advanced neural network will extract the vocals and instrumental stems in seconds.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* URL Input Section */}
        <form onSubmit={handleUrlSubmit} className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Music className="w-5 h-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Paste YouTube music link here..."
            className="w-full h-16 pl-14 pr-36 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium shadow-sm"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            type="submit"
            disabled={!url.trim()}
            className="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 dark:hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center gap-2"
          >
            Extract Stems
          </button>
        </form>

        <div className="flex items-center gap-4 text-slate-700">
          <div className="flex-grow h-px bg-slate-200 dark:bg-slate-900"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">or</span>
          <div className="flex-grow h-px bg-slate-200 dark:bg-slate-900"></div>
        </div>

        {/* File Upload Section */}
        <label
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`
            relative block w-full h-64 rounded-3xl border-2 border-dashed transition-all cursor-pointer group
            ${isDragging
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-400 dark:hover:border-slate-700'}
          `}
        >
          <input
            type="file"
            className="hidden"
            accept="audio/*"
            onChange={onFileInputChange}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 mb-6 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 transition-all duration-300 shadow-sm border border-slate-100 dark:border-transparent">
              <Upload className={`w-10 h-10 ${isDragging ? 'text-indigo-600 dark:text-white' : 'text-indigo-600 dark:text-indigo-400 group-hover:text-white'}`} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Click or drag & drop audio file
            </h3>
            <p className="text-slate-500 dark:text-slate-500 max-w-xs">
              MP3, WAV, FLAC, M4A up to 50MB. <br />
              High quality output guaranteed.
            </p>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-600 font-bold px-2">
            <div className="flex items-center gap-2"><Music className="w-3 h-3" /> FLAC Supported</div>
            <div className="flex items-center gap-2"><FileAudio className="w-3 h-3" /> Stereo 44.1kHz</div>
          </div>
        </label>
      </div>

      {/* How it Works Section */}
      <div id="how-it-works" className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-900">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-10">How it Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Provide Source',
              desc: 'Upload an audio file or paste any YouTube link to get started.'
            },
            {
              step: '02',
              title: 'AI Processing',
              desc: 'Our Demucs neural network analyzes the track to isolate sound sources.'
            },
            {
              step: '03',
              title: 'Download Stems',
              desc: 'Get high-quality vocal and instrumental tracks as separate WAV files.'
            }
          ].map((item, i) => (
            <div key={i} className="relative p-8 rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 space-y-4 shadow-sm">
              <span className="absolute -top-4 left-6 px-3 py-1 bg-indigo-600 rounded-lg text-xs font-black text-white italic">
                STEP {item.step}
              </span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white pt-2">{item.title}</h4>
              <p className="text-slate-600 dark:text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
