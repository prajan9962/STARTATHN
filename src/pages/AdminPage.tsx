import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { CertificateData } from '../types/certificate';
import {
  fetchAllCertificates,
  updateCertificateStatus,
  importParticipantsBatch,
  exportCertificatesBackup,
  restoreCertificatesBackup
} from '../services/certificateService';
import { downloadCertificatePDF } from '../utils/pdfGenerator';
import { CertificateCard } from '../components/CertificateCard';
import { TemplateCalibrator } from '../components/TemplateCalibrator';
import {
  ShieldCheck,
  Lock,
  LogOut,
  Search,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Ban,
  CheckCircle2,
  FileSpreadsheet,
  Sliders,
  Users,
  Award,
  AlertTriangle,
  Loader2,
  Database,
  KeyRound,
  X
} from 'lucide-react';

interface AdminPageProps {
  onNavigateHome: () => void;
  onNavigateToVerify: (certId: string) => void;
}

const ADMIN_SESSION_KEY = 'startathon_admin_authorized_v1';
const DEFAULT_ADMIN_PASSCODE = 'admin2026';

export const AdminPage: React.FC<AdminPageProps> = ({
  onNavigateHome,
  onNavigateToVerify,
}) => {
  // Authentication State (Standalone session-based, zero Firebase needed)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  });
  const [adminUsername, setAdminUsername] = useState('admin@stjosephs.ac.in');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Admin Data State
  const [activeTab, setActiveTab] = useState<'certificates' | 'calibrator' | 'import' | 'backup'>('certificates');
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [loadingCerts, setLoadingCerts] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'issued' | 'revoked'>('all');

  // Preview Modal in Admin
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);

  // Revoke Dialog
  const [certToRevoke, setCertToRevoke] = useState<CertificateData | null>(null);
  const [revocationReason, setRevocationReason] = useState('');
  const [revoking, setRevoking] = useState(false);

  // CSV Import State
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<{ added: number; skipped: number; errors: string[] } | null>(null);

  // JSON Backup state
  const [backupRestoreMsg, setBackupRestoreMsg] = useState<string | null>(null);

  const loadCertificates = async () => {
    setLoadingCerts(true);
    try {
      const data = await fetchAllCertificates();
      setCertificates(data);
    } catch (err: any) {
      console.error('Failed to load certificates:', err);
    } finally {
      setLoadingCerts(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadCertificates();
    }

    const handleStorageUpdate = () => {
      if (isAuthenticated) {
        loadCertificates();
      }
    };

    window.addEventListener('startathon_certs_updated', handleStorageUpdate);
    return () => window.removeEventListener('startathon_certs_updated', handleStorageUpdate);
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    // Accept standard administrator passcode or custom credentials
    if (
      adminPassword.trim() === DEFAULT_ADMIN_PASSCODE ||
      adminPassword.trim() === 'startathon2026' ||
      adminPassword.trim() === 'admin'
    ) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      setIsAuthenticated(true);
    } else {
      setAuthError('Invalid administrator credentials. (Default passcode: admin2026)');
    }
  };

  const handleSignOut = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
    setCertificates([]);
  };

  // Status Toggle (Revoke / Restore)
  const handleConfirmRevoke = async () => {
    if (!certToRevoke) return;
    setRevoking(true);
    try {
      await updateCertificateStatus(certToRevoke.certificateId, 'revoked', revocationReason);
      await loadCertificates();
      setCertToRevoke(null);
      setRevocationReason('');
    } catch (err: any) {
      alert(`Failed to revoke certificate: ${err?.message}`);
    } finally {
      setRevoking(false);
    }
  };

  const handleRestore = async (cert: CertificateData) => {
    if (!confirm(`Restore certificate ${cert.certificateId} for ${cert.fullName}?`)) return;
    try {
      await updateCertificateStatus(cert.certificateId, 'issued');
      await loadCertificates();
    } catch (err: any) {
      alert(`Failed to restore certificate: ${err?.message}`);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (certificates.length === 0) {
      alert('No certificate records available to export.');
      return;
    }

    const exportData = certificates.map((c) => ({
      'Certificate ID': c.certificateId,
      'Title': c.title,
      'Full Name': c.fullName,
      'Department': c.department,
      'Team Name': c.teamName,
      'Email': c.email,
      'Mobile': c.mobile || '',
      'Event Name': c.eventName,
      'Event Date': c.eventDate,
      'Status': c.status,
      'Issued At': c.issuedAt,
      'Verification URL': c.verificationUrl,
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `STARTATHON_2026_Issued_Certificates_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // CSV Import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResults(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const rows = results.data.map((row: any) => ({
            title: row.title || row.Title || 'Mr.',
            fullName: row.fullName || row['Full Name'] || row.Name || row.name || '',
            department: row.department || row.Department || '',
            teamName: row.teamName || row['Team Name'] || row.Team || '',
            email: row.email || row.Email || row['Email Address'] || '',
            mobile: row.mobile || row.Mobile || row.Phone || '',
          }));

          const res = await importParticipantsBatch(rows);
          setImportResults(res);
          await loadCertificates();
        } catch (err: any) {
          alert(`Import failed: ${err?.message}`);
        } finally {
          setImporting(false);
          e.target.value = '';
        }
      },
      error: (err) => {
        alert(`Failed to parse CSV file: ${err.message}`);
        setImporting(false);
      },
    });
  };

  // JSON Backup Export
  const handleExportJSON = () => {
    const jsonStr = exportCertificatesBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `startathon_certificates_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // JSON Backup Restore
  const handleRestoreJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const count = restoreCertificatesBackup(text);
        setBackupRestoreMsg(`Successfully restored ${count} certificate records!`);
        await loadCertificates();
      } catch (err: any) {
        alert(`Restore failed: ${err?.message}`);
      } finally {
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  // Filtered Certificates
  const filteredCertificates = certificates.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.certificateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalIssued = certificates.filter((c) => c.status === 'issued').length;
  const totalRevoked = certificates.filter((c) => c.status === 'revoked').length;

  // Not Logged In -> Show Admin Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-950 text-amber-400 flex items-center justify-center mx-auto shadow-lg border border-amber-500/30">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-blue-950">
            STARTATHON 2026
          </h2>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Administrator Security Portal
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-slate-200 space-y-6">
            
            {authError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Admin Email / Username
                </label>
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="admin@stjosephs.ac.in"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center justify-between">
                  <span>Passcode</span>
                  <span className="text-[10px] text-slate-400 lowercase font-normal">Default: admin2026</span>
                </label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter admin passcode"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 hover:from-blue-900 hover:to-indigo-900 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Log In as Administrator</span>
              </button>
            </form>

            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed">
              <span className="font-semibold">Organizer Notice:</span> Zero external configuration required. All participant data and generated certificates persist reliably across sessions.
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={onNavigateHome}
                className="text-xs text-blue-900 font-semibold hover:underline"
              >
                ← Return to Public Certificate Portal
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Logged In Admin Dashboard
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      
      {/* Admin Top Bar */}
      <section className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white py-6 px-4 sm:px-6 lg:px-8 shadow-md border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-black tracking-tight text-white">
                STARTATHON 2026 • Admin Dashboard
              </h1>
              <p className="text-xs text-blue-200">
                Logged in as <span className="text-amber-300 font-semibold">{adminUsername}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              Export CSV
            </button>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 rounded-xl border border-rose-500/30 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </section>

      {/* Main Admin Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Registered</div>
              <div className="text-3xl font-black text-blue-950 mt-1">{certificates.length}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-900" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">Active &amp; Issued</div>
              <div className="text-3xl font-black text-emerald-700 mt-1">{totalIssued}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-6 h-6 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-rose-500">Revoked</div>
              <div className="text-3xl font-black text-rose-600 mt-1">{totalRevoked}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Ban className="w-6 h-6 text-rose-600" />
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'certificates'
                ? 'border-blue-900 text-blue-950'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Issued Certificates ({certificates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'import'
                ? 'border-blue-900 text-blue-950'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>CSV Batch Import</span>
          </button>

          <button
            onClick={() => setActiveTab('calibrator')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'calibrator'
                ? 'border-blue-900 text-blue-950'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4 text-amber-500" />
            <span>Visual Calibrator</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'backup'
                ? 'border-blue-900 text-blue-950'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4 text-indigo-600" />
            <span>Backup &amp; Sync</span>
          </button>
        </div>

        {/* TAB 1: CERTIFICATES TABLE */}
        {activeTab === 'certificates' && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            
            {/* Filter and Search Bar */}
            <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1 max-w-md relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by participant name, certificate ID, department, team..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-xl bg-slate-200/80 p-1 text-xs font-semibold">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    All ({certificates.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('issued')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      statusFilter === 'issued' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    Active ({totalIssued})
                  </button>
                  <button
                    onClick={() => setStatusFilter('revoked')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      statusFilter === 'revoked' ? 'bg-white text-rose-800 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    Revoked ({totalRevoked})
                  </button>
                </div>

                <button
                  onClick={loadCertificates}
                  disabled={loadingCerts}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  title="Reload certificates"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingCerts ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {loadingCerts ? (
                <div className="py-16 text-center text-slate-500">
                  <Loader2 className="w-8 h-8 text-blue-900 animate-spin mx-auto mb-2" />
                  <span>Loading issued certificates...</span>
                </div>
              ) : filteredCertificates.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">No certificates found matching criteria.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      <th className="py-3 px-4">Certificate ID</th>
                      <th className="py-3 px-4">Participant Name</th>
                      <th className="py-3 px-4">Department &amp; Team</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredCertificates.map((cert) => (
                      <tr key={cert.certificateId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-blue-950">
                          {cert.certificateId}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-900">{cert.title} {cert.fullName}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-slate-900">{cert.department}</div>
                          <div className="text-xs text-slate-500">Team: {cert.teamName}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-mono text-xs">
                          {cert.email}
                        </td>
                        <td className="py-3 px-4">
                          {cert.status === 'issued' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              <Ban className="w-3 h-3 text-rose-600" />
                              Revoked
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => setSelectedCert(cert)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-blue-900 hover:bg-blue-50 transition-colors"
                              title="Preview certificate"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => downloadCertificatePDF(cert)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                              title="Download PDF"
                            >
                              <Download className="w-4 h-4" />
                            </button>

                            {cert.status === 'issued' ? (
                              <button
                                onClick={() => setCertToRevoke(cert)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Revoke certificate"
                              >
                                <Ban className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRestore(cert)}
                                className="p-1.5 rounded-lg text-rose-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                                title="Restore certificate"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: CSV BATCH IMPORT */}
        {activeTab === 'import' && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Batch Import Participants via CSV</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Upload a participant list from Google Forms or Google Sheets. The system will automatically generate sequential STARTATHON 2026 Certificate IDs and issue records.
                </p>
              </div>
            </div>

            {/* Expected CSV Columns Reference */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
              <div className="font-bold text-slate-900">Expected CSV Header Columns:</div>
              <div className="font-mono bg-white p-2.5 rounded-xl border border-slate-300 text-blue-900 text-xs overflow-x-auto">
                title, fullName, department, teamName, email, mobile
              </div>
              <p className="text-slate-500">
                Note: Duplicate emails will be automatically skipped to prevent multiple certificates for the same participant.
              </p>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-slate-300 hover:border-blue-900 rounded-2xl p-8 text-center transition-colors">
              <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <div className="text-sm font-semibold text-slate-800">
                Select or drag and drop your participant CSV file
              </div>
              <p className="text-xs text-slate-500 mt-1">UTF-8 encoded .csv up to 10MB</p>

              <label className="mt-4 inline-block px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-900 hover:bg-blue-800 cursor-pointer shadow-sm">
                <span>Browse CSV File</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  disabled={importing}
                  className="hidden"
                />
              </label>

              {importing && (
                <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-blue-900">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing and generating sequential certificates...</span>
                </div>
              )}
            </div>

            {/* Import Results Summary */}
            {importResults && (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Import Completed Successfully</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div className="bg-white p-3 rounded-xl border border-emerald-200 text-emerald-800">
                    New Certificates Issued: <span className="text-base font-black ml-1">{importResults.added}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-amber-200 text-amber-800">
                    Duplicates / Skipped: <span className="text-base font-black ml-1">{importResults.skipped}</span>
                  </div>
                </div>
                {importResults.errors.length > 0 && (
                  <div className="text-xs text-rose-600 mt-2 space-y-1">
                    <div className="font-bold">Errors encountered:</div>
                    {importResults.errors.slice(0, 5).map((e, idx) => (
                      <div key={idx}>• {e}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* TAB 3: VISUAL CALIBRATOR */}
        {activeTab === 'calibrator' && (
          <TemplateCalibrator />
        )}

        {/* TAB 4: BACKUP & RESTORE */}
        {activeTab === 'backup' && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center shrink-0">
                <Database className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Registry Backup &amp; Transfer</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Export complete certificate data to a portable JSON backup file, or restore it onto another device or browser.
                </p>
              </div>
            </div>

            {backupRestoreMsg && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                {backupRestoreMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-sm text-slate-900">Download Full Database Backup</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Downloads an exact snapshot of all {certificates.length} certificates including status, issuance timestamps, and verification URLs in JSON format.
                </p>
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-900 hover:bg-indigo-800 shadow-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export JSON Backup
                </button>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-sm text-slate-900">Restore Registry from Backup</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Load a previously exported JSON backup file to sync or migrate certificates onto this deployment.
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 cursor-pointer shadow-2xs transition-colors">
                  <Upload className="w-4 h-4 text-indigo-700" />
                  <span>Import JSON Backup</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleRestoreJSON}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Selected Certificate Modal Preview */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-amber-400">
                {selectedCert.certificateId} • {selectedCert.fullName}
              </span>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-1 rounded-full text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6 bg-slate-100">
              <CertificateCard certificate={selectedCert} />
            </div>
          </div>
        </div>
      )}

      {/* Revocation Confirmation Dialog */}
      {certToRevoke && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-rose-200 p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Revoke Certificate</h3>
              <p className="text-xs text-slate-600 mt-1">
                Are you sure you want to revoke certificate{' '}
                <span className="font-mono font-bold text-slate-900">{certToRevoke.certificateId}</span> issued to{' '}
                <span className="font-semibold text-slate-900">{certToRevoke.fullName}</span>?
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Revocation Reason (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Disqualified / Duplicate Entry"
                value={revocationReason}
                onChange={(e) => setRevocationReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCertToRevoke(null)}
                className="flex-1 py-2.5 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRevoke}
                disabled={revoking}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50"
              >
                {revoking ? 'Revoking...' : 'Confirm Revoke'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
