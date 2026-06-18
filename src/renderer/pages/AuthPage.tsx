import { useState } from "react";
import type { SupabaseProfile } from "../App";

interface AuthPageProps {
  onAuthenticated: (user: { id: string; email: string }, profile: SupabaseProfile) => void;
}

export default function AuthPage({ onAuthenticated }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      let result: { ok: boolean; message?: string; user?: { id: string; email: string }; profile?: SupabaseProfile };

      if (mode === "login") {
        result = await window.kermouk.authLogin({ email, password });
      } else {
        result = await window.kermouk.authSignup({ email, password, referralCode: referralCode || undefined });
      }

      if (!result.ok) {
        setError(result.message || "Une erreur est survenue.");
      } else if (result.user && result.profile) {
        onAuthenticated(result.user, result.profile);
      } else {
        setInfo(result.message || "Confirme ton email puis connecte-toi.");
      }
    } catch {
      setError("Erreur réseau. Vérifie ta connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a" }}>
      <div style={{ width: "360px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "0.12em", color: "#f97316", textTransform: "uppercase", marginBottom: "6px" }}>
            MON COMPTE
          </div>
          <div style={{ fontSize: "12px", color: "#555", letterSpacing: "0.06em" }}>
            Parraine 5 amis et obtiens le Premium gratuit
          </div>
        </div>

        {/* Toggle */}
        <div style={{ display: "flex", background: "#111", borderRadius: "8px", padding: "3px", marginBottom: "24px", border: "1px solid #1a1a1a" }}>
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(null); setInfo(null); }}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                transition: "all 0.15s",
                background: mode === m ? "#f97316" : "transparent",
                color: mode === m ? "white" : "#555",
              }}
            >
              {m === "login" ? "Connexion" : "Inscription"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={{ fontSize: "10px", color: "#666", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ton@email.com"
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "#111",
                border: "1px solid #1f1f1f",
                borderRadius: "6px",
                color: "white",
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "10px", color: "#666", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "#111",
                border: "1px solid #1f1f1f",
                borderRadius: "6px",
                color: "white",
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {mode === "signup" && (
            <div>
              <label style={{ fontSize: "10px", color: "#666", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                Code de parrainage <span style={{ color: "#333" }}>(optionnel)</span>
              </label>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="KERM-XXXX"
                maxLength={9}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "#111",
                  border: "1px solid #1f1f1f",
                  borderRadius: "6px",
                  color: "#f97316",
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          )}

          {error && (
            <div style={{ padding: "10px 12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "6px", fontSize: "12px", color: "#ef4444" }}>
              {error}
            </div>
          )}

          {info && (
            <div style={{ padding: "10px 12px", background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "6px", fontSize: "12px", color: "#f97316" }}>
              {info}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "4px",
              padding: "12px",
              background: loading ? "#333" : "#f97316",
              border: "none",
              borderRadius: "6px",
              color: "white",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.15s",
            }}
          >
            {loading ? "Chargement..." : mode === "login" ? "Se connecter" : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
}
