export type TitleType = 'Mr.' | 'Ms.' | 'Dr.';
export type CertificateStatus = 'issued' | 'revoked';

export interface CertificateData {
  certificateId: string;
  title: TitleType;
  fullName: string;
  department: string;
  teamName: string;
  email: string;
  mobile?: string;
  eventName: string;
  eventDate: string;
  issuedAt: string;
  status: CertificateStatus;
  verificationUrl: string;
  revokedAt?: string;
  revocationReason?: string;
}

export interface CertificateFormInputs {
  title: TitleType;
  fullName: string;
  department: string;
  teamName: string;
  email: string;
  mobile?: string;
  certificateId?: string;
}

export interface OverlayCoordinates {
  // Percentages relative to image width/height (0 - 100)
  name: { x: number; y: number; fontSize: number; align: 'center' | 'left' | 'right' };
  department: { x: number; y: number; fontSize: number; align: 'center' | 'left' };
  team: { x: number; y: number; fontSize: number; align: 'center' | 'left' };
  certId: { x: number; y: number; fontSize: number; align: 'left' | 'right' };
  qrCode: { x: number; y: number; size: number };
}
