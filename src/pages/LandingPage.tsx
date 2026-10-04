import React, { useState } from 'react';
import { TitleType, CertificateData, CertificateFormInputs } from '../types/certificate';
import { issueCertificate, EVENT_NAME, EVENT_DATE, ORGANIZER_INFO } from '../services/certificateService';
import { normalizeFullName, normalizeDepartment, normalizeTeamName, normalizeEmail } from '../utils/normalization';
import { CertificatePreviewModal } from '../components/CertificatePreviewModal';
import { ExistingCertificateModal } from '../components/ExistingCertificateModal';
import {
  Award,
  Sparkles,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Building2,
  Users,
  Mail,
  Phone,
  FileCheck,
  ArrowRight,
  GraduationCap
} from 'lucide-react';

interface LandingPageProps {
  onNavigateToVerify: (certId: string) => void;
  onNavigateToAdmin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToVerify,
  onNavigateToAdmin,
}) => {
  // Form State
  const [title, setTitle] = useState<TitleType>('Mr.');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [teamName, setTeamName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  // Search by ID state
  const [searchCertId, setSearchCertId] = useState('');

  // UI status
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // Modals
  const [previewCert, setPreviewCert] = useState<CertificateData | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [existingCert, setExistingCert] = useState<CertificateData | null>(null);
  const [showExistingModal, setShowExistingModal] = useState(false);

  // Form field validation
  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      errors.fullName = 'Please enter your full name.';
    } else if (fullName.trim().length < 2) {
      errors.fullName = 'Name must be at least 2 characters long.';
    }

    if (!department.trim()) {
      errors.department = 'Please enter your department.';
    }

    if (!teamName.trim()) {
      errors.teamName = 'Please enter your team name.';
    }

    if (!email.trim()) {
      errors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const inputs: CertificateFormInputs = {
        title,
        fullName: normalizeFullName(fullName),
        department: normalizeDepartment(department),
        teamName: normalizeTeamName(teamName),
        email: normalizeEmail(email),
        mobile: mobile.trim(),
      };

      const result = await issueCertificate(inputs);

      if (result.isExisting) {
        setExistingCert(result.certificate);
        setShowExistingModal(true);
      } else {
        setPreviewCert(result.certificate);
        setShowPreviewModal(true);
      }
    } catch (err: any) {
      console.error('Error generating certificate:', err);
      setErrorMsg(err?.message || 'Failed to generate certificate. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCertId.trim()) return;
    onNavigateToVerify(searchCertId.trim().toUpperCase());
  };

  const handleResetForm = () => {
    setShowPreviewModal(false);
    setShowExistingModal(false);
    setFullName('');
    setDepartment('');
    setTeamName('');
    setEmail('');
    setMobile('');
    setValidationErrors({});
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-950 text-white pt-14 pb-24 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20">
        {/* Background Decorative Guilloche / Geometry */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-inner">
            <Award className="w-4 h-4 text-amber-400" />
            Official Certificate of Participation
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            STARTATHON <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">2026</span>
          </h1>

          <div className="text-base sm:text-xl font-medium text-blue-100 max-w-2xl mx-auto">
            E-CERTIFICATE PORTAL
          </div>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-light leading-relaxed">
            Thank you for participating in Startathon 2026. Generate and download your official, digitally verifiable Certificate of Participation using your registered details.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-amber-200/90 font-medium">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              {EVENT_DATE} (Friday)
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              {ORGANIZER_INFO}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-16">
        
        {/* Certificate Generation Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden">
          
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 px-6 sm:px-8 py-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Generate E-Certificate</h2>
                <p className="text-xs text-blue-200">Enter your registered event credentials</p>
              </div>
            </div>
            <span className="hidden sm:inline-block text-xs font-mono text-amber-300 bg-black/20 px-3 py-1 rounded-full border border-white/10">
              A4 Landscape PDF
            </span>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            
            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3 animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Unable to issue certificate</div>
                  <div className="text-xs text-rose-600 mt-0.5">{errorMsg}</div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
              
              {/* Field 1: Title Dropdown */}
              <div className="sm:col-span-3 space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Title <span className="text-rose-500">*</span>
                </label>
                <select
                  value={title}
                  onChange={(e) => setTitle(e.target.value as TitleType)}
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all text-sm"
                >
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Dr.">Dr.</option>
                </select>
              </div>

              {/* Field 2: Full Name */}
              <div className="sm:col-span-9 space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Prajan L"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (validationErrors.fullName) {
                      setValidationErrors(prev => ({ ...prev, fullName: '' }));
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    validationErrors.fullName
                      ? 'border-rose-400 bg-rose-50/40 focus:ring-2 focus:ring-rose-500'
                      : 'border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:border-blue-900'
                  }`}
                />
                {validationErrors.fullName ? (
                  <p className="text-xs text-rose-500 font-medium">{validationErrors.fullName}</p>
                ) : (
                  <p className="text-[11px] text-slate-400">
                    Will appear on certificate as: <span className="font-semibold text-slate-700 font-serif">{title} {normalizeFullName(fullName) || 'Your Name'}</span>
                  </p>
                )}
              </div>

              {/* Field 3: Department */}
              <div className="sm:col-span-6 space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-900" />
                  Department <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science and Engineering"
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    if (validationErrors.department) {
                      setValidationErrors(prev => ({ ...prev, department: '' }));
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    validationErrors.department
                      ? 'border-rose-400 bg-rose-50/40 focus:ring-2 focus:ring-rose-500'
                      : 'border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:border-blue-900'
                  }`}
                />
                {validationErrors.department && (
                  <p className="text-xs text-rose-500 font-medium">{validationErrors.department}</p>
                )}
              </div>

              {/* Field 4: Team Name */}
              <div className="sm:col-span-6 space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-900" />
                  Team Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Innovators"
                  value={teamName}
                  onChange={(e) => {
                    setTeamName(e.target.value);
                    if (validationErrors.teamName) {
                      setValidationErrors(prev => ({ ...prev, teamName: '' }));
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    validationErrors.teamName
                      ? 'border-rose-400 bg-rose-50/40 focus:ring-2 focus:ring-rose-500'
                      : 'border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:border-blue-900'
                  }`}
                />
                {validationErrors.teamName && (
                  <p className="text-xs text-rose-500 font-medium">{validationErrors.teamName}</p>
                )}
              </div>

              {/* Field 5: Email Address */}
              <div className="sm:col-span-7 space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-900" />
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="participant@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationErrors.email) {
                      setValidationErrors(prev => ({ ...prev, email: '' }));
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    validationErrors.email
                      ? 'border-rose-400 bg-rose-50/40 focus:ring-2 focus:ring-rose-500'
                      : 'border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:border-blue-900'
                  }`}
                />
                {validationErrors.email ? (
                  <p className="text-xs text-rose-500 font-medium">{validationErrors.email}</p>
                ) : (
                  <p className="text-[11px] text-slate-400">Used for anti-duplication verification</p>
                )}
              </div>

              {/* Field 6: Mobile Number (Optional) */}
              <div className="sm:col-span-5 space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-900" />
                    Mobile Number
                  </span>
                  <span className="text-[10px] text-slate-400 lowercase font-normal">(optional)</span>
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all"
                />
              </div>

            </div>

            {/* Submission Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-2xl font-serif text-base sm:text-lg font-bold tracking-wide uppercase text-white bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 hover:from-blue-900 hover:to-indigo-900 shadow-xl shadow-blue-950/20 flex items-center justify-center gap-3 transition-all transform active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                    <span>Generating your certificate...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>GENERATE E-CERTIFICATE</span>
                    <ArrowRight className="w-5 h-5 text-amber-400" />
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Secure Sequential ID
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FileCheck className="w-4 h-4 text-blue-600" /> High-Resolution PDF
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-amber-600" /> Tamper-Proof QR
              </span>
            </div>

          </form>

        </div>

        {/* Section 16: Certificate Verification Card */}
        <div className="mt-10 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="space-y-1.5 max-w-md">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Certificate Verification
              </div>
              <h3 className="text-xl font-serif font-black text-slate-900">
                Already have a certificate?
              </h3>
              <p className="text-sm text-slate-600">
                Verify any STARTATHON 2026 certificate authenticity in real-time using its Certificate ID.
              </p>
            </div>

            <form onSubmit={handleVerifySearch} className="flex-1 max-w-md flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. START26-0001"
                  value={searchCertId}
                  onChange={(e) => setSearchCertId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-mono uppercase bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={!searchCertId.trim()}
                className="px-6 py-3 rounded-xl font-bold text-sm tracking-wide text-white bg-blue-900 hover:bg-blue-800 disabled:opacity-50 transition-colors shadow-sm shrink-0"
              >
                VERIFY
              </button>
            </form>

          </div>
        </div>

      </main>

      {/* Preview Modal upon successful creation */}
      {previewCert && (
        <CertificatePreviewModal
          certificate={previewCert}
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          onGenerateAnother={handleResetForm}
          onVerify={(certId) => onNavigateToVerify(certId)}
        />
      )}

      {/* Duplicate Notice Modal */}
      {existingCert && (
        <ExistingCertificateModal
          certificate={existingCert}
          isOpen={showExistingModal}
          onClose={() => setShowExistingModal(false)}
          onVerify={(certId) => onNavigateToVerify(certId)}
        />
      )}

    </div>
  );
};
