# Bid Sahayak: frontend prototype

AI-assisted bid compliance verification for government procurement.
Smart India Hackathon 2026 · SIH26100 · Team GitWinnit, IIT Mandi.

**This is a demo / proof of concept.** Tender analysis, OCR, document extraction and
government-portal verification are simulated in the browser with mock data from
`src/data/mock.js`. No backend is needed. All companies, IDs and verification
responses are fictional.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
```

Other scripts:

```bash
npm run build         # static build in dist/ (needs SPA fallback to index.html on the host)
npm run build:single  # one self-contained HTML file in dist-single/ (hash routing; opens from disk)
```

Demo state (decisions, uploads, confirmations) is kept for the browser tab. Reset it from
**Settings → Reset demo data**.

## Demo script

**Officer** (about 4 minutes)

1. `/` → Continue as Procurement Officer → Login (credentials are prefilled)
2. Dashboard → **Create New Tender** → *Use sample: Network_Equipment_Tender.pdf* → **Analyze Tender**
3. Requirements: edit one, then **Confirm Requirements & Open for Bids**
4. Bid Evaluation → **Apex Systems Pvt Ltd** (82%, medium risk)
5. **View Detailed Verification** to see the pipeline run and the source cards
6. **View Compliance Assessment** → open REQ-002 (turnover calculation), then REQ-003 (flagged) → **Request Clarification**
7. **Proceed to Officer Review** → add a comment → **Approve Compliance** → confirm
8. **Audit Trail** shows every step, including yours → **Export Audit Report**

**Bidder** (about 2 minutes)

1. `/` → Continue as Bidder → Login
2. Available Tenders → Supply of Network Equipment → **Start Bid Submission**
3. Upload the **GST Certificate** and **OEM Authorization** (use the sample file) and check the extracted fields
4. **Review & submit** → tick the declaration → **Submit Bid** → BID-2026-041
5. **Track Verification Status**. If the officer approved or asked for clarification in the same tab, it shows here.

## Structure

```
src/
  components/   Logo, StatusBadge, StatCard, DataTable, Modal/ConfirmDialog, Toast,
                FileUpload, ProcessSteps (vertical + horizontal), RequirementCard,
                VerificationCard, ActivityTimeline, EmptyState/Loading, Breadcrumbs, Charts
  context/      DemoContext: shared demo state (reducer) + assessment helpers
  data/         mock.js: tenders, requirements, bids, evidence, audit log, reports
  layouts/      PublicLayout, AuthLayout, AppLayout (sidebar + top bar, officer/bidder)
  pages/
    public/     Landing, PortalIntro, NotFound
    officer/    Login, Register, VerificationPending, Dashboard, Tenders, CreateTender,
                TenderDetail, Requirements, Bids, BidDetail, Verification, Compliance,
                Review, Reviews, Audit, Reports, Settings
    bidder/     Login, Register, Dashboard, Bids, Tenders, TenderDetail, Documents,
                Submission, Status, Profile, Settings
  styles/       global.css (design tokens + all component styles, plain CSS)
  utils/        format.js (₹ formatting, status tones), useSteps.js (simulated processing)
```

Dependencies: React 18, React Router 6, lucide-react, IBM Plex Sans (self-hosted via @fontsource).

## Connecting the real backend later

The authentication module from the same team (FastAPI + PostgreSQL) exposes `/api/auth/*`.
To wire it in, replace the mock sign-in in `pages/*/Login.jsx` and `Register.jsx`, and
swap the `useDemo()` selectors for API calls page by page. Everything else can stay as is.
