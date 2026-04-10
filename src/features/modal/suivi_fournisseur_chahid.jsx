import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA PARSED FROM PDF ───────────────────────────────────────────
const PDF_RAW_DATA = [
  // Existing data already in the spreadsheet (up to July 14, 2025)
  // We start from where the spreadsheet ends
  // NEW entries from July 28, 2025 onwards
  { date: "28/07/2025", article: "10002", designation: "CIMENT CPA G", qty: 40, prix: 19.1, ttc: 764.0 },
  { date: "28/07/2025", article: "70005", designation: "BRIQUE DE 12", qty: 152, prix: 0.85, ttc: 129.148 },
  { date: "12/08/2025", article: "10002", designation: "CIMENT CPA G", qty: 40, prix: 19.1, ttc: 764.0 },
  { date: "27/08/2025", article: "10002", designation: "CIMENT CPA G", qty: 20, prix: 19.0, ttc: 380.0 },
  { date: "10/09/2025", article: "10002", designation: "CIMENT CPA G", qty: 40, prix: 19.0, ttc: 759.999 },
  { date: "14/09/2025", article: "30010", designation: "GRILLAGE 30CM", qty: 1, prix: 23.0, ttc: 23.0 },
  { date: "15/09/2025", article: "10012", designation: "FRAIS DE TRANSPORT", qty: 1, prix: 10.0, ttc: 10.0 },
  { date: "15/09/2025", article: "70005", designation: "BRIQUE DE 12", qty: 152, prix: 0.85, ttc: 129.148 },
  { date: "24/09/2025", article: "10002", designation: "CIMENT CPA G", qty: 20, prix: 19.2, ttc: 384.0 },
  { date: "24/09/2025", article: "70005", designation: "BRIQUE DE 12", qty: 152, prix: 0.85, ttc: 129.148 },
  { date: "05/10/2025", article: "10002", designation: "CIMENT CPA G", qty: 40, prix: 19.2, ttc: 768.0 },
  { date: "13/10/2025", article: "00001", designation: "FER DE 12", qty: 5, prix: 25.7, ttc: 128.5 },
  { date: "13/10/2025", article: "00002", designation: "FER DE 10", qty: 50, prix: 18.5, ttc: 925.0 },
  { date: "13/10/2025", article: "00004", designation: "FER DE 6", qty: 10, prix: 3.1, ttc: 31.0 },
  { date: "13/10/2025", article: "00014", designation: "FIL D'ATTACHE", qty: 10, prix: 5.0, ttc: 50.0 },
  { date: "18/10/2025", article: "10002", designation: "CIMENT CPA G", qty: 80, prix: 19.2, ttc: 1536.0 },
  { date: "19/10/2025", article: "00012", designation: "BERLET GRAVIER BLEU SANS T", qty: 2, prix: 440.0, ttc: 880.0 },
  { date: "19/10/2025", article: "30023", designation: "BERLET DWIRETTE SANS T", qty: 2, prix: 330.0, ttc: 660.0 },
  { date: "21/10/2025", article: "10002", designation: "CIMENT CPA G", qty: 20, prix: 19.2, ttc: 384.0 },
  { date: "21/10/2025", article: "10002", designation: "CIMENT CPA G", qty: 40, prix: 19.2, ttc: 768.0 },
  { date: "30/11/2025", article: "10012", designation: "FRAIS DE TRANSPORT", qty: 1, prix: 10.0, ttc: 10.0 },
  { date: "30/11/2025", article: "70003", designation: "BRIQUE de 12 BCM", qty: 296, prix: 0.92, ttc: 272.282 },
  { date: "11/12/2025", article: "10002", designation: "CIMENT CPA G", qty: 20, prix: 18.75, ttc: 375.0 },
  { date: "11/12/2025", article: "20003", designation: "BRIQUE DE 6", qty: 60, prix: 0.4, ttc: 23.99 },
  { date: "16/12/2025", article: "30005", designation: "SIKA POUDRE OR 1 KG", qty: 20, prix: 9.5, ttc: 189.995 },
  { date: "16/12/2025", article: "90054", designation: "SIKAFLEX PRO 11 FC BLANC 300ML", qty: 1, prix: 25.0, ttc: 25.0 },
  { date: "16/12/2025", article: "FA01010012", designation: "SIKA LATEX ETANCHE 20L", qty: 1, prix: 300.0, ttc: 300.0 },
  { date: "16/12/2025", article: "FA01010021", designation: "CIMENT HRS GABES", qty: 20, prix: 20.5, ttc: 410.0 },
  { date: "23/12/2025", article: "10002", designation: "CIMENT CPA G", qty: 20, prix: 18.8, ttc: 376.0 },
  { date: "25/12/2025", article: "10012", designation: "FRAIS DE TRANSPORT", qty: 1, prix: 10.0, ttc: 10.0 },
  { date: "25/12/2025", article: "20004", designation: "BRIQUE PLATERIELLE", qty: 200, prix: 0.8, ttc: 159.936 },
  { date: "30/12/2025", article: "10012", designation: "FRAIS DE TRANSPORT", qty: 1, prix: 10.0, ttc: 10.0 },
  { date: "30/12/2025", article: "70005", designation: "BRIQUE DE 12", qty: 70, prix: 0.9, ttc: 62.975 },
  { date: "07/01/2026", article: "10002", designation: "CIMENT CPA G", qty: 20, prix: 19.25, ttc: 385.0 },
  { date: "11/01/2026", article: "30023", designation: "BERLET DWIRETTE SANS T", qty: 1, prix: 350.0, ttc: 350.0 },
  { date: "11/01/2026", article: "90008", designation: "BERLRT BEN GERDAN SANS T", qty: 1, prix: 300.0, ttc: 300.0 },
  { date: "11/01/2026", article: "10002", designation: "CIMENT CPA G", qty: 60, prix: 19.25, ttc: 1155.0 },
  { date: "24/01/2026", article: "10002", designation: "CIMENT CPA G", qty: 60, prix: 19.25, ttc: 1155.0 },
  { date: "25/01/2026", article: "30023", designation: "BERLET DWIRETTE SANS T", qty: 1, prix: 350.0, ttc: 350.0 },
  { date: "25/01/2026", article: "10002", designation: "CIMENT CPA G", qty: 40, prix: 19.25, ttc: 770.0 },
  { date: "25/01/2026", article: "00012", designation: "BERLET GRAVIER BLEU SANS T", qty: 1, prix: 440.0, ttc: 440.0 },
  { date: "28/01/2026", article: "30023", designation: "BERLET DWIRETTE SANS T", qty: 1, prix: 350.0, ttc: 350.0 },
  { date: "28/01/2026", article: "10002", designation: "CIMENT CPA G", qty: 60, prix: 19.25, ttc: 1155.0 },
];

