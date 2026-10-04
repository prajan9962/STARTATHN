import React, { useEffect, useState } from 'react';
import { CertificateData } from '../types/certificate';
import { getCertificateById } from '../services/certificateService';
import { CertificateCard } from '../components/CertificateCard';
import { downloadCertificatePDF } from '../utils/pdfGenerator';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  Download,
  Calendar,
  Building2,
  Users,
  Award,
  ArrowLeft,
  Loader2,
  GraduationCap
} from 'lucide-react';

interface VerificationPageProps {
  initialCertId?: string;
  onNavigateHome: () => void;
}

export const VerificationPage: React.FC<VerificationPageProps> = ({
  initialCertId,
  onNavigateHome,
}) => {
  const [certIdInput, setCertIdInput] = useState(initialCertId || '');
  const [currentId, setCurrentId] = useState(initialCertId || '');
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showVisualPreview, setShowVisualPreview] = useState(false);

  useEffect(() => {
    if (initialCertId) {
      setCertIdInput(initialCertId);
      setCurrentId(initialCertId);
      loadCertificate(initialCertId);
    }
  }, [initialCertId]);

  const loadCertificate = async (idToSearch: string) => {
    const clean = idToSearch.trim().toUpperCase();
    if (!clean) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const data = await getCertificateById(clean);
      setCertificate(data);
      // Update browser URL silently without reloading
      if (typeof window !== 'undefined' && window.history.pushState) {
        window.history.pushState({}, '', `/verify/${clean}`);
      }
    } catch (err) {
      console.error('Failed to verify certificate:', err);
      setCertificate(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certIdInput.trim()) return;
    setCurrentId(certIdInput.trim().toUpperCase());
    loadCertificate(certIdInput);
  };

  const handleDownload = async () => {
    if (!certificate) return;
    await downloadCertificatePDF(certificate);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* Verification Header Banner */}
      <section className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white mb-6 bg-white/10 px-3.5 py-1.5 rounded-full transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Certificate Portal
          </button>

          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Public Verification System
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-black text-white">
              STARTATHON 2026
            </h1>
            <p className="text-sm sm:text-base text-blue-200 uppercase tracking-widest font-mono font-semibold">
              CERTIFICATE VERIFICATION
            </p>
          </div>

          {/* Search Box */}
          <div className="mt-8 max-w-xl mx-auto">
            <form onSubmit={handleSearch} className="flex gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-lg">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter Certificate ID (e.g. START26-0001)"
                  value={certIdInput}
                  onChange={(e) => setCertIdInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-none bg-white text-slate-900 text-sm font-mono uppercase focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !certIdInput.trim()}
                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-blue-950 transition-all shadow-sm shrink-0 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Verification Status Results */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-xl border border-slate-200 space-y-4">
            <Loader2 className="w-10 h-10 text-blue-900 animate-spin mx-auto" />
            <div className="text-base font-semibold text-slate-800">Verifying credential on blockchain-style registry...</div>
            <div className="text-xs text-slate-500 font-mono">Checking ID: {currentId}</div>
          </div>
        ) : hasSearched && !certificate ? (
          /* NOT FOUND STATE */
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center shadow-xl border border-rose-200 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800">
                Invalid Credential
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
                Certificate Not Found
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                No issued STARTATHON 2026 certificate corresponds to ID{' '}
                <span className="font-mono font-bold text-slate-900">{currentId}</span>.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 max-w-md mx-auto text-xs text-slate-600 space-y-1.5 border border-slate-200">
              <p className="font-semibold text-slate-800">Possible reasons:</p>
              <ul className="list-disc list-inside text-left space-y-1 text-slate-600">
                <li>The Certificate ID was mistyped. Expected format: START26-XXXX.</li>
                <li>The certificate has not yet been generated by the participant.</li>
                <li>The certificate was fabricated or counterfeit.</li>
              </ul>
            </div>
          </div>
        ) : certificate ? (
          /* FOUND: EITHER ISSUED OR REVOKED */
          <div className="space-y-6">
            
            {/* Status Banner */}
            <div
              className={`rounded-3xl shadow-xl border p-6 sm:p-8 overflow-hidden relative ${
                certificate.status === 'issued'
                  ? 'bg-white border-emerald-200'
                  : 'bg-white border-rose-200'
              }`}
            >
              {/* Badge Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                      certificate.status === 'issued'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        : 'bg-rose-50 text-rose-600 border-rose-200'
                    }`}
                  >
                    {certificate.status === 'issued' ? (
                      <CheckCircle2 className="w-8 h-8" />
                    ) : (
                      <AlertTriangle className="w-8 h-8" />
                    )}
                  </div>

                  <div>
                    {certificate.status === 'issued' ? (
                      <>
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>✓ Certificate Verified</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 mt-0.5">
                          Authentic Certificate
                        </h2>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700">
                          <AlertTriangle className="w-4 h-4" />
                          <span>⚠️ Certificate Revoked</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-serif font-black text-rose-900 mt-0.5">
                          Certificate Revoked
                        </h2>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Certificate ID</span>
                  <span className="font-mono text-base font-bold text-blue-950 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                    {certificate.certificateId}
                  </span>
                </div>
              </div>

              {/* Exact Data Required by Prompt 11 */}
              <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Participant
                  </div>
                  <div className="text-lg font-serif font-bold text-slate-900">
                    {certificate.title} {certificate.fullName}
                  </div>
                </div>

                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-900" />
                    Department
                  </div>
                  <div className="text-base font-semibold text-slate-800">
                    {certificate.department}
                  </div>
                </div>

                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-900" />
                    Team
                  </div>
                  <div className="text-base font-semibold text-slate-800">
                    {certificate.teamName}
                  </div>
                </div>

                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-blue-900" />
                    Event
                  </div>
                  <div className="text-base font-semibold text-slate-800">
                    {certificate.eventName}
                  </div>
                </div>

                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-900" />
                    Date
                  </div>
                  <div className="text-base font-semibold text-slate-800">
                    {certificate.eventDate}
                  </div>
                </div>

                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-900" />
                    Issued By
                  </div>
                  <div className="text-sm font-semibold text-slate-800">
                    Students' Council
                  </div>
                  <div className="text-xs text-slate-600">
                    St. Joseph College of Engineering
                  </div>
                </div>

              </div>

              {/* Revocation Warning If Applicable */}
              {certificate.status === 'revoked' && (
                <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Notice of Revocation:
                  </div>
                  <p className="mt-1 text-slate-700">
                    This certificate was revoked by the institution. Reason:{' '}
                    <span className="font-semibold">{certificate.revocationReason || 'Administrative cancellation'}</span>.
                    It is no longer valid for official academic or professional claims.
                  </p>
                </div>
              )}

              {/* Actions */}
              {certificate.status === 'issued' && (
                <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setShowVisualPreview(!showVisualPreview)}
                    className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    {showVisualPreview ? 'Hide Certificate Preview' : 'View Full Certificate'}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 shadow-md shadow-blue-950/20 transition-all"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    Download Official PDF
                  </button>
                </div>
              )}

            </div>

            {/* Visual Preview Expanded */}
            {showVisualPreview && certificate.status === 'issued' && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <CertificateCard
                  certificate={certificate}
                  showActions={true}
                />
              </div>
            )}

          </div>
        ) : (
          /* INITIAL EMPTY SEARCH STATE */
          <div className="bg-white rounded-3xl p-10 text-center shadow-xl border border-slate-200 space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-900 border border-blue-200 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7 text-blue-900" />
            </div>
            <h2 className="text-xl font-serif font-black text-slate-900">
              Verify STARTATHON 2026 Credential
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Enter the unique Certificate ID located on any certificate or scan the dynamic QR code to verify its authenticity directly from the institution registry.
            </p>
          </div>
        )}
      </main>

    </div>
  );
};
