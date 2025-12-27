import React, { useState, useEffect } from 'react';
import { Upload, Mic, Play, Pause, Download, Wand2, Music2, Sliders } from 'lucide-react';

interface VoiceCloneScreenProps {
    theme: 'dark' | 'light';
}

const VoiceCloneScreen: React.FC<VoiceCloneScreenProps> = ({ theme }) => {
    const [vocalFile, setVocalFile] = useState<File | null>(null);
    const [modelName, setModelName] = useState("generic_female");
    const [pitchConfirm, setPitchConfirm] = useState("0");
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultUrl, setResultUrl] = useState<string | null>(null);

    // Demo models list
    const models = [
        { id: 'generic_female', name: 'AI Female (Pop Star)', defaultPitch: 0 },
        { id: 'generic_male', name: 'AI Male (Radio Host)', defaultPitch: -12 },
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setVocalFile(e.target.files[0]);
        }
    };

    const handleConvert = async () => {
        if (!vocalFile) return;

        setIsProcessing(true);
        setResultUrl(null);

        try {
            const formData = new FormData();
            formData.append('audio_file', vocalFile);
            formData.append('model_name', modelName);
            formData.append('pitch_shift', pitchConfirm);

            const response = await fetch('/voice-cover', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error("Conversion failed");

            const data = await response.json();
            setResultUrl(data.url);
        } catch (error) {
            alert("Error converting voice: " + error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full max-w-4xl mx-auto">
            <div className="text-center mb-10 space-y-4">
                <h2 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 pb-2">
                    AI Voice Lab
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto font-medium">
                    Clone any voice. Transform your vocals into professional singers.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* 1. Vocal Uploader */}
                <div className={`relative p-8 rounded-[32px] border-2 border-dashed transition-all group ${vocalFile ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400'
                    }`}>
                    <input
                        type="file"
                        accept="audio/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center justify-center h-64 space-y-6">
                        <div className={`p-6 rounded-full transition-transform group-hover:scale-110 ${vocalFile ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                            <Mic className="w-10 h-10" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="font-bold text-xl text-slate-900 dark:text-white">
                                {vocalFile ? vocalFile.name : "Upload Vocals"}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-500 uppercase tracking-wider font-bold">
                                {vocalFile ? (vocalFile.size / 1024 / 1024).toFixed(2) + ' MB' : "wav, mp3, m4a"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. Controls */}
                <div className="bg-white dark:bg-slate-900/50 rounded-[32px] p-8 border border-slate-200 dark:border-slate-700 flex flex-col justify-center space-y-8">

                    {/* Model Selector */}
                    <div className="space-y-4">
                        <label className="flex items-center gap-3 text-lg font-bold text-slate-900 dark:text-white">
                            <Music2 className="w-6 h-6 text-indigo-500" />
                            Target Voice
                        </label>
                        <select
                            value={modelName}
                            onChange={(e) => setModelName(e.target.value)}
                            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white font-medium text-lg outline-none cursor-pointer"
                        >
                            {models.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Pitch Slider */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="flex items-center gap-3 text-lg font-bold text-slate-900 dark:text-white">
                                <Sliders className="w-6 h-6 text-pink-500" />
                                Pitch Shift
                            </label>
                            <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-900 dark:text-white">
                                {parseInt(pitchConfirm) > 0 ? `+${pitchConfirm}` : pitchConfirm}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="-24"
                            max="24"
                            step="1"
                            value={pitchConfirm}
                            onChange={(e) => setPitchConfirm(e.target.value)}
                            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-500 font-medium text-center">
                            Use +12 for Male to Female, -12 for Female to Male
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-center mb-10">
                <button
                    onClick={handleConvert}
                    disabled={!vocalFile || isProcessing}
                    className="group relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 overflow-hidden"
                >
                    {isProcessing ? (
                        <span className="flex items-center gap-3">
                            <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Cloning Voice...
                        </span>
                    ) : (
                        <span className="flex items-center gap-3">
                            <Wand2 className="w-5 h-5" />
                            Convert Voice
                        </span>
                    )}
                </button>
            </div>

            {resultUrl && (
                <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-8">
                    <h3 className="text-2xl font-bold text-center mb-6 text-slate-900 dark:text-white">Voice Conversion Complete!</h3>

                    <div className="bg-slate-100 dark:bg-slate-950/50 rounded-2xl p-4 mb-6">
                        <audio controls src={resultUrl} className="w-full h-12" autoPlay />
                    </div>

                    <div className="flex justify-center">
                        <a
                            href={resultUrl}
                            download="voice_clone.wav"
                            className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                        >
                            <Download className="w-4 h-4" /> Download Result
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VoiceCloneScreen;