const PDF_PAYMENTS = [
  { ref: "AC24/00755", date: "08/05/2024", montant: 20000 },
  { ref: "AC24/01141", date: "24/07/2024", montant: 12000 },
  { ref: "AC24/01173", date: "01/08/2024", montant: 7920 },
  { ref: "AC24/01315", date: "28/08/2024", montant: 10000 },
  { ref: "AC24/01347", date: "03/09/2024", montant: 13000 },
  { ref: "AC24/01459", date: "24/09/2024", montant: 7000 },
  { ref: "AC24/01672", date: "24/10/2024", montant: 6700 },
  { ref: "AC24/01837", date: "25/11/2024", montant: 4000 },
  { ref: "AC24/02009", date: "21/12/2024", montant: 11260 },
  { ref: "AC24/02214", date: "23/01/2025", montant: 3100 },
  { ref: "AC25/00202", date: "04/03/2025", montant: 3248 },
  { ref: "AC25/00203", date: "04/03/2025", montant: 20 },
  { ref: "AC25/00543", date: "20/05/2025", montant: 3000 },
  { ref: "AC25/00544", date: "20/05/2025", montant: 115 },
  { ref: "AC25/00777", date: "21/07/2025", montant: 4450 },
  { ref: "AC25/00975", date: "01/09/2025", montant: 2000 },
  { ref: "AC25/00976", date: "01/09/2025", montant: 38.912 },
  { ref: "AC25/01159", date: "06/10/2025", montant: 2200 },
  { ref: "AC25/01284", date: "29/10/2025", montant: 5300 },
  { ref: "AC25/01287", date: "29/10/2025", montant: 65.795 },
  { ref: "AC25/01577", date: "31/12/2025", montant: 2200 },
];

