import { useState, useEffect, useCallback } from "react";

interface Props {
  isPremium: boolean;
  openLicenseModal: () => void;
}

interface BackupEntry {
  id: string;
  name: string;
  date: string;
  type: "manual" | "automatic";
}

type ModalState =
  | { kind: "none" }
  | { kind: "create" }
  | { kind: "restore"; entry: BackupEntry }
  | { kind: "deleting"; id: string };

type ToastState = { msg: string; ok: boolean } | null;

export default function BackupsPage({ isPremium: _p, openLicenseModal: _ol }: Props) {
  const [backups, setBackups] = useState<BackupEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({ kind: "none" });
  const [createName, setCreateName] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const loadBackups = useCallback(async () => {
    setLoading(true);
    const res = await window.kermouk.backups.list();
    setBackups(res.ok ? res.backups : []);
    setLoading(false);
  }, []);

  useEffect(() => { loadBackups(); }, [loadBackups]);

  async function handleCreate() {
    const name = createName.trim() || "Backup manuel";
    setBusy(true);
    const res = await window.kermouk.backups.create(name, "manual");
    setBusy(false);
    setModal({ kind: "none" });
    setCreateName("");
    if (res.ok) {
      showToast(`Sauvegarde "${name}" créée.`, true);
      await loadBackups();
    } else {
      showToast("Erreur : " + (res.error ?? "inconnue"), false);
    }
  }

  async function handleRestore(entry: BackupEntry) {
    setBusy(true);
    setModal({ kind: "none" });
    const res = await window.kermouk.backups.restore(entry.id);
    setBusy(false);
    if (res.success) {
      showToast("Restauration terminée. Redémarrez Windows pour finaliser.", true);
    } else {
      showToast("Erreur restauration : " + (res.errors[0] ?? "inconnue"), false);
    }
  }

  async function handleDelete(id: string) {
    setBusy(true);
    setModal({ kind: "none" });
    const res = await window.kermouk.backups.delete(id);
    setBusy(false);
    if (res.ok) {
      showToast("Sauvegarde supprimée.", true);
      setBackups(prev => prev.filter(b => b.id !== id));
    } else {
      showToast("Erreur suppression : " + (res.error ?? "inconnue"), false);
    }
  }

  const fmtDate = (iso: string) => {
    try { return new Date(iso).toLocaleString("fr-FR"); }
    catch { return iso; }
  };

  const btnBase: React.CSSProperties = {
    border: "none",
    borderRadius: "6px",
    fontFamily: "Rajdhani, sans-serif",
    fontWeight: 700,
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    cursor: busy ? "wait" : "pointer",
    transition: "opacity 0.15s",
  };

  return (
    <div>
      <div className="section-header">
        <h1 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "20px", fontWeight: 900, color: "#fff", letterSpacing: "0.08em" }}>
          SAUVEGARDES <span className="gradient-text">SYSTÈME</span>
        </h1>
        <p style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
          Export registre + état des services — restauration en 1 clic
        </p>
      </div>

      {/* Actions bar */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
        <button
          onClick={() => { setCreateName(""); setModal({ kind: "create" }); }}
          disabled={busy}
          style={{ ...btnBase, padding: "9px 18px", background: "var(--primary)", color: "#000", opacity: busy ? 0.6 : 1 }}
        >
          Créer une sauvegarde
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          padding: "8px 14px", borderRadius: "6px", marginBottom: "12px",
          fontSize: "11px", fontFamily: "Rajdhani, sans-serif",
          background: toast.ok ? "rgba(30,215,96,0.08)" : "rgba(255,50,50,0.08)",
          color: toast.ok ? "var(--primary)" : "#ff5555",
          border: `1px solid ${toast.ok ? "rgba(30,215,96,0.15)" : "rgba(255,50,50,0.15)"}`,
        }}>
          {toast.msg}
        </div>
      )}

      {/* Info card */}
      <div className="card" style={{ marginBottom: "12px", background: "rgba(255,107,0,0.03)", borderColor: "rgba(255,107,0,0.12)" }}>
        <div style={{ fontSize: "11px", color: "#555", lineHeight: 1.6 }}>
          <strong style={{ color: "#888" }}>Que sauvegarde-t-on ?</strong>
          {" "}Toutes les clés de registre modifiées par les tweaks + l&apos;état de démarrage des services Windows gérés par l&apos;app.
          Une sauvegarde automatique est créée silencieusement avant la première application de tweaks de chaque session.
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 90px 120px", padding: "0 0 10px", borderBottom: "1px solid #111", marginBottom: "12px", gap: "8px" }}>
          {["Nom", "Date", "Type", "Actions"].map((col, i) => (
            <span key={i} style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#444" }}>
              {col}
            </span>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "24px 0", fontSize: "11px", color: "#333" }}>Chargement...</div>
        ) : backups.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5" style={{ margin: "0 auto 12px", display: "block" }}>
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <div style={{ fontSize: "12px", color: "#333" }}>Aucune sauvegarde</div>
            <div style={{ fontSize: "10px", color: "#222", marginTop: "4px" }}>
              Crée une sauvegarde avant d&apos;appliquer des tweaks
            </div>
          </div>
        ) : (
          backups.map(b => (
            <div key={b.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 90px 120px", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #0d0d0d", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: "#ccc", fontFamily: "Rajdhani, sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {b.name}
              </span>
              <span style={{ fontSize: "11px", color: "#555" }}>{fmtDate(b.date)}</span>
              <span style={{
                fontSize: "9px", fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.06em",
                color: b.type === "manual" ? "var(--primary)" : "#555",
                background: b.type === "manual" ? "rgba(30,215,96,0.08)" : "rgba(80,80,80,0.15)",
                border: `1px solid ${b.type === "manual" ? "rgba(30,215,96,0.2)" : "rgba(80,80,80,0.2)"}`,
                borderRadius: "3px", padding: "2px 6px", display: "inline-block",
              }}>
                {b.type === "manual" ? "Manuel" : "Auto"}
              </span>
              <div style={{ display: "flex", gap: "5px" }}>
                <button
                  onClick={() => setModal({ kind: "restore", entry: b })}
                  disabled={busy}
                  style={{ ...btnBase, padding: "4px 10px", background: "rgba(30,215,96,0.08)", border: "1px solid rgba(30,215,96,0.2)", color: "var(--primary)", fontSize: "10px", opacity: busy ? 0.5 : 1 }}
                >
                  Restaurer
                </button>
                <button
                  onClick={() => setModal({ kind: "deleting", id: b.id })}
                  disabled={busy}
                  style={{ ...btnBase, padding: "4px 8px", background: "none", border: "1px solid #2a2a2a", color: "#444", fontSize: "10px", opacity: busy ? 0.5 : 1 }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Create backup */}
      {modal.kind === "create" && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 1000,
        }}
          onClick={e => e.target === e.currentTarget && setModal({ kind: "none" })}
        >
          <div className="card" style={{ width: "380px", padding: "24px" }}>
            <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: "14px", fontWeight: 900, color: "#fff", marginBottom: "16px", letterSpacing: "0.06em" }}>
              Nouvelle sauvegarde
            </div>
            <div style={{ fontSize: "11px", color: "#555", marginBottom: "14px" }}>
              Nomme cette sauvegarde pour la retrouver facilement.
            </div>
            <input
              type="text"
              value={createName}
              onChange={e => setCreateName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !busy && handleCreate()}
              placeholder="Ex: Avant tweaks réseau"
              autoFocus
              style={{
                width: "100%", padding: "9px 12px", background: "#111", border: "1px solid #333",
                borderRadius: "6px", color: "#fff", fontSize: "12px", fontFamily: "Rajdhani, sans-serif",
                outline: "none", boxSizing: "border-box", marginBottom: "16px",
              }}
            />
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setModal({ kind: "none" })}
                style={{ ...btnBase, padding: "8px 16px", background: "none", border: "1px solid #333", color: "#666" }}
              >
                Annuler
              </button>
              <button
                onClick={handleCreate}
                disabled={busy}
                style={{ ...btnBase, padding: "8px 18px", background: "var(--primary)", color: "#000", opacity: busy ? 0.6 : 1 }}
              >
                {busy ? "Création..." : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirm restore */}
      {modal.kind === "restore" && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 1000,
        }}>
          <div className="card" style={{ width: "420px", padding: "24px" }}>
            <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: "14px", fontWeight: 900, color: "#fff", marginBottom: "12px", letterSpacing: "0.06em" }}>
              Confirmer la restauration
            </div>
            <div style={{ fontSize: "12px", color: "#888", lineHeight: 1.6, marginBottom: "20px" }}>
              Cette action va remplacer tes réglages actuels par ceux du{" "}
              <strong style={{ color: "#ccc" }}>{fmtDate(modal.entry.date)}</strong>
              {" "}(<strong style={{ color: "var(--primary)" }}>{modal.entry.name}</strong>).
              <br /><br />
              Les clés de registre modifiées par les tweaks et l&apos;état des services seront restaurés. Un redémarrage est recommandé après.
              <br /><br />
              <strong style={{ color: "#ff9500" }}>Continuer ?</strong>
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setModal({ kind: "none" })}
                style={{ ...btnBase, padding: "8px 16px", background: "none", border: "1px solid #333", color: "#666" }}
              >
                Annuler
              </button>
              <button
                onClick={() => handleRestore(modal.entry)}
                disabled={busy}
                style={{ ...btnBase, padding: "8px 18px", background: "var(--primary)", color: "#000", opacity: busy ? 0.6 : 1 }}
              >
                {busy ? "Restauration..." : "Restaurer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirm delete */}
      {modal.kind === "deleting" && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 1000,
        }}>
          <div className="card" style={{ width: "360px", padding: "24px" }}>
            <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: "14px", fontWeight: 900, color: "#fff", marginBottom: "12px", letterSpacing: "0.06em" }}>
              Supprimer la sauvegarde ?
            </div>
            <div style={{ fontSize: "12px", color: "#555", marginBottom: "20px" }}>
              Cette action est irréversible.
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setModal({ kind: "none" })}
                style={{ ...btnBase, padding: "8px 16px", background: "none", border: "1px solid #333", color: "#666" }}
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(modal.id)}
                disabled={busy}
                style={{ ...btnBase, padding: "8px 18px", background: "rgba(255,50,50,0.15)", border: "1px solid rgba(255,50,50,0.3)", color: "#ff5555", opacity: busy ? 0.6 : 1 }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
