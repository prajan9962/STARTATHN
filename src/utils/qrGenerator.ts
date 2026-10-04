import QRCode from 'qrcode';

export async function generateVerificationQRCode(certificateId: string): Promise<string> {
  const envBaseUrl = import.meta.env.VITE_APP_BASE_URL;
  const baseUrl = (envBaseUrl && envBaseUrl.trim() !== '') 
    ? envBaseUrl.replace(/\/+$/, '') 
    : (typeof window !== 'undefined' ? window.location.origin : 'https://startathon-2026.vercel.app');

  const verificationUrl = `${baseUrl}/verify/${encodeURIComponent(certificateId)}`;

  try {
    const dataUrl = await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 256,
      color: {
        dark: '#0B192C', // Deep navy matching certificate palette
        light: '#FFFFFF'
      }
    });
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate QR Code:', err);
    // Fallback simple QR
    return await QRCode.toDataURL(verificationUrl);
  }
}

export function getVerificationUrl(certificateId: string): string {
  const envBaseUrl = import.meta.env.VITE_APP_BASE_URL;
  const baseUrl = (envBaseUrl && envBaseUrl.trim() !== '') 
    ? envBaseUrl.replace(/\/+$/, '') 
    : (typeof window !== 'undefined' ? window.location.origin : 'https://startathon-2026.vercel.app');

  return `${baseUrl}/verify/${encodeURIComponent(certificateId)}`;
}
