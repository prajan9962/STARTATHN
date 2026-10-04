# STARTATHON 2026 – E-Certificate Generator
## Complete Deployment & Usage Guide (Zero-Configuration)

This application is built with a pure, high-performance client-side architecture. It requires **no external database, no Firebase, and no backend provisioning**. It can be deployed directly to Vercel in 1 click.

---

### 1. Run the Application Locally
1. Clone or open the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:3000`.

---

### 2. Deploy Directly to Vercel
1. Push this repository to your GitHub, GitLab, or Bitbucket account.
2. Log into [Vercel](https://vercel.com/) and click **Add New** → **Project**.
3. Import your repository.
4. Framework Preset: **Vite** (automatically detected).
5. (Optional) Set Environment Variable:
   - `VITE_APP_BASE_URL` = `https://your-project.vercel.app`
   *(If not set, the app automatically uses the live browser domain `window.location.origin`)*
6. Click **Deploy**.
7. Your app is live! Direct routes like `/verify/START26-0001` and `/admin` work immediately thanks to `vercel.json`.

---

### 3. Administrator Access
- Access the admin portal at `/admin`.
- Default administrator passcode: `admin2026` (or `startathon2026`).
- Admin Features:
  - View all registered and issued certificates.
  - Search by Name, Certificate ID, Department, or Team.
  - Revoke or restore certificates.
  - Download individual high-res A4 landscape PDFs.
  - Export all certificate records as CSV.
  - Batch import participants from Google Forms / Sheets CSV.
  - Micro-adjust overlay coordinates using the visual calibrator.
  - Full database JSON Backup and Restore.
