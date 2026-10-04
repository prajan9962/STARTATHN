import React from 'react';
import { Award, ShieldCheck, UserCheck, Sparkles, ExternalLink } from 'lucide-react';

interface HeaderProps {
  activeTab: 'generate' | 'verify' | 'admin';
  setActiveTab: (tab: 'generate' | 'verify' | 'admin') => void;
  verifyId?: string;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Institution & Event Branding */}
          <div 
            onClick={() => setActiveTab('generate')} 
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 flex items-center justify-center text-amber-400 shadow-md shadow-blue-950/20 group-hover:scale-105 transition-transform duration-200 border border-amber-500/30">
              <Award className="w-7 h-7 text-amber-400" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black tracking-tight text-xl text-blue-950">
                  STARTATHON <span className="text-amber-600 font-sans font-bold">2026</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                  Official Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium tracking-wide">
                Students' Council • St. Joseph College of Engineering
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === 'generate'
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-blue-950 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Generate</span>
            </button>

            <button
              onClick={() => setActiveTab('verify')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === 'verify'
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-blue-950 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Verify</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-blue-950 hover:bg-slate-100'
              }`}
            >
              <UserCheck className="w-4 h-4 text-amber-500" />
              <span>Admin</span>
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
};
