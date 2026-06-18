import { useState } from "react";
import type { SupabaseProfile } from "../App";

interface AccountPageProps {
  user: { id: string; email: string };
  profile: SupabaseProfile;
  onLogout: () => void;
  onPremiumUnlocked: () => void;
}

export default function AccountPage({ user, profile, onLogout, onPremiumUnlocked }: AccountPageProps) {
  const [copied, setCopied] = useState(false);
  const [logging, setLogging] = useState(false);

  const count = profile.referral_count || 0;
  const isPremium = profile.is_premium;

  const copyCode = () => {
    navigator.clipboard.writeText(profile.referral_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareMessage = () => {
    const msg = `Utilise mon code ${profile.referral_code} sur KERMOUK OPTIMIZER pour optimiser ton PC Fortnite ! kermouk.com`;
    navigator.clipboard.writeText(msg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    setLogging(true);
    await window.kermouk.authLogout();
    onLogout();
  };

  // Notify parent if premium just unlocked (in case it changed server-side)
  if (isPremium) onPremiumUnlocked();

  const progressMessage = () => {
    if (count === 0) return "Partage ton code pour commencer !";
    if (count >= 5) return "Premium débloqué ! Félicitations !";
    return `Plus que ${5 - count} invitation${5 - count > 1 ? "s" : ""} pour débloquer le Premium !`;
  };

  const joinedDate = new Date(profile.created_at).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric"
  });

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "24px", background: "#0a0a0a" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Header */}
        <div style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "0.1em", color: "white", textTransform: "uppercase", marginBottom: "8px" }}>
          Mon Compte
        </div>

        {/* Profile card */}
        <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div>
              <div style={{ fontSize: "13px", color: "white", fontWeight: 600, marginBottom: "4px" }}>
                {user.email}
              </div>
              <div style={{ fontSize: "11px", color: "#555" }}>
                Membre depuis le {joinedDate}
              </div>
            </div>

            {isPremium ? (
              <div style={{
                padding: "4px 12px",
                background: "rgba(249,115,22,0.12)",
                border: "1px solid rgba(249,115,22,0.35)",
                borderRadius: "6px",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "0.12em",
                color: "#f97316",
                textTransform: "uppercase",
                boxShadow: "0 0 12px rgba(249,115,22,0.15)",
              }}>
                PREMIUM
              </div>
            ) : (
              <div style={{
                padding: "4px 12px",
                background: "rgba(80,80,80,0.1)",
                border: "1px solid #2a2a2a",
                borderRadius: "6px",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "0.12em",
                color: "#666",
                textTransform: "uppercase",
              }}>
                FREE
              </div>
            )}
          </div>
        </div>

        {/* Referral card */}
        <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "20px" }}>
          {/* Title */}
          <div style={{ fontSize: "13px", fontWeight: 800, color: "white", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px" }}>
            Invite tes amis, gagne le Premium !
          </div>
          <div style={{ fontSize: "11px", color: "#555", marginBottom: "20px" }}>
            5 amis parrainés = Premium à vie offert
          </div>

          {/* Code */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "10px", color: "#555", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
              Ton code de parrainage
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                flex: 1,
                padding: "12px 16px",
                background: "#0d0d0d",
                border: "1px solid rgba(249,115,22,0.25)",
                borderRadius: "8px",
                fontSize: "20px",
                fontWeight: 800,
                letterSpacing: "0.15em",
                color: "#f97316",
                textAlign: "center",
                fontFamily: "monospace",
              }}>
                {profile.referral_code}
              </div>
              <button
                onClick={copyCode}
                style={{
                  padding: "12px 16px",
                  background: copied ? "rgba(34,197,94,0.12)" : "rgba(249,115,22,0.1)",
                  border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "rgba(249,115,22,0.25)"}`,
                  borderRadius: "8px",
                  color: copied ? "#22c55e" : "#f97316",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s",
                }}
              >
                {copied ? "Copié !" : "Copier"}
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ fontSize: "11px", color: "#555" }}>Progression</div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: count >= 5 ? "#22c55e" : "#f97316" }}>
                {Math.min(count, 5)}/5
              </div>
            </div>

            {/* Segments */}
            <div style={{ display: "flex", gap: "4px", marginBottom: "10px" }}>
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: "6px",
                    borderRadius: "3px",
                    background: i < count ? (count >= 5 ? "#22c55e" : "#f97316") : "#1f1f1f",
                    transition: "background 0.3s",
                    boxShadow: i < count && count >= 5 ? "0 0 6px rgba(34,197,94,0.4)" : i < count ? "0 0 6px rgba(249,115,22,0.3)" : "none",
                  }}
                />
              ))}
            </div>

            <div style={{ fontSize: "11px", color: count >= 5 ? "#22c55e" : "#777" }}>
              {progressMessage()}
            </div>
          </div>

          {/* Share button */}
          <button
            onClick={shareMessage}
            style={{
              width: "100%",
              padding: "10px",
              background: "rgba(249,115,22,0.08)",
              border: "1px solid rgba(249,115,22,0.2)",
              borderRadius: "6px",
              color: "#f97316",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              transition: "background 0.15s",
            }}
          >
            Partager le code
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={logging}
          style={{
            width: "100%",
            padding: "10px",
            background: "transparent",
            border: "1px solid #1f1f1f",
            borderRadius: "6px",
            color: "#444",
            fontSize: "11px",
            fontWeight: 600,
            cursor: logging ? "not-allowed" : "pointer",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.borderColor = "#ef4444"; (e.target as HTMLButtonElement).style.color = "#ef4444"; }}
          onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.borderColor = "#1f1f1f"; (e.target as HTMLButtonElement).style.color = "#444"; }}
        >
          {logging ? "Déconnexion..." : "Se déconnecter"}
        </button>
      </div>
    </div>
  );
}