const TOTAL_ACHATS = 124707.483;
const TOTAL_AVANCES = 117617.707;
const SOLDE_RESTANT = 7089.776;
const SOLDE_CLIENT = 6435.178;

// Categorize items
function categorize(designation) {
  const d = designation.toUpperCase();
  if (d.includes("FER DE") || d.includes("FIL D'ATTACHE")) return "Fer / Acier";
  if (d.includes("CIMENT") || d.includes("HRS")) return "Ciment";
  if (d.includes("BRIQUE") || d.includes("HOURDI")) return "Briques";
  if (d.includes("GRAVIER") || d.includes("BERLET") || d.includes("BERLRT") || d.includes("SEMI GRAVIER")) return "Gravier / Sable";
  if (d.includes("DWIRETTE") || d.includes("SEMI DWIRETTE")) return "Dwirette";
  if (d.includes("SIKA") || d.includes("SIKADUR") || d.includes("SIKAFLEX") || d.includes("LATEX")) return "Sika / Adjuvants";
  if (d.includes("CLOUX")) return "Clous";
  if (d.includes("PLATRE")) return "Plâtre";
  if (d.includes("PLASTIC") || d.includes("GRILLAGE")) return "Divers";
  if (d.includes("TRES A SOUDER")) return "Tige à souder";
  if (d.includes("TRANSPORT")) return "Transport";
  if (d.includes("VIDE")) return "Divers";
  if (d.includes("GROS BITON") || d.includes("Semi Gros")) return "Gravier / Sable";
  return "Divers";
}

const CAT_COLORS = {
  "Fer / Acier": "#E8533F",
  "Ciment": "#3B82F6",
  "Briques": "#F59E0B",
  "Gravier / Sable": "#8B5CF6",
  "Dwirette": "#10B981",
  "Sika / Adjuvants": "#EC4899",
  "Clous": "#6B7280",
  "Plâtre": "#F97316",
  "Divers": "#94A3B8",
  "Tige à souder": "#14B8A6",
  "Transport": "#A78BFA",
};

const CAT_ICONS = {
  "Fer / Acier": "🔩",
  "Ciment": "🧱",
  "Briques": "🏗️",
  "Gravier / Sable": "⛰️",
  "Dwirette": "🚚",
  "Sika / Adjuvants": "🧪",
  "Clous": "📌",
  "Plâtre": "🪣",
  "Divers": "📦",
  "Tige à souder": "⚡",
  "Transport": "🚛",
};

function formatNumber(n) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

function formatMoney(n) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// ─── COMPONENTS ─────────────────────────────────────────────────────

function ProgressRing({ percent, size = 100, stroke = 8, color = "#3B82F6" }) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--ring-bg)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)" }}
      />
    </svg>
  );
}

