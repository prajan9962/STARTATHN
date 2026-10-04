import React from 'react';
import { ShieldCheck, Award, Calendar, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1: Event Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                <Award className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                STARTATHON 2026
              </h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Official E-Certificate Generation &amp; Public Verification System for all registered hackathon participants.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
              <Calendar className="w-4 h-4" />
              <span>Event Date: 25 September 2026 (Friday)</span>
            </div>
          </div>

          {/* Column 2: Organizing Body */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Organized By
            </h4>
            <div className="space-y-2 text-sm text-slate-400">
              <p className="font-medium text-slate-300">Students' Council</p>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>St. Joseph College of Engineering</span>
              </div>
              <p className="text-xs text-slate-500">
                Chennai, Tamil Nadu, India
              </p>
            </div>
          </div>

          {/* Column 3: Trust & Verification */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Tamper-Proof Verification</span>
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every certificate issued is cryptographically indexed with a unique sequential certificate ID and dynamic QR verification code to prevent fraudulent duplication.
            </p>
            <div className="text-xs text-slate-500 font-mono">
              Format: START26-XXXX • High-Res A4
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Students' Council, St. Joseph College of Engineering. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Powered by Secure Cloud Firestore &amp; Vercel</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
