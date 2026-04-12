// ─────────────────────────────────────────────────────────────────
//  VillaScope — Backup API Server  (pattern MyBankin)
//
//  Fichier principal : ./data/villascope_complet_data.json
//  Backups horodatés : ./data/backups/villascope_complet_data_20260410_1430.json
//
//  Supporte 2 formats :
//    • Multi-projet (v5) : { projects: [...], activeProjectId: "..." }
//    • Legacy (v4)       : { depenses, projections, fournisseur_chahid }
//
//  npm install express cors
//  node backup-server.js
// ─────────────────────────────────────────────────────────────────

const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.BACKUP_PORT || 3001;

// ─── Chemins ─────────────────────────────────────────────────────
const DATA_DIR = path.join(__dirname, "data");
const BACKUP_DIR = path.join(DATA_DIR, "backups");
const LIVE_FILE = path.join(DATA_DIR, "villascope_complet_data.json");

// Créer les dossiers s'ils n'existent pas
[DATA_DIR, BACKUP_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Dossier créé: ${dir}`);
  }
});

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// ─── Helpers ─────────────────────────────────────────────────────

function getTimestamp() {
  const d = new Date();
  return (
    d.getFullYear() +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0") +
    "_" +
    String(d.getHours()).padStart(2, "0") +
    String(d.getMinutes()).padStart(2, "0") +
    String(d.getSeconds()).padStart(2, "0")
  );
}

function listBackups() {
  if (!fs.existsSync(BACKUP_DIR)) return [];
  return fs
    .readdirSync(BACKUP_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const stat = fs.statSync(path.join(BACKUP_DIR, f));
      return {
        filename: f,
        size: stat.size,
        created: stat.mtime.toISOString(),
      };
    })
    .sort((a, b) => b.filename.localeCompare(a.filename));
}

/** Crée un backup horodaté du fichier live s'il existe */
function backupLiveFile() {
  if (!fs.existsSync(LIVE_FILE)) return null;
  const ts = getTimestamp();
  const backupName = `villascope_complet_data_${ts}.json`;
  fs.copyFileSync(LIVE_FILE, path.join(BACKUP_DIR, backupName));
  console.log(`📦 Backup créé: ${backupName}`);
  return backupName;
}

// ─── Routes ──────────────────────────────────────────────────────

/**
 * POST /api/save
 * "Sauvegarder serveur" — supporte multi-projet ET legacy
 *   1) Si le fichier live existe → copie dans /backups/ avec timestamp
 *   2) Écrase le fichier live avec les nouvelles données
 */
app.post("/api/save", (req, res) => {
  try {
    const body = req.body;

    // ── Format multi-projet (v5) ──
    if (body.projects && Array.isArray(body.projects)) {
      const backupCreated = backupLiveFile();

      const payload = {
        _meta: {
          app: "VillaScope",
          version: "5.0-multiproject",
          savedAt: new Date().toISOString(),
          description: "Sauvegarde complète — Multi-projet",
        },
        projects: body.projects,
        activeProjectId: body.activeProjectId || null,
      };

      fs.writeFileSync(LIVE_FILE, JSON.stringify(payload, null, 2), "utf-8");
      const stat = fs.statSync(LIVE_FILE);
      console.log(`💾 Fichier live mis à jour (multi-projet): ${(stat.size / 1024).toFixed(1)} Ko`);

      return res.json({
        ok: true,
        savedAt: payload._meta.savedAt,
        fileSize: stat.size,
        backupCreated,
      });
    }

    // ── Format legacy (v4) ──
    const { depenses, projections, fournisseur_chahid } = body;

    if (!depenses && !projections && !fournisseur_chahid) {
      return res.status(400).json({ ok: false, error: "Aucune donnée à sauvegarder" });
    }

    const backupCreated = backupLiveFile();

    const payload = {
      _meta: {
        app: "VillaScope",
        version: "4.0",
        savedAt: new Date().toISOString(),
        description: "Sauvegarde complète — Projet Villa Tazdaine",
      },
      depenses: depenses || [],
      projections: projections || [],
      fournisseur_chahid: fournisseur_chahid || [],
    };

    fs.writeFileSync(LIVE_FILE, JSON.stringify(payload, null, 2), "utf-8");
    const stat = fs.statSync(LIVE_FILE);
    console.log(`💾 Fichier live mis à jour (legacy): ${(stat.size / 1024).toFixed(1)} Ko`);

    res.json({
      ok: true,
      savedAt: payload._meta.savedAt,
      fileSize: stat.size,
      backupCreated,
    });
  } catch (err) {
    console.error("❌ Erreur sauvegarde:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * GET /api/load
 * "Recharger serveur" — relit le fichier live depuis le disque
 */
app.get("/api/load", (req, res) => {
  try {
    if (!fs.existsSync(LIVE_FILE)) {
      return res.status(404).json({
        ok: false,
        error: "Aucun fichier villascope_complet_data.json trouvé",
      });
    }

    const content = JSON.parse(fs.readFileSync(LIVE_FILE, "utf-8"));
    const stat = fs.statSync(LIVE_FILE);

    res.json({
      ok: true,
      filename: "villascope_complet_data.json",
      size: stat.size,
      lastModified: stat.mtime.toISOString(),
      data: content,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * GET /api/backups
 * Liste les backups horodatés dans /data/backups/
 */
app.get("/api/backups", (req, res) => {
  try {
    const backups = listBackups();

    let liveInfo = null;
    if (fs.existsSync(LIVE_FILE)) {
      const stat = fs.statSync(LIVE_FILE);
      liveInfo = {
        filename: "villascope_complet_data.json",
        size: stat.size,
        lastModified: stat.mtime.toISOString(),
      };
    }

    res.json({ ok: true, live: liveInfo, backups, count: backups.length });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * GET /api/backup/:filename
 * Charger un backup spécifique (pour restaurer une ancienne version)
 */
app.get("/api/backup/:filename", (req, res) => {
  try {
    const filename = req.params.filename;

    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return res.status(400).json({ ok: false, error: "Nom de fichier invalide" });
    }

    const filepath = path.join(BACKUP_DIR, filename);
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ ok: false, error: "Backup non trouvé" });
    }

    const content = JSON.parse(fs.readFileSync(filepath, "utf-8"));
    const stat = fs.statSync(filepath);

    res.json({ ok: true, filename, size: stat.size, data: content });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * POST /api/restore/:filename
 * Restaurer un backup : le backup remplace le fichier live
 * (l'ancien live est sauvegardé avant)
 */
app.post("/api/restore/:filename", (req, res) => {
  try {
    const filename = req.params.filename;

    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return res.status(400).json({ ok: false, error: "Nom de fichier invalide" });
    }

    const backupPath = path.join(BACKUP_DIR, filename);
    if (!fs.existsSync(backupPath)) {
      return res.status(404).json({ ok: false, error: "Backup non trouvé" });
    }

    // Sauvegarder le live actuel avant de le remplacer
    let backupOfCurrent = null;
    if (fs.existsSync(LIVE_FILE)) {
      const ts = getTimestamp();
      const saveName = `villascope_complet_data_${ts}_pre_restore.json`;
      fs.copyFileSync(LIVE_FILE, path.join(BACKUP_DIR, saveName));
      backupOfCurrent = saveName;
      console.log(`📦 Backup pré-restore: ${saveName}`);
    }

    // Copier le backup vers le fichier live
    fs.copyFileSync(backupPath, LIVE_FILE);
    const content = JSON.parse(fs.readFileSync(LIVE_FILE, "utf-8"));

    console.log(`♻️  Restauré depuis: ${filename}`);

    res.json({
      ok: true,
      restored: filename,
      backupOfCurrent,
      data: content,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * DELETE /api/backup/:filename
 * Supprimer un backup
 */
app.delete("/api/backup/:filename", (req, res) => {
  try {
    const filename = req.params.filename;

    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return res.status(400).json({ ok: false, error: "Nom de fichier invalide" });
    }

    const filepath = path.join(BACKUP_DIR, filename);
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ ok: false, error: "Backup non trouvé" });
    }

    fs.unlinkSync(filepath);
    console.log(`🗑️  Supprimé: ${filename}`);

    res.json({ ok: true, deleted: filename });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ─── Start ───────────────────────────────────────────────────────

app.listen(PORT, () => {
  const existing = listBackups();
  const hasLive = fs.existsSync(LIVE_FILE);

  console.log("");
  console.log("  ╔═══════════════════════════════════════════════════╗");
  console.log("  ║   🏠 VillaScope — Backup Server                   ║");
  console.log(`  ║   http://localhost:${PORT}                           ║`);
  console.log("  ╠═══════════════════════════════════════════════════╣");
  console.log(`  ║   📄 Fichier live : ${hasLive ? "✅ trouvé" : "❌ absent"}                     ║`);
  console.log(`  ║   📦 Backups      : ${String(existing.length).padEnd(3)} fichier(s)                ║`);
  console.log(`  ║   📁 Dossier      : ./data/backups/                 ║`);
  console.log("  ╠═══════════════════════════════════════════════════╣");
  console.log("  ║   POST /api/save        → Sauvegarder serveur     ║");
  console.log("  ║   GET  /api/load        → Recharger serveur       ║");
  console.log("  ║   GET  /api/backups     → Liste des backups        ║");
  console.log("  ║   POST /api/restore/:f  → Restaurer un backup     ║");
  console.log("  ║   DELETE /api/backup/:f → Supprimer un backup      ║");
  console.log("  ╚═══════════════════════════════════════════════════╝");
  console.log("");
});