
import React, { useState, useEffect } from 'react';
import { AppState, AudioFile } from './types';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import ProcessingScreen from './components/ProcessingScreen';
import ResultScreen from './components/ResultScreen';
import VoiceCloneScreen from './components/VoiceCloneScreen';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [file, setFile] = useState<AudioFile | null>(null);
  const [results, setResults] = useState<{ vocals: string; no_vocals: string } | null>(null);
  const [isBackendDone, setIsBackendDone] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [activeTab, setActiveTab] = useState<'separator' | 'voice-lab'>('separator');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleFileSelect = async (selectedFile: File) => {
    setFile({
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type
    });
    setState(AppState.UPLOADING);
    setIsBackendDone(false);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload and process file');
      }

      const data = await response.json();
      setResults({
        vocals: data.vocals_url,
        no_vocals: data.no_vocals_url,
      });

      setIsBackendDone(true);

      setTimeout(() => {
        setState(AppState.COMPLETED);
      }, 1500);

    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error: ' + error);
      setState(AppState.IDLE);
    }
  };

  const handleUrlSubmit = async (url: string) => {
    setFile({
      name: 'YouTube Audio',
      size: 0,
      type: 'audio/youtube'
    });
    setState(AppState.PROCESSING);
    setIsBackendDone(false);

    try {
      const response = await fetch('/process-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to process URL');
      }

      const data = await response.json();
      setResults({
        vocals: data.vocals_url,
        no_vocals: data.no_vocals_url,
      });

      // Mark as done but wait for the UI to catch up or show completion
      setIsBackendDone(true);

      // Delay the transition to results so the user sees the 100% completion
      setTimeout(() => {
        setState(AppState.COMPLETED);
      }, 1500);

    } catch (error) {
      console.error('Error processing URL:', error);
      alert('Error: ' + error);
      setState(AppState.IDLE);
    }
  };

  const handleReset = () => {
    setState(AppState.IDLE);
    setFile(null);
    setResults(null);
    setIsBackendDone(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-slate-950 text-slate-50' : 'bg-slate-50 text-slate-900'} selection:bg-indigo-500/30`}>
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full animate-pulse-slow ${theme === 'dark' ? 'bg-indigo-900/20' : 'bg-indigo-500/10'}`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full animate-pulse-slow ${theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-500/10'}`}></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header onLogoClick={handleReset} theme={theme} toggleTheme={toggleTheme} />

        <div className="flex justify-center mt-6 mb-2">
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl relative">
            <button
              onClick={() => setActiveTab('separator')}
              className={`relative z-10 px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'separator'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
            >
              Stem Separator
            </button>
            <button
              onClick={() => setActiveTab('voice-lab')}
              className={`relative z-10 px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'voice-lab'
                ? 'bg-white dark:bg-slate-700 text-indigo-500 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
            >
              Voice Lab <span className="ml-1 text-[10px] bg-indigo-500 text-white px-1.5 py-0.5 rounded-full">NEW</span>
            </button>
          </div>
        </div>

        <main className="flex-grow flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-5xl">
            {activeTab === 'separator' ? (
              <>
                {state === AppState.IDLE && (
                  <FileUploader onFileSelect={handleFileSelect} onUrlSubmit={handleUrlSubmit} />
                )}

                {(state === AppState.UPLOADING || state === AppState.PROCESSING) && (
                  <ProcessingScreen
                    fileName={file?.name || 'audio_file.mp3'}
                    isDone={isBackendDone}
                  />
                )}

                {state === AppState.COMPLETED && (
                  <ResultScreen
                    originalFileName={file?.name || 'audio_file.mp3'}
                    vocalsUrl={results?.vocals}
                    instrumentalUrl={results?.no_vocals}
                    onBack={handleReset}
                  />
                )}
              </>
            ) : (
              <VoiceCloneScreen theme={theme} />
            )}
          </div>
        </main>

        <footer className={`py-6 text-center text-sm border-t transition-colors duration-500 ${theme === 'dark' ? 'border-slate-900 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
          <p>© 2025 SoniqStem AI. Advanced Neural Audio Extraction.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