function MiniBar({ items, total }) {
  return (
    <div style={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden", background: "var(--bar-bg)", gap: 1 }}>
      {items.map((it, i) => (
        <div key={i} style={{ width: `${(it.value / total) * 100}%`, background: it.color, minWidth: it.value > 0 ? 2 : 0 }} />
      ))}
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────────────

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0); // 0=landing, 1=parsing, 2=review, 3=categories, 4=payments, 5=confirm
  const [parseProgress, setParseProgress] = useState(0);
  const [selectedItems, setSelectedItems] = useState(new Set(PDF_RAW_DATA.map((_, i) => i)));
  const [activeTab, setActiveTab] = useState("new");
  const [confirmed, setConfirmed] = useState(false);
  const modalRef = useRef(null);

  // Parse animation
  useEffect(() => {
    if (step === 1) {
      let p = 0;
      const iv = setInterval(() => {
        p += Math.random() * 15 + 5;
        if (p >= 100) { p = 100; clearInterval(iv); setTimeout(() => setStep(2), 400); }
        setParseProgress(p);
      }, 200);
      return () => clearInterval(iv);
    }
  }, [step]);

  const toggleItem = useCallback((idx) => {
    setSelectedItems(prev => {
      const s = new Set(prev);
      s.has(idx) ? s.delete(idx) : s.add(idx);
      return s;
    });
  }, []);

  const selectedData = PDF_RAW_DATA.filter((_, i) => selectedItems.has(i));
  const totalSelected = selectedData.reduce((s, it) => s + it.ttc, 0);

  // Category breakdown
  const catBreakdown = {};
  selectedData.forEach(it => {
    const cat = categorize(it.designation);
    if (!catBreakdown[cat]) catBreakdown[cat] = { total: 0, count: 0 };
    catBreakdown[cat].total += it.ttc;
    catBreakdown[cat].count += 1;
  });
  const catArray = Object.entries(catBreakdown).sort((a, b) => b[1].total - a[1].total);

  const payPercent = Math.min((TOTAL_AVANCES / TOTAL_ACHATS) * 100, 100);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        :root {
          --bg-app: #0C0E14;
          --bg-card: #141620;
          --bg-card-hover: #1A1D2B;
          --bg-sheet: #181B27;
          --bg-input: #1E2231;
          --border: #252A3A;
          --border-light: #2D3348;
          --text-primary: #F0F2F8;
          --text-secondary: #8B92A8;
          --text-muted: #5C6380;
          --accent: #4F7CFF;
          --accent-glow: rgba(79,124,255,.25);
          --accent-soft: rgba(79,124,255,.12);
          --green: #2DD4A0;
          --green-soft: rgba(45,212,160,.12);
          --red: #F06050;
          --red-soft: rgba(240,96,80,.12);
          --orange: #F5A623;
          --ring-bg: #252A3A;
          --bar-bg: #252A3A;
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; background: var(--bg-app); color: var(--text-primary); }
        
        .landing { 
          min-height: 100vh; display: flex; flex-direction: column; align-items: center; 
          justify-content: center; padding: 24px; gap: 32px;
          background: radial-gradient(ellipse at 50% 0%, rgba(79,124,255,.08) 0%, transparent 60%);
        }

        .supplier-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 28px;
          width: 100%;
          max-width: 420px;
          position: relative;
          overflow: hidden;
        }
        .supplier-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, var(--accent), var(--green));
        }
        
        .import-btn {
          display: flex; align-items: center; gap: 12px;
          background: var(--accent);
          border: none; border-radius: 14px;
          color: white; font-family: inherit; font-weight: 600; font-size: 15px;
          padding: 16px 28px;
          cursor: pointer; width: 100%; max-width: 420px;
          justify-content: center;
          box-shadow: 0 4px 24px var(--accent-glow);
          transition: all .2s;
        }
        .import-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 32px var(--accent-glow); }
        .import-btn:active { transform: scale(.98); }
        
        /* Modal overlay */
        .modal-overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(0,0,0,.7); backdrop-filter: blur(8px);
          display: flex; align-items: flex-end; justify-content: center;
          animation: fadeIn .25s ease;
        }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        
        .modal-sheet {
          background: var(--bg-sheet);
          border-radius: 24px 24px 0 0;
          width: 100%; max-width: 520px;
          max-height: 92vh; overflow-y: auto;
          animation: slideUp .35s cubic-bezier(.2,.9,.3,1);
          padding-bottom: env(safe-area-inset-bottom, 0);
        }
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
        
        .modal-handle {
          width: 36px; height: 4px; border-radius: 2px; background: var(--border-light);
          margin: 12px auto 0;
        }
        .modal-header {
          padding: 20px 24px 16px; display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid var(--border);
        }
        .modal-title { font-size: 18px; font-weight: 700; }
        .modal-close {
          width: 32px; height: 32px; border-radius: 10px; background: var(--bg-input);
          border: none; color: var(--text-secondary); font-size: 18px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }
        .modal-body { padding: 20px 24px 32px; }
        
        /* Parse animation */
        .parse-container { display: flex; flex-direction: column; align-items: center; gap: 24px; padding: 40px 0; }
        .parse-icon { font-size: 48px; animation: bounce 1.5s infinite; }
        @keyframes bounce { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
        .parse-bar { width: 100%; height: 6px; border-radius: 3px; background: var(--bg-input); overflow: hidden; }
        .parse-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, var(--accent), var(--green)); transition: width .3s; }
        
        /* Tabs */
        .tabs { display: flex; gap: 4px; background: var(--bg-input); border-radius: 12px; padding: 4px; margin-bottom: 16px; }
        .tab-btn {
          flex: 1; padding: 10px 12px; border: none; border-radius: 10px; cursor: pointer;
          font-family: inherit; font-size: 13px; font-weight: 600;
          background: transparent; color: var(--text-muted); transition: all .2s;
        }
        .tab-btn.active { background: var(--accent); color: white; }
        
        /* Item rows */
        .item-row {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 0; border-bottom: 1px solid var(--border);
          cursor: pointer; transition: background .15s;
        }
        .item-row:hover { background: var(--bg-card-hover); margin: 0 -24px; padding: 12px 24px; }
        .item-check {
          width: 22px; height: 22px; border-radius: 7px;
          border: 2px solid var(--border-light); flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          transition: all .2s;
        }
        .item-check.checked { background: var(--accent); border-color: var(--accent); }
        .item-info { flex: 1; min-width: 0; }
        .item-name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .item-meta { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
        .item-amount { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 500; text-align: right; white-space: nowrap; }
        
        .cat-tag {
          display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 10px;
          font-weight: 600; letter-spacing: .3px;
        }
        
        /* Summary cards */
        .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
        .summary-box {
          background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px;
          padding: 16px; display: flex; flex-direction: column; gap: 6px;
        }
        .summary-label { font-size: 11px; color: var(--text-muted); font-weight: 500; text-transform: uppercase; letter-spacing: .5px; }
        .summary-value { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 700; }
        .summary-box.full { grid-column: 1 / -1; }
        
        /* Category list */
        .cat-row {
          display: flex; align-items: center; gap: 12px; padding: 14px 0;
          border-bottom: 1px solid var(--border);
        }
        .cat-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
        .cat-info { flex: 1; }
        .cat-name { font-size: 14px; font-weight: 600; }
        .cat-count { font-size: 11px; color: var(--text-muted); }
        .cat-amount { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 600; }
        
        /* Payment row */
        .pay-row {
          display: flex; align-items: center; gap: 12px; padding: 12px 0;
          border-bottom: 1px solid var(--border);
        }
        .pay-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); flex-shrink: 0; }
        .pay-info { flex: 1; }
        .pay-ref { font-size: 12px; font-weight: 600; }
        .pay-date { font-size: 11px; color: var(--text-muted); }
        .pay-amount { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; color: var(--green); }
        
        /* Action buttons */
        .action-btn {
          width: 100%; padding: 16px; border: none; border-radius: 14px;
          font-family: inherit; font-weight: 700; font-size: 15px;
          cursor: pointer; transition: all .2s; margin-top: 12px;
        }
        .action-primary { background: var(--accent); color: white; box-shadow: 0 4px 20px var(--accent-glow); }
        .action-primary:hover { box-shadow: 0 8px 32px var(--accent-glow); }
        .action-secondary { background: var(--bg-input); color: var(--text-secondary); }
        .action-success { background: var(--green); color: #0C0E14; }
        
        /* Confirmed */
        .confirmed-container { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 40px 0; }
        .confirmed-icon { font-size: 56px; animation: popIn .5s cubic-bezier(.2,1,.3,1); }
        @keyframes popIn { 0% { transform: scale(0) rotate(-10deg) } 100% { transform: scale(1) rotate(0) } }
        
        .badge { 
          display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px;
          border-radius: 8px; font-size: 11px; font-weight: 600; 
        }
        .badge-green { background: var(--green-soft); color: var(--green); }
        .badge-red { background: var(--red-soft); color: var(--red); }
        .badge-blue { background: var(--accent-soft); color: var(--accent); }
        
        .step-dots { display: flex; gap: 6px; justify-content: center; margin: 16px 0 4px; }
        .step-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--border-light); transition: all .3s; }
        .step-dot.active { background: var(--accent); width: 20px; border-radius: 3px; }

        .scroll-area { max-height: 45vh; overflow-y: auto; margin: 0 -24px; padding: 0 24px; }
        .scroll-area::-webkit-scrollbar { width: 3px; }
        .scroll-area::-webkit-scrollbar-track { background: transparent; }
        .scroll-area::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 2px; }
        
        .solde-bar { display: flex; align-items: center; gap: 16px; margin-top: 12px; }
      `}</style>

      <div className="landing">
        {/* Supplier Card */}
        <div className="supplier-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                Fournisseur Matériaux
              </div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>El Chahid</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
                Client : Tawfik Rayes (sayef)
              </div>
            </div>
            <span className="badge badge-red">Solde: {formatMoney(SOLDE_RESTANT)} TND</span>
          </div>

          <div className="summary-grid" style={{ marginBottom: 16 }}>
            <div className="summary-box">
              <span className="summary-label">Total Achats</span>
              <span className="summary-value" style={{ fontSize: 15 }}>{formatMoney(TOTAL_ACHATS)}</span>
            </div>
            <div className="summary-box">
              <span className="summary-label">Total Payé</span>
              <span className="summary-value" style={{ fontSize: 15, color: "var(--green)" }}>{formatMoney(TOTAL_AVANCES)}</span>
            </div>
          </div>

          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6, display: "flex", justifyContent: "space-between" }}>
            <span>Avancement paiements</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--accent)" }}>{payPercent.toFixed(1)}%</span>
          </div>
          <MiniBar
            items={[
              { value: TOTAL_AVANCES, color: "var(--green)" },
              { value: TOTAL_ACHATS - TOTAL_AVANCES, color: "var(--red)" },
            ]}
            total={TOTAL_ACHATS}
          />
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
            Période: 08/05/2024 → 29/01/2026
          </div>
        </div>

        {/* Import Button */}
        <button className="import-btn" onClick={() => { setIsOpen(true); setStep(0); setConfirmed(false); }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Importer relevé fournisseur (PDF)
        </button>

        <div style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", maxWidth: 360, lineHeight: 1.6 }}>
          Importez le fichier <span style={{ color: "var(--accent)", fontWeight: 600 }}>tawfik_rayes1.pdf</span> pour mettre à jour le suivi El Chahid dans votre fichier Excel
        </div>
      </div>

      {/* MODAL */}
      {isOpen && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}>
          <div className="modal-sheet" ref={modalRef}>
            <div className="modal-handle" />
            
            <div className="modal-header">
              <span className="modal-title">
                {step === 0 && "Importer le relevé"}
                {step === 1 && "Analyse en cours..."}
                {step === 2 && "Nouvelles lignes"}
                {step === 3 && "Répartition"}
                {step === 4 && "Paiements"}
                {step === 5 && (confirmed ? "Mis à jour !" : "Confirmation")}
              </span>
              <button className="modal-close" onClick={() => setIsOpen(false)}>✕</button>
            </div>

            {/* Step dots */}
            <div className="step-dots">
              {[0,1,2,3,4,5].map(s => (
                <div key={s} className={`step-dot ${s === step ? "active" : ""}`} style={s <= step ? { background: s === step ? "var(--accent)" : "var(--accent)" } : {}} />
              ))}
            </div>

            <div className="modal-body">

              {/* STEP 0: Upload */}
              {step === 0 && (
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    border: "2px dashed var(--border-light)", borderRadius: 16, padding: "40px 20px",
                    marginBottom: 20, background: "var(--bg-input)",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
                  }}>
                    <div style={{ fontSize: 40 }}>📄</div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>tawfik_rayes1.pdf</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      Fiche Client détaillé — El Chahid<br />
                      15 pages · 124 707 TND
                    </div>
                    <span className="badge badge-blue">Fichier détecté</span>
                  </div>
                  <button className="action-btn action-primary" onClick={() => setStep(1)}>
                    Analyser le document
                  </button>
                </div>
              )}

              {/* STEP 1: Parsing */}
              {step === 1 && (
                <div className="parse-container">
                  <div className="parse-icon">🔍</div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>Extraction des données...</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    Lecture de 15 pages · Identification des nouvelles lignes
                  </div>
                  <div className="parse-bar" style={{ maxWidth: 280 }}>
                    <div className="parse-fill" style={{ width: `${parseProgress}%` }} />
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "var(--accent)" }}>
                    {Math.min(Math.round(parseProgress), 100)}%
                  </div>
                </div>
              )}

              {/* STEP 2: Review items */}
              {step === 2 && (
                <>
                  <div className="summary-grid">
                    <div className="summary-box">
                      <span className="summary-label">Nouvelles lignes</span>
                      <span className="summary-value" style={{ color: "var(--accent)" }}>{PDF_RAW_DATA.length}</span>
                    </div>
                    <div className="summary-box">
                      <span className="summary-label">Montant total</span>
                      <span className="summary-value" style={{ fontSize: 15 }}>{formatNumber(totalSelected)}</span>
                    </div>
                  </div>

                  <div className="tabs">
                    <button className={`tab-btn ${activeTab === "new" ? "active" : ""}`} onClick={() => setActiveTab("new")}>
                      Nouvelles ({selectedItems.size})
                    </button>
                    <button className={`tab-btn ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
                      Toutes ({PDF_RAW_DATA.length})
                    </button>
                  </div>

                  <div className="scroll-area">
                    {PDF_RAW_DATA.map((item, idx) => {
                      const cat = categorize(item.designation);
                      const color = CAT_COLORS[cat] || "#94A3B8";
                      const checked = selectedItems.has(idx);
                      if (activeTab === "new" && !checked) return null;
                      return (
                        <div className="item-row" key={idx} onClick={() => toggleItem(idx)}>
                          <div className={`item-check ${checked ? "checked" : ""}`}>
                            {checked && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>}
                          </div>
                          <div className="item-info">
                            <div className="item-name">{item.designation}</div>
                            <div className="item-meta">
                              {item.date} · Qté: {item.qty} · <span className="cat-tag" style={{ background: color + "18", color }}>{cat}</span>
                            </div>
                          </div>
                          <div className="item-amount">{formatNumber(item.ttc)}</div>
                        </div>
                      );
                    })}
                  </div>

                  <button className="action-btn action-primary" onClick={() => setStep(3)} style={{ marginTop: 16 }}>
                    Voir la répartition →
                  </button>
                </>
              )}

              {/* STEP 3: Categories */}
              {step === 3 && (
                <>
                  <div className="summary-box full" style={{ marginBottom: 16 }}>
                    <span className="summary-label">Total sélectionné</span>
                    <span className="summary-value">{formatNumber(totalSelected)} <span style={{ fontSize: 13, color: "var(--text-muted)" }}>TND</span></span>
                    <MiniBar
                      items={catArray.map(([cat, d]) => ({ value: d.total, color: CAT_COLORS[cat] || "#94A3B8" }))}
                      total={totalSelected}
                    />
                  </div>

                  <div className="scroll-area">
                    {catArray.map(([cat, data]) => {
                      const color = CAT_COLORS[cat] || "#94A3B8";
                      return (
                        <div className="cat-row" key={cat}>
                          <div className="cat-icon" style={{ background: color + "18" }}>
                            {CAT_ICONS[cat] || "📦"}
                          </div>
                          <div className="cat-info">
                            <div className="cat-name">{cat}</div>
                            <div className="cat-count">{data.count} article{data.count > 1 ? "s" : ""} · {((data.total / totalSelected) * 100).toFixed(1)}%</div>
                          </div>
                          <div className="cat-amount" style={{ color }}>{formatMoney(data.total)}</div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                    <button className="action-btn action-secondary" style={{ flex: 1 }} onClick={() => setStep(2)}>← Retour</button>
                    <button className="action-btn action-primary" style={{ flex: 2 }} onClick={() => setStep(4)}>Paiements →</button>
                  </div>
                </>
              )}

              {/* STEP 4: Payments */}
              {step === 4 && (
                <>
                  <div className="summary-grid">
                    <div className="summary-box">
                      <span className="summary-label">Total Avances</span>
                      <span className="summary-value" style={{ color: "var(--green)", fontSize: 16 }}>{formatMoney(TOTAL_AVANCES)}</span>
                    </div>
                    <div className="summary-box">
                      <span className="summary-label">Reste à payer</span>
                      <span className="summary-value" style={{ color: "var(--red)", fontSize: 16 }}>{formatNumber(SOLDE_RESTANT)}</span>
                    </div>
                  </div>

                  <div className="solde-bar">
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <ProgressRing percent={payPercent} size={72} stroke={6} color="var(--green)" />
                      <div style={{
                        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700,
                      }}>
                        {payPercent.toFixed(0)}%
                      </div>
                    </div>
                    <div style={{ flex: 1, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
                      <strong style={{ color: "var(--text-primary)" }}>{PDF_PAYMENTS.length} versements</strong> enregistrés<br />
                      Solde client actuel: <strong style={{ color: "var(--orange)" }}>{formatNumber(SOLDE_CLIENT)} TND</strong>
                    </div>
                  </div>

                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", margin: "16px 0 8px", textTransform: "uppercase", letterSpacing: .5 }}>
                    Historique versements
                  </div>
                  <div className="scroll-area" style={{ maxHeight: "35vh" }}>
                    {PDF_PAYMENTS.map((p, i) => (
                      <div className="pay-row" key={i}>
                        <div className="pay-dot" />
                        <div className="pay-info">
                          <div className="pay-ref">{p.ref}</div>
                          <div className="pay-date">{p.date}</div>
                        </div>
                        <div className="pay-amount">+{formatMoney(p.montant)}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                    <button className="action-btn action-secondary" style={{ flex: 1 }} onClick={() => setStep(3)}>← Retour</button>
                    <button className="action-btn action-primary" style={{ flex: 2 }} onClick={() => setStep(5)}>Confirmer →</button>
                  </div>
                </>
              )}

              {/* STEP 5: Confirm */}
              {step === 5 && !confirmed && (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
                  <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Mettre à jour le suivi ?</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 24 }}>
                    <strong>{selectedItems.size} lignes</strong> seront ajoutées au fichier<br />
                    <span style={{ color: "var(--accent)" }}>rapport_depenses_details_Chahid.xlsx</span><br />
                    et au <span style={{ color: "var(--accent)" }}>Suivi Projet terrain Tazdaine</span>
                  </div>

                  <div className="summary-box full" style={{ textAlign: "left", marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Lignes à ajouter</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{selectedItems.size}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Montant total</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{formatNumber(totalSelected)} TND</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Catégories</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{catArray.length}</span>
                    </div>
                  </div>

                  <button className="action-btn action-success" onClick={() => setConfirmed(true)}>
                    ✓ Confirmer la mise à jour
                  </button>
                  <button className="action-btn action-secondary" onClick={() => setStep(4)}>
                    ← Revenir
                  </button>
                </div>
              )}

              {step === 5 && confirmed && (
                <div className="confirmed-container">
                  <div className="confirmed-icon">✅</div>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>Mise à jour réussie !</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", textAlign: "center", lineHeight: 1.6 }}>
                    {selectedItems.size} lignes ajoutées au suivi fournisseur El Chahid
                  </div>
                  <div className="summary-grid" style={{ width: "100%", marginTop: 8 }}>
                    <div className="summary-box">
                      <span className="summary-label">Dépenses détaillées</span>
                      <span className="badge badge-green" style={{ marginTop: 4 }}>✓ Mis à jour</span>
                    </div>
                    <div className="summary-box">
                      <span className="summary-label">Dépenses / catégorie</span>
                      <span className="badge badge-green" style={{ marginTop: 4 }}>✓ Mis à jour</span>
                    </div>
                    <div className="summary-box full">
                      <span className="summary-label">Suivi Projet Tazdaine</span>
                      <span className="badge badge-green" style={{ marginTop: 4 }}>✓ Montants El Chahid synchronisés</span>
                    </div>
                  </div>
                  <button className="action-btn action-secondary" onClick={() => setIsOpen(false)} style={{ width: "100%", marginTop: 8 }}>
                    Fermer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
