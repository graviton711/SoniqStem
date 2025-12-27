
import React from 'react';
import { Download, Music, Mic, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface ResultScreenProps {
  originalFileName: string;
  vocalsUrl?: string;
  instrumentalUrl?: string;
  onBack: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  originalFileName,
  vocalsUrl,
  instrumentalUrl,
  onBack
}) => {
  const downloadFile = async (url?: string, filename?: string) => {
    if (!url) return;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename || 'download.mp3';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-white transition-colors text-sm font-bold mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Upload
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-green-500/20 p-1 rounded-full">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Separation Complete</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Processed: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{originalFileName}</span></p>
        </div>

        <div className="flex items-center gap-3">
          <button
            disabled={!vocalsUrl && !instrumentalUrl}
            onClick={() => {
              downloadFile(vocalsUrl, 'vocals.mp3');
              setTimeout(() => downloadFile(instrumentalUrl, 'instrumental.mp3'), 100);
            }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 text-white disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> Download All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vocals Stem */}
        <div className="bg-white/80 dark:bg-transparent dark:glass-panel backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-[32px] p-8 space-y-6 relative overflow-hidden group shadow-xl dark:shadow-none">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Mic className="w-24 h-24 text-pink-500" />
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-500/20 rounded-2xl flex items-center justify-center">
              <Mic className="w-6 h-6 text-pink-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Vocals</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Isolated Vocal Track</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-950/50 rounded-2xl p-8 border border-slate-100 dark:border-white/5 flex flex-col items-center justify-center space-y-4 shadow-sm dark:shadow-none">
            <div className="w-20 h-20 bg-pink-500/10 rounded-full flex items-center justify-center">
              <Mic className="w-10 h-10 text-pink-500" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm text-center">
              Your vocals track is ready for download
            </p>
          </div>

          <button
            onClick={() => downloadFile(vocalsUrl, 'vocals.mp3')}
            disabled={!vocalsUrl}
            className="w-full bg-pink-600 hover:bg-pink-500 py-4 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-pink-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> Download Vocals (.mp3)
          </button>
        </div>

        {/* Instrumental Stem */}
        <div className="bg-white/80 dark:bg-transparent dark:glass-panel backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-[32px] p-8 space-y-6 relative overflow-hidden group shadow-xl dark:shadow-none">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Music className="w-24 h-24 text-cyan-500" />
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center">
              <Music className="w-6 h-6 text-cyan-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Instrumental</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Backing Track</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-950/50 rounded-2xl p-8 border border-slate-100 dark:border-white/5 flex flex-col items-center justify-center space-y-4 shadow-sm dark:shadow-none">
            <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center">
              <Music className="w-10 h-10 text-cyan-500" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm text-center">
              Your instrumental track is ready for download
            </p>
          </div>

          <button
            onClick={() => downloadFile(instrumentalUrl, 'instrumental.mp3')}
            disabled={!instrumentalUrl}
            className="w-full bg-cyan-600 hover:bg-cyan-500 py-4 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> Download Instrumental (.mp3)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
