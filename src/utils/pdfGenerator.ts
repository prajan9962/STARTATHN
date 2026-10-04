import jsPDF from 'jspdf';
import { CertificateData } from '../types/certificate';
import { generateVerificationQRCode } from './qrGenerator';
import { getOverlayCoordinates } from './overlayConfig';
import { sanitizeFilename } from './normalization';

export interface RenderCertificateOptions {
  certificate: CertificateData;
  canvas?: HTMLCanvasElement;
  customTemplateUrl?: string;
}

/**
 * Draws the certificate onto an HTML5 Canvas with high DPI and renders all dynamic text and QR.
 * The template background image has all underline bars and bottom signature lines permanently removed.
 * Text is placed with generous breathing room ~2cm upward in royal navy.
 */
export async function renderCertificateToCanvas(
  options: RenderCertificateOptions
): Promise<HTMLCanvasElement> {
  const { certificate, customTemplateUrl } = options;
  const canvas = options.canvas || document.createElement('canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Could not obtain canvas 2D context');

  // Load template image (with cache-busting timestamp so browser reloads clean template immediately)
  const baseTemplateUrl = customTemplateUrl || '/certificate-template.png';
  const templateUrl = baseTemplateUrl.includes('?')
    ? baseTemplateUrl
    : `${baseTemplateUrl}?v=${Date.now()}`;

  const img = new Image();
  img.crossOrigin = 'anonymous';

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => {
      if (!customTemplateUrl && baseTemplateUrl.endsWith('.png')) {
        img.src = `/certificate-template.jpg?v=${Date.now()}`;
      } else {
        reject(new Error(`Failed to load certificate template image from ${templateUrl}`));
      }
    };
    img.src = templateUrl;
  });

  // Target high-resolution canvas (matching natural image resolution)
  const targetWidth = Math.max(img.naturalWidth || 1920, 1920);
  const targetHeight = Math.max(
    img.naturalHeight || 1440,
    Math.round(targetWidth * (img.naturalHeight / img.naturalWidth))
  );

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  // 1. Draw template background (pristine template without underlines or signatures)
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  // 2. Fetch coordinates configuration (text raised ~2cm upward)
  const coords = getOverlayCoordinates();
  const scale = targetWidth / 1200;

  // Text Rendering Configuration
  ctx.fillStyle = '#0B192C'; // Rich royal navy
  ctx.textBaseline = 'middle'; // Center text vertically in the clean open space

  // 3. Render Participant Name (raised ~2cm upward, elegant serif)
  const nameToDisplay = certificate.title === 'Dr.'
    ? `Dr. ${certificate.fullName}`
    : certificate.fullName;

  const nameFontSize = Math.round(coords.name.fontSize * scale * 1.2);
  ctx.font = `bold ${nameFontSize}px 'Playfair Display', 'Cinzel', Georgia, serif`;
  ctx.textAlign = coords.name.align;
  const nameX = (coords.name.x / 100) * targetWidth;
  const nameY = (coords.name.y / 100) * targetHeight;
  ctx.fillText(nameToDisplay, nameX, nameY);

  // 4. Render Department (raised ~2cm upward)
  const deptFontSize = Math.round(coords.department.fontSize * scale * 1.05);
  ctx.font = `600 ${deptFontSize}px 'Montserrat', 'Inter', Arial, sans-serif`;
  ctx.textAlign = coords.department.align;
  const deptX = (coords.department.x / 100) * targetWidth;
  const deptY = (coords.department.y / 100) * targetHeight;
  ctx.fillText(certificate.department, deptX, deptY);

  // 5. Render Team Name (raised ~2cm upward)
  const teamFontSize = Math.round(coords.team.fontSize * scale * 1.05);
  ctx.font = `600 ${teamFontSize}px 'Montserrat', 'Inter', Arial, sans-serif`;
  ctx.textAlign = coords.team.align;
  const teamX = (coords.team.x / 100) * targetWidth;
  const teamY = (coords.team.y / 100) * targetHeight;
  ctx.fillText(certificate.teamName, teamX, teamY);

  // 6. Render Certificate ID (unobtrusive, official credential number)
  const certIdFontSize = Math.round(coords.certId.fontSize * scale);
  ctx.font = `600 ${certIdFontSize}px 'Montserrat', monospace, sans-serif`;
  ctx.textAlign = coords.certId.align;
  ctx.fillStyle = '#1E3A8A';
  const certIdX = (coords.certId.x / 100) * targetWidth;
  const certIdY = (coords.certId.y / 100) * targetHeight;
  ctx.fillText(`ID: ${certificate.certificateId}`, certIdX, certIdY);

  // 7. Render QR Code (positioned in clean lower-right quadrant, well inside borders)
  try {
    const qrDataUrl = await generateVerificationQRCode(certificate.certificateId);
    const qrImg = new Image();
    await new Promise<void>((resolve, reject) => {
      qrImg.onload = () => resolve();
      qrImg.onerror = reject;
      qrImg.src = qrDataUrl;
    });

    const qrSize = (coords.qrCode.size / 100) * targetWidth;
    const qrX = (coords.qrCode.x / 100) * targetWidth - (qrSize / 2);
    const qrY = (coords.qrCode.y / 100) * targetHeight - (qrSize / 2);

    // Crisp card backing for QR code
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8, 4);
    ctx.fill();
    ctx.strokeStyle = '#D4AF37'; // Subtle gold border
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

    // Caption below QR
    ctx.fillStyle = '#475569';
    ctx.font = `600 ${Math.round(8 * scale)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('Scan to Verify', qrX + qrSize / 2, qrY + qrSize + 6 * scale);
  } catch (err) {
    console.warn('Failed to draw QR code onto certificate:', err);
  }

  return canvas;
}

/**
 * Generates and triggers download of a high-quality A4 landscape PDF.
 */
export async function downloadCertificatePDF(
  certificate: CertificateData,
  customTemplateUrl?: string
): Promise<void> {
  const canvas = await renderCertificateToCanvas({ certificate, customTemplateUrl });

  // A4 Landscape dimensions in mm: 297mm x 210mm
  const pdfWidth = 297;
  const pdfHeight = 210;

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const canvasAspect = canvas.width / canvas.height;
  const pageAspect = pdfWidth / pdfHeight;

  let renderWidth = pdfWidth;
  let renderHeight = pdfHeight;
  let offsetX = 0;
  let offsetY = 0;

  // Fit canvas within A4 maintaining aspect ratio without distortion
  if (canvasAspect > pageAspect) {
    renderHeight = pdfWidth / canvasAspect;
    offsetY = (pdfHeight - renderHeight) / 2;
  } else {
    renderWidth = pdfHeight * canvasAspect;
    offsetX = (pdfWidth - renderWidth) / 2;
  }

  // Convert canvas to image
  const imgData = canvas.toDataURL('image/jpeg', 0.95);

  pdf.addImage(imgData, 'JPEG', offsetX, offsetY, renderWidth, renderHeight, undefined, 'FAST');

  const filename = sanitizeFilename(certificate.certificateId, certificate.fullName);
  pdf.save(filename);
}

/**
 * Downloads high-res PNG version of the certificate.
 */
export async function downloadCertificatePNG(
  certificate: CertificateData,
  customTemplateUrl?: string
): Promise<void> {
  const canvas = await renderCertificateToCanvas({ certificate, customTemplateUrl });
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = sanitizeFilename(certificate.certificateId, certificate.fullName).replace(/\.pdf$/, '.png');
  link.href = dataUrl;
  link.click();
}
