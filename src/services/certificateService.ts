import { CertificateData, CertificateFormInputs, CertificateStatus } from '../types/certificate';
import {
  normalizeFullName,
  normalizeDepartment,
  normalizeTeamName,
  normalizeEmail
} from '../utils/normalization';
import { getVerificationUrl } from '../utils/qrGenerator';

export const EVENT_NAME = 'STARTATHON 2026';
export const EVENT_DATE = '25 September 2026';
export const ORGANIZER_INFO = "Students' Council, St. Joseph College of Engineering";

const STORAGE_KEY = 'startathon_2026_certificates_v2';

// Empty default registry: all certificate datas are strictly obtained from user form submissions
const INITIAL_CERTIFICATES: CertificateData[] = [];

/**
 * Loads all certificates from persistent storage.
 */
export function getStoredCertificates(): CertificateData[] {
  if (typeof window === 'undefined') return INITIAL_CERTIFICATES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CERTIFICATES));
      return INITIAL_CERTIFICATES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_CERTIFICATES;
  } catch (err) {
    console.error('Error reading certificate registry from localStorage:', err);
    return INITIAL_CERTIFICATES;
  }
}

/**
 * Saves certificate array into persistent storage.
 */
function saveStoredCertificates(certs: CertificateData[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(certs));
    window.dispatchEvent(new Event('startathon_certs_updated'));
  } catch (err) {
    console.error('Error saving certificates to localStorage:', err);
  }
}

/**
 * Safely generates the next sequential certificate ID (e.g. START26-0001, START26-0002).
 */
export function getNextCertificateId(): string {
  const certs = getStoredCertificates();
  let maxNumber = 0;

  for (const c of certs) {
    const match = c.certificateId.match(/^START26-(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNumber) {
        maxNumber = num;
      }
    }
  }

  const nextNum = maxNumber + 1;
  const padded = String(nextNum).padStart(4, '0');
  return `START26-${padded}`;
}

/**
 * Checks if a certificate has already been issued for this email in STARTATHON 2026.
 */
export async function findCertificateByEmail(email: string): Promise<CertificateData | null> {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail) return null;

  const certs = getStoredCertificates();
  const found = certs.find(
    (c) => c.email.toLowerCase() === cleanEmail && c.eventName === EVENT_NAME
  );
  return found || null;
}

/**
 * Fetch a certificate by unique certificate ID (e.g. START26-0001).
 */
export async function getCertificateById(certificateId: string): Promise<CertificateData | null> {
  if (!certificateId) return null;
  const cleanId = certificateId.trim().toUpperCase();

  const certs = getStoredCertificates();
  const found = certs.find((c) => c.certificateId.toUpperCase() === cleanId);
  return found || null;
}

/**
 * Issues a new official certificate using the EXACT data obtained from the filled form.
 */
export async function issueCertificate(inputs: CertificateFormInputs): Promise<{
  certificate: CertificateData;
  isExisting: boolean;
}> {
  const cleanEmail = normalizeEmail(inputs.email);

  // 1. Normalize participant details obtained directly from form
  const normalizedName = normalizeFullName(inputs.fullName);
  const normalizedDept = normalizeDepartment(inputs.department);
  const normalizedTeam = normalizeTeamName(inputs.teamName);

  if (!normalizedName) throw new Error('Please enter your full name.');
  if (!normalizedDept) throw new Error('Please enter your department.');
  if (!normalizedTeam) throw new Error('Please enter your team name.');
  if (!cleanEmail) throw new Error('Please enter your email address.');

  const certs = getStoredCertificates();
  const existingIndex = certs.findIndex(
    (c) => c.email.toLowerCase() === cleanEmail && c.eventName === EVENT_NAME
  );

  let certId: string;
  let isExisting = false;

  if (existingIndex !== -1) {
    // Participant previously registered with this email
    // Retain their allocated Certificate ID, but update with their freshly filled form inputs!
    certId = certs[existingIndex].certificateId;
    isExisting = true;
  } else {
    // New participant: assign next sequential Certificate ID
    certId = inputs.certificateId && inputs.certificateId.startsWith('START26-')
      ? inputs.certificateId.trim().toUpperCase()
      : getNextCertificateId();
  }

  const verificationUrl = getVerificationUrl(certId);

  // Certificate data obtained directly from the filled form
  const certData: CertificateData = {
    certificateId: certId,
    title: inputs.title,
    fullName: normalizedName,
    department: normalizedDept,
    teamName: normalizedTeam,
    email: cleanEmail,
    mobile: inputs.mobile?.trim() || '',
    eventName: EVENT_NAME,
    eventDate: EVENT_DATE,
    issuedAt: existingIndex !== -1 ? certs[existingIndex].issuedAt : new Date().toISOString(),
    status: 'issued',
    verificationUrl,
  };

  if (existingIndex !== -1) {
    certs[existingIndex] = certData;
  } else {
    certs.unshift(certData);
  }

  saveStoredCertificates(certs);

  return {
    certificate: certData,
    isExisting,
  };
}

/**
 * Fetch all certificates for administrative management.
 */
export async function fetchAllCertificates(): Promise<CertificateData[]> {
  const certs = getStoredCertificates();
  return [...certs].sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime());
}

/**
 * Update certificate status (Revoke or Re-issue).
 */
export async function updateCertificateStatus(
  certificateId: string,
  newStatus: CertificateStatus,
  reason?: string
): Promise<void> {
  const certs = getStoredCertificates();
  const index = certs.findIndex((c) => c.certificateId.toUpperCase() === certificateId.toUpperCase());
  if (index === -1) {
    throw new Error(`Certificate ${certificateId} not found`);
  }

  certs[index] = {
    ...certs[index],
    status: newStatus,
    ...(newStatus === 'revoked'
      ? {
          revokedAt: new Date().toISOString(),
          revocationReason: reason || 'Administrative revocation',
        }
      : {
          revokedAt: undefined,
          revocationReason: undefined,
        }),
  };

  saveStoredCertificates(certs);
}

/**
 * Bulk import participants from parsed CSV data.
 */
export async function importParticipantsBatch(
  participants: Array<{
    title?: string;
    fullName: string;
    department: string;
    teamName: string;
    email: string;
    mobile?: string;
  }>
): Promise<{ added: number; skipped: number; errors: string[] }> {
  let added = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const p of participants) {
    try {
      if (!p.fullName || !p.email) {
        skipped++;
        continue;
      }
      const title: any = (p.title === 'Ms.' || p.title === 'Dr.') ? p.title : 'Mr.';
      const res = await issueCertificate({
        title,
        fullName: p.fullName,
        department: p.department || 'Engineering',
        teamName: p.teamName || 'Startathon Participant',
        email: p.email,
        mobile: p.mobile || '',
      });

      if (res.isExisting) {
        skipped++;
      } else {
        added++;
      }
    } catch (e: any) {
      errors.push(`Row for ${p.fullName} (${p.email}): ${e?.message || 'Error'}`);
    }
  }

  return { added, skipped, errors };
}

/**
 * Export complete registry as JSON backup.
 */
export function exportCertificatesBackup(): string {
  return JSON.stringify(getStoredCertificates(), null, 2);
}

/**
 * Restore registry from JSON backup.
 */
export function restoreCertificatesBackup(jsonString: string): number {
  const parsed = JSON.parse(jsonString);
  if (!Array.isArray(parsed)) throw new Error('Invalid backup format: expected an array');
  saveStoredCertificates(parsed);
  return parsed.length;
}
