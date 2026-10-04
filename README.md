# STARTATHON 2026 – E-Certificate Generator

Official Web Application & E-Certificate Generation Portal for **STARTATHON 2026**, organized by the **Students' Council**, **St. Joseph College of Engineering** held on **25 September 2026 (Friday)**.

---

## 🌟 Key Features

1. **Zero-Configuration, Pure Web Architecture**:
   - Zero Firebase requirement. No external database setups, no cloud billing, no console setup.
   - 100% ready for instant deployment to Vercel, Netlify, Cloudflare Pages, or static hosting.

2. **Automated Participant Workflow**:
   - Participants enter Title (Mr. / Ms. / Dr.), Full Name, Department, Team Name, and Email.
   - Intelligent text normalization (e.g. `"prajan l"` becomes `"Prajan L"`).
   - Instant duplicate detection: prevents issuing multiple certificate IDs for the same participant email.

3. **Official Certificate Background & Precision Overlay**:
   - Dynamic overlay placed precisely on blank lines for Participant Name, Department, Team Name, and sequential Certificate ID.
   - Built-in Visual Overlay Calibrator in the Admin Panel for micro-adjusting coordinates.

4. **Tamper-Proof Verification & QR Codes**:
   - Every certificate receives a unique sequence ID: `START26-0001`, `START26-0002`, etc.
   - Dynamic high-resolution QR code embedded onto the certificate pointing to `/verify/[CERTIFICATE_ID]`.
   - Public verification page displaying authenticity status, event details, and tamper checks.

5. **High-Resolution PDF & PNG Downloads**:
   - Client-side A4 landscape PDF generation using `jsPDF` and HTML5 Canvas.
   - Clean filename convention: `STARTATHON_2026_[CERTIFICATE_ID]_[NAME].pdf`.
   - Zero website UI captured in PDF — only the pristine certificate.

6. **Administrative Management Portal (`/admin`)**:
   - Passcode protected (`admin2026`).
   - Real-time search by participant name, certificate ID, department, or team.
   - Revoke / Restore certificate controls with immediate propagation to public verification.
   - Export certificate registry as CSV.
   - Bulk participant import via CSV (supporting Google Forms / Sheets exports).
   - Full JSON Backup & Restore for easy migration and data backup.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portal.

### 3. Build for Production
```bash
npm run build
```

---

## 📄 File Structure
```
startathon-certificate/
├── src/
│   ├── components/
│   │   ├── CertificateCard.tsx       # Live canvas preview & renderer
│   │   ├── CertificatePreviewModal.tsx# Success celebration modal
│   │   ├── ExistingCertificateModal.tsx# Duplicate notice & download
│   │   ├── Footer.tsx                # Event branding & organizer info
│   │   ├── Header.tsx                # Collegiate navigation bar
│   │   └── TemplateCalibrator.tsx    # Admin visual alignment tool
│   ├── pages/
│   │   ├── AdminPage.tsx             # Protected admin panel & CSV tools
│   │   ├── LandingPage.tsx           # Participant generation portal
│   │   └── VerificationPage.tsx      # Public /verify/:id verification screen
│   ├── services/
│   │   └── certificateService.ts     # Sequential sequence counter & CRUD
│   ├── types/
│   │   └── certificate.ts            # Data models & interfaces
│   ├── utils/
│   │   ├── normalization.ts          # Title case & filename sanitizer
│   │   ├── overlayConfig.ts          # Coordinate storage & persistence
│   │   ├── pdfGenerator.ts           # A4 landscape PDF engine
│   │   └── qrGenerator.ts            # QR code creation utility
│   ├── App.tsx                       # Main router & state manager
│   ├── index.css                     # Tailwind styling & typography
│   └── main.tsx                      # React root entry
│
├── public/
│   ├── certificate-template.png      # Official background template
│   └── certificate-template.jpg
├── .env.example
├── vercel.json                       # Vercel SPA routing configuration
├── SETUP.md                          # Quick deployment guide
├── README.md
└── package.json
```

---

## 🏫 Event Details
- **Event**: STARTATHON 2026
- **Organized By**: Students' Council, St. Joseph College of Engineering
- **Date**: 25 September 2026 (Friday)
- **Certificate Type**: Certificate of Participation
