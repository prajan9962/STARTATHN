import React, { useEffect, useRef, useState } from 'react';
import { CertificateData } from '../types/certificate';
import { renderCertificateToCanvas } from '../utils/pdfGenerator';
import { Loader2, ZoomIn, Download, ExternalLink, ShieldCheck } from 'lucide-react';
import { downloadCertificatePDF, downloadCertificatePNG } from '../utils/pdfGenerator';

interface CertificateCardProps {
  certificate: CertificateData;
  onVerifyClick?: () => void;
  showActions?: boolean;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  onVerifyClick,
  showActions = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const render = async () => {
      try {
        if (!canvasRef.current) return;
        await renderCertificateToCanvas({
          certificate,
          canvas: canvasRef.current,
        });
        if (isMounted) setLoading(false);
      } catch (err: any) {
        console.error('Failed to render certificate preview:', err);
        if (isMounted) {
          setError(err?.message || 'Could not render certificate image');
          setLoading(false);
        }
      }
    };

    render();

    return () => {
      isMounted = false;
    };
  }, [certificate]);

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      await downloadCertificatePDF(certificate);
    } catch (e: any) {
      alert(`Download failed: ${e?.message || 'Unknown error'}`);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadPNG = async () => {
    try {
      setDownloading(true);
      await downloadCertificatePNG(certificate);
    } catch (e: any) {
      alert(`Download failed: ${e?.message || 'Unknown error'}`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden flex flex-col">
      {/* Certificate Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/30">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-xs sm:text-sm font-semibold text-amber-300 tracking-wider">
            {certificate.certificateId}
          </span>
          <span className="text-xs text-slate-300 font-medium hidden sm:inline">
            • {certificate.fullName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {certificate.status === 'issued' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Authentic
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40">
              Revoked
            </span>
          )}
        </div>
      </div>

      {/* Canvas Container */}
      <div className="relative bg-slate-900/5 p-3 sm:p-6 flex items-center justify-center min-h-[260px] sm:min-h-[380px] overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-xs">
            <Loader2 className="w-8 h-8 text-blue-900 animate-spin mb-2" />
            <span className="text-sm font-medium text-slate-700">Rendering high-resolution certificate...</span>
          </div>
        )}

        {error ? (
          <div className="p-6 text-center text-rose-600 bg-rose-50 rounded-xl border border-rose-200">
            <p className="font-semibold text-sm">Failed to render certificate preview</p>
            <p className="text-xs mt-1 text-slate-600">{error}</p>
          </div>
        ) : (
          <div className="w-full max-w-4xl relative shadow-2xl rounded-lg overflow-hidden border border-slate-300 bg-white ring-1 ring-black/5">
            <canvas
              ref={canvasRef}
              className="w-full h-auto block select-none"
              style={{ maxHeight: '70vh', objectFit: 'contain' }}
            />
          </div>
        )}
      </div>

      {/* Action Footer */}
      {showActions && (
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Official E-Certificate of Participation • STARTATHON 2026
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {onVerifyClick && (
              <button
                type="button"
                onClick={onVerifyClick}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-900 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg shadow-2xs transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Verify
              </button>
            )}

            <button
              type="button"
              onClick={handleDownloadPNG}
              disabled={downloading || loading}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs transition-colors disabled:opacity-50"
            >
              PNG
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={downloading || loading}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 rounded-lg shadow-md shadow-blue-950/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {downloading ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              ) : (
                <Download className="w-4 h-4 text-amber-400" />
              )}
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
