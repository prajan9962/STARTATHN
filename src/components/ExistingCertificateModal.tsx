import React from 'react';
import { CertificateData } from '../types/certificate';
import { downloadCertificatePDF } from '../utils/pdfGenerator';
import { AlertCircle, Download, ExternalLink, X, ShieldCheck } from 'lucide-react';

interface ExistingCertificateModalProps {
  certificate: CertificateData;
  isOpen: boolean;
  onClose: () => void;
  onVerify: (certId: string) => void;
}

export const ExistingCertificateModal: React.FC<ExistingCertificateModalProps> = ({
  certificate,
  isOpen,
  onClose,
  onVerify,
}) => {
  if (!isOpen) return null;

  const handleDownload = async () => {
    await downloadCertificatePDF(certificate);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Top Header */}
        <div className="bg-amber-50 border-b border-amber-200/60 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-amber-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0 border border-amber-500/30">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-200/70 text-amber-900 mb-1.5">
                Duplicate Notice
              </span>
              <h3 className="text-xl font-serif font-black text-slate-900">
                A certificate has already been issued for this participant.
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Records show an official STARTATHON 2026 Certificate of Participation was already generated for{' '}
                <span className="font-semibold text-slate-800">{certificate.email}</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Existing Certificate Card Details */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Certificate ID
              </span>
              <span className="font-mono text-sm font-bold text-blue-900 bg-blue-100/70 px-2.5 py-0.5 rounded-md">
                {certificate.certificateId}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Participant:</span>
              <span className="font-semibold text-slate-900">
                {certificate.title} {certificate.fullName}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Department:</span>
              <span className="font-medium text-slate-800">{certificate.department}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Team:</span>
              <span className="font-medium text-slate-800">{certificate.teamName}</span>
            </div>

            <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-200/80">
              <span className="text-slate-500">Status:</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Authentic &amp; Active
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 text-center">
            To prevent counterfeit copies, duplicate registrations for the same email share the registered certificate ID.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={() => onVerify(certificate.certificateId)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors shadow-2xs"
          >
            <ExternalLink className="w-4 h-4 text-slate-500" />
            Verify Online
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 rounded-xl shadow-md shadow-blue-950/20 transition-all"
          >
            <Download className="w-4 h-4 text-amber-400" />
            Download Existing Certificate
          </button>
        </div>

      </div>
    </div>
  );
};
