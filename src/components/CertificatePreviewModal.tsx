import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CertificateData } from '../types/certificate';
import { CertificateCard } from './CertificateCard';
import { downloadCertificatePDF } from '../utils/pdfGenerator';
import { CheckCircle2, Download, ExternalLink, RefreshCw, X, Award, Calendar, Sparkles } from 'lucide-react';

interface CertificatePreviewModalProps {
  certificate: CertificateData;
  isOpen: boolean;
  onClose: () => void;
  onGenerateAnother: () => void;
  onVerify: (certId: string) => void;
}

export const CertificatePreviewModal: React.FC<CertificatePreviewModalProps> = ({
  certificate,
  isOpen,
  onClose,
  onGenerateAnother,
  onVerify,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire festive academic confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1E3A8A', '#D4AF37', '#3B82F6', '#F59E0B', '#10B981'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    await downloadCertificatePDF(certificate);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-6 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Certificate Generated Successfully
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white">
                STARTATHON 2026 E-Certificate
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                Your official Certificate of Participation has been issued and permanently recorded.
              </p>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Certificate ID
              </div>
              <div className="text-sm sm:text-base font-mono font-bold text-amber-300 mt-0.5 truncate">
                {certificate.certificateId}
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Participant
              </div>
              <div className="text-sm sm:text-base font-semibold text-white mt-0.5 truncate">
                {certificate.title} {certificate.fullName}
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Event
              </div>
              <div className="text-sm sm:text-base font-semibold text-white mt-0.5 truncate">
                {certificate.eventName}
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Date
              </div>
              <div className="text-sm sm:text-base font-semibold text-white mt-0.5 truncate">
                {certificate.eventDate}
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Visual Preview */}
        <div className="p-4 sm:p-6 bg-slate-100">
          <CertificateCard
            certificate={certificate}
            showActions={false}
          />
        </div>

        {/* Action Buttons as specified in prompt */}
        <div className="p-5 sm:p-6 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onGenerateAnother}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
            Generate Another
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onVerify(certificate.certificateId)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-blue-700" />
              Verify Certificate
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 hover:from-blue-800 hover:to-indigo-800 rounded-xl shadow-lg shadow-blue-950/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-4 h-4 text-amber-400" />
              Download Certificate
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
