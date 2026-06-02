import { useState, useEffect } from "react";

interface MotherboardInfo {
  manufacturer: string;
  product: string;
}

interface BiosParam {
  id: string;
  label: string;
  recommendation: string;
  impact: string;
  category: "RAM" | "GPU" | "CPU" | "Boot" | "Système";
}

const BIOS_PARAMS: BiosParam[] = [
  {
    id: "xmp",
    label: "XMP / EXPO Profile",
    recommendation: "Activer",
    impact: "+5-15% perfs — Active la RAM à sa vraie fréquence annoncée (ex: 3600 MHz). Par défaut Windows tourne à 2133 MHz peu importe votre kit.",
    category: "RAM",
  },
  {
    id: "rebar",
    label: "Resizable BAR (ReBAR / SAM)",
    recommendation: "Activer",
    impact: "+10-15% FPS GPU — Permet au CPU d'accéder à toute la VRAM en une seule transaction. Requis : CPU 10e gen Intel+ ou Ryzen 5000+.",
    category: "GPU",
  },
  {
    id: "above4g",
    label: "Above 4G Decoding",
    recommendation: "Activer",
    impact: "Prérequis obligatoire pour ReBAR. Autorise les adresses PCI-E au-delà de 4 Go pour les GPU modernes.",
    category: "GPU",
  },
  {
    id: "csm",
    label: "CSM (Compatibility Support Module)",
    recommendation: "Désactiver",
    impact: "Mode UEFI pur — nécessaire pour ReBAR et Secure Boot. Désactiver sauf si vous avez un vieux disque MBR.",
    category: "Système",
  },
  {
    id: "virt",
    label: "Virtualization (VT-x / AMD-V)",
    recommendation: "Désactiver pour gaming",
    impact: "Réduit légèrement la latence CPU. Désactiver si vous n'utilisez pas WSL2 ou VMs. Réactivable à tout moment.",
    category: "CPU",
  },
  {
    id: "cstates",
    label: "C-States (Power States CPU)",
    recommendation: "Désactiver",
    impact: "Élimine les micro-pauses du CPU en veille. Latence CPU minimale pour le gaming compétitif.",
    category: "CPU",
  },
  {
    id: "hpet",
    label: "HPET (High Precision Event Timer)",
    recommendation: "Désactiver",
    impact: "Sur CPUs modernes, HPET ajoute de la latence. Désactiver pour laisser le TSC gérer le timing.",
    category: "CPU",
  },
  {
    id: "fastboot",
    label: "Fast Boot",
    recommendation: "Activer",
    impact: "Réduit le temps de démarrage Windows de 5-15 secondes en sautant les tests POST non essentiels.",
    category: "Boot",
  },
  {
    id: "spread",
    label: "Spread Spectrum",
    recommendation: "Désactiver",
    impact: "Désactiver pour gaming. Peut instabiliser l'OC RAM. Utile uniquement pour réduire les interférences EMI.",
    category: "Système",
  },
  {
    id: "pl",
    label: "Power Limit (PL1 / PL2 / TDP)",
    recommendation: "Maximum / Unlimited",
    impact: "Évite le throttling CPU. Intel : Long/Short Duration Power Limit. AMD : PPT + TDC. Mettre au maximum pour des perfs constantes.",
    category: "CPU",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  RAM: "#60a5fa",
  GPU: "#a78bfa",
  CPU: "#FF6B00",
  Boot: "#22c55e",
  Système: "#f59e0b",
};

function getManufacturerGuide(manufacturer: string): { title: string; path: string; tips: string[] } {
  const m = manufacturer.toLowerCase();
  if (m.includes("asus")) {
    return {
      title: "ASUS BIOS — Ai Tweaker / Extreme Tweaker",
      path: "Appuyer sur Del au démarrage → F7 pour le mode Avancé",
      tips: [
        "XMP/DOCP : Ai Tweaker → Ai Overclock Tuner → D.O.C.P.",
        "ReBAR : Advanced → PCIe/PCI Subsystem → Resizable Bar Support",
        "C-States : Advanced → CPU Power Management → CPU C States → Disabled",
        "Fast Boot : Boot → Fast Boot → Enabled",
        "CSM : Boot → CSM (Compatibility Support Module) → Disabled",
      ],
    };
  }
  if (m.includes("msi")) {
    return {
      title: "MSI BIOS — OC / Settings",
      path: "Appuyer sur Del au démarrage → cliquer 'Basculer vers le mode expert'",
      tips: [
        "XMP/EXPO : OC → XMP → Profil 1 ou 2",
        "ReBAR : Settings → Advanced → PCI Subsystem → Above 4G + Re-Size BAR",
        "C-States : Settings → Advanced → Power Management → CPU C-States → Disabled",
        "Fast Boot : Settings → Boot → Fast Boot → Enabled",
        "CSM : Settings → Boot → Boot mode select → UEFI",
      ],
    };
  }
  if (m.includes("gigabyte") || m.includes("giga-byte")) {
    return {
      title: "Gigabyte BIOS — Tweaker / M.I.T.",
      path: "Appuyer sur Del ou F2 au démarrage",
      tips: [
        "XMP : M.I.T. → Advanced Memory Settings → Extreme Memory Profile → Profile1",
        "ReBAR : Settings → IO Ports → Above 4G Decoding ON + Re-Size BAR Support ON",
        "C-States : Settings → Platform Power → CPU C-States Control → Disabled",
        "Fast Boot : BIOS → Fast Boot → Enabled",
        "CSM : BIOS → CSM Support → Disabled",
      ],
    };
  }
  if (m.includes("asrock")) {
    return {
      title: "ASRock BIOS — OC Tweaker",
      path: "Appuyer sur F2 ou Del au démarrage",
      tips: [
        "XMP : OC Tweaker → DRAM Configuration → Load XMP Setting",
        "ReBAR : Advanced → Chipset Configuration → Above 4G Decoding ON + Resizable BAR ON",
        "C-States : Advanced → CPU Configuration → CPU C States Support → Disabled",
        "Fast Boot : Boot → Fast Boot → Enabled",
        "CSM : Boot → CSM → Disabled",
      ],
    };
  }
  return {
    title: "Guide BIOS Générique",
    path: "Appuyer sur Del, F2 ou Suppr au démarrage pour accéder au BIOS",
    tips: [
      "XMP / EXPO / DOCP : chercher dans la section Mémoire ou OC",
      "Above 4G Decoding + Resizable BAR : chercher dans PCI/Advanced/Chipset",
      "C-States : chercher dans CPU Power Management",
      "Fast Boot : chercher dans la section Boot",
      "CSM : chercher dans Boot → Compatibility Support Module",
    ],
  };
}

interface Props {
  isPremium: boolean;
  openLicenseModal: () => void;
}

export default function BiosTweaks({ isPremium, openLicenseModal }: Props) {
  const [mbInfo, setMbInfo] = useState<MotherboardInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [rebooting, setRebooting] = useState(false);

  useEffect(() => {
    if (!isPremium) return;
    window.kermouk?.getMotherboardInfo().then((info) => {
      setMbInfo(info);
      setLoading(false);
    });
    const saved = localStorage.getItem("bios-checklist");
    if (saved) {
      try { setChecked(JSON.parse(saved)); } catch {}
    }
  }, [isPremium]);

  const toggle = (id: string) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    localStorage.setItem("bios-checklist", JSON.stringify(next));
  };

  const handleRebootToBios = async () => {
    setRebooting(true);
    await window.kermouk?.rebootToBios();
  };

  if (!isPremium) {
    return (
      <div>
        <div className="section-header">
          <h1 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "20px", fontWeight: 900, color: "#fff", letterSpacing: "0.08em" }}>
            GUIDE <span className="gradient-text">BIOS</span>
          </h1>
          <p style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
            Optimisation des paramètres BIOS pour performances maximales
          </p>
        </div>
        <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" style={{ margin: "0 auto 16px" }}>
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: "16px", fontWeight: 900, color: "#555", marginBottom: "8px" }}>
            FONCTIONNALITÉ PREMIUM
          </div>
          <p style={{ fontSize: "12px", color: "#444", marginBottom: "20px", lineHeight: 1.6 }}>
            Le Guide BIOS personnalisé selon votre carte mère est réservé aux membres Premium.
          </p>
          <button onClick={openLicenseModal} className="btn-primary">
            Activer Premium
          </button>
        </div>
      </div>
    );
  }

  const guide = mbInfo ? getManufacturerGuide(mbInfo.manufacturer) : null;
  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <div>
      <div className="section-header">
        <h1 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "20px", fontWeight: 900, color: "#fff", letterSpacing: "0.08em" }}>
          GUIDE <span className="gradient-text">BIOS</span>
        </h1>
        <p style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
          Paramètres BIOS essentiels pour des performances gaming maximales
        </p>
      </div>

      {/* Carte mère détectée */}
      <div className="card" style={{ marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: guide ? "12px" : 0 }}>
          <div>
            <div style={{ fontSize: "10px", color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
              Carte Mère Détectée
            </div>
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#444", fontSize: "12px" }}>
                <svg className="spinner" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Détection en cours...
              </div>
            ) : (
              <div style={{ fontSize: "14px", color: "#FF6B00", fontWeight: 700 }}>
                {mbInfo?.manufacturer} {mbInfo?.product}
              </div>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "10px", color: "#555", marginBottom: "2px" }}>Cochés</div>
            <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: "22px", fontWeight: 900, color: "#FF6B00" }}>
              {doneCount}/{BIOS_PARAMS.length}
            </div>
          </div>
        </div>

        {guide && (
          <div style={{ padding: "10px", background: "rgba(255,107,0,0.05)", border: "1px solid rgba(255,107,0,0.15)", borderRadius: "6px" }}>
            <div style={{ fontSize: "11px", color: "#FF6B00", fontWeight: 700, marginBottom: "4px" }}>{guide.title}</div>
            <div style={{ fontSize: "11px", color: "#777", marginBottom: "8px" }}>Accès : {guide.path}</div>
            {guide.tips.map((tip, i) => (
              <div key={i} style={{ fontSize: "11px", color: "#555", marginBottom: "3px" }}>→ {tip}</div>
            ))}
          </div>
        )}
      </div>

      {/* Redémarrer dans le BIOS */}
      <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <div>
          <div style={{ fontSize: "12px", color: "#ccc", fontWeight: 600 }}>Redémarrer directement dans le BIOS</div>
          <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>
            Raccourci Windows → redémarre en 5 secondes
          </div>
        </div>
        <button
          className="btn-primary"
          style={{ padding: "8px 16px", fontSize: "11px", whiteSpace: "nowrap" }}
          onClick={handleRebootToBios}
          disabled={rebooting}
        >
          {rebooting ? "Redémarrage dans 5s..." : "Redémarrer → BIOS"}
        </button>
      </div>

      {/* Checklist par catégorie */}
      {(["RAM", "GPU", "CPU", "Boot", "Système"] as const).map((cat) => {
        const params = BIOS_PARAMS.filter((p) => p.category === cat);
        return (
          <div key={cat} className="card" style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: CATEGORY_COLORS[cat] }} />
              <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: CATEGORY_COLORS[cat] }}>
                {cat}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {params.map((param) => (
                <div
                  key={param.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "10px",
                    background: "#0d0d0d",
                    borderRadius: "6px",
                    border: `1px solid ${checked[param.id] ? "rgba(34,197,94,0.25)" : "#1a1a1a"}`,
                    transition: "border-color 0.2s",
                  }}
                >
                  <label className="toggle" style={{ marginTop: "2px", flexShrink: 0 }}>
                    <input type="checkbox" checked={!!checked[param.id]} onChange={() => toggle(param.id)} />
                    <span className="toggle-slider" />
                  </label>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "12px", color: checked[param.id] ? "#22c55e" : "#ccc", fontWeight: 600 }}>
                        {param.label}
                      </span>
                      <span style={{ fontSize: "10px", padding: "1px 7px", borderRadius: "3px", background: "rgba(255,107,0,0.1)", color: "#FF6B00", border: "1px solid rgba(255,107,0,0.2)", whiteSpace: "nowrap" }}>
                        → {param.recommendation}
                      </span>
                    </div>
                    <div style={{ fontSize: "11px", color: "#555", lineHeight: 1.5 }}>{param.impact}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
