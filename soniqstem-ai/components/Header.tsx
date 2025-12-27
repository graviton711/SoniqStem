
import React from 'react';
import { Waves, Music, Settings, Github, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  onLogoClick: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick, theme, toggleTheme }) => {
  return (
    <header className={`sticky top-0 z-50 px-6 h-16 flex items-center justify-between border-b backdrop-blur-md transition-colors duration-500 ${theme === 'dark' ? 'bg-slate-950/80 border-white/5' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
      <div
        className="flex items-center gap-2 cursor-pointer group"
        onClick={onLogoClick}
      >
        <div className={`p-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'bg-indigo-600 group-hover:bg-indigo-500' : 'bg-indigo-600 group-hover:bg-indigo-700'}`}>
          <Waves className="w-6 h-6 text-white" />
        </div>
        <span className={`font-extrabold text-xl tracking-tight bg-clip-text text-transparent ${theme === 'dark' ? 'bg-gradient-to-r from-white to-slate-400' : 'bg-gradient-to-r from-indigo-900 to-indigo-600'}`}>
          SONIQSTEM<span className="text-indigo-500">AI</span>
        </span>
      </div>

      <nav className={`hidden md:flex items-center gap-8 text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
        <a href="#" className="hover:text-indigo-500 transition-colors flex items-center gap-2">
          <Music className="w-4 h-4" /> Samples
        </a>
        <a href="#how-it-works" className="hover:text-indigo-500 transition-colors">How it works</a>
      </nav>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'}`}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button className={`p-2 transition-colors ${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-indigo-600'}`}>
          <Settings className="w-5 h-5" />
        </button>
        <button className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all border ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 border-white/5 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm'}`}>
          <Github className="w-4 h-4" /> Star on GitHub
        </button>
      </div>
    </header>
  );
};

export default Header;
