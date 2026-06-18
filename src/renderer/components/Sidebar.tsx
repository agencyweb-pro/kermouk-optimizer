import type { Page } from "../App";

interface SidebarProps {
  currentPage: Page;
  isPremium: boolean;
  onNavigate: (page: Page) => void;
  onUnlockPremium: () => void;
  supabaseUser: { id: string; email: string } | null;
}

interface NavItem {
  id: Page;
  label: string;
  icon: React.ReactNode;
  premiumRequired?: boolean;
  isNew?: boolean;
  highlight?: boolean;
}

// ── GROUPE "Général" ──────────────────────────────────────────────────────────
const GENERAL_ITEMS: NavItem[] = [
  {
    id: "home",
    label: "Home",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: "backups",
    label: "Backups",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    id: "fixes",
    label: "Fixes",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
];

// ── GROUPE "Principal" ────────────────────────────────────────────────────────
const PRINCIPAL_ITEMS: NavItem[] = [
  {
    id: "general",
    label: "General",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
    isNew: true,
  },
  {
    id: "hardware",
    label: "Hardware",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 12v4M8 12v1M16 12v1" />
      </svg>
    ),
    premiumRequired: true,
    isNew: true,
  },
  {
    id: "debloat",
    label: "Debloat",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
      </svg>
    ),
    isNew: true,
  },
  {
    id: "network",
    label: "Network",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    premiumRequired: true,
    isNew: true,
  },
  {
    id: "prelaunch",
    label: "Pre-Launch Fortnite",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
    premiumRequired: true,
    isNew: true,
    highlight: true,
  },
  {
    id: "advanced",
    label: "Advanced",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93A10 10 0 116.93 19.07" />
        <path d="M18 2l4 4-4 4" />
      </svg>
    ),
    premiumRequired: true,
  },
];

// ── GROUPE "Compte" (footer) ──────────────────────────────────────────────────
const ACCOUNT_ITEMS: NavItem[] = [
  {
    id: "about",
    label: "A propos",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
  },
  {
    id: "account",
    label: "Mon Compte",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

function GroupLabel({ label }: { label: string }) {
  return (
    <div style={{ fontSize: "9px", color: "#2a2a2a", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0 12px 6px", fontWeight: 700 }}>
      {label}
    </div>
  );
}

function Divider() {
  return <div style={{ height: "1px", background: "#111", margin: "8px 12px" }} />;
}

function NavItemRow({
  item, currentPage, isPremium, supabaseUser, onNavigate,
}: {
  item: NavItem;
  currentPage: Page;
  isPremium: boolean;
  supabaseUser: { id: string; email: string } | null;
  onNavigate: (page: Page) => void;
}) {
  const locked = item.premiumRequired && !isPremium;
  return (
    <div
      className={`nav-item ${currentPage === item.id ? "active" : ""} ${locked ? "opacity-60" : ""}`}
      onClick={() => onNavigate(item.id)}
      title={locked ? "Fonctionnalité Premium" : undefined}
      style={item.highlight && !locked ? { borderLeft: "2px solid var(--primary)", paddingLeft: "10px" } : undefined}
    >
      <span>{item.icon}</span>
      <span style={{ flex: 1 }}>{item.label}</span>

      {item.isNew && item.id !== "account" && (
        <span className="badge badge-new">NEW</span>
      )}
      {item.id === "account" && supabaseUser && (
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
      )}
      {locked && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      )}
      {item.premiumRequired && isPremium && !item.isNew && (
        <span className="badge badge-premium" style={{ fontSize: "8px" }}>PRO</span>
      )}
    </div>
  );
}

export default function Sidebar({ currentPage, isPremium, onNavigate, onUnlockPremium, supabaseUser }: SidebarProps) {
  return (
    <aside className="sidebar flex flex-col">
      <div className="flex-1">
        {/* Groupe Général */}
        <GroupLabel label="Général" />
        {GENERAL_ITEMS.map(item => (
          <NavItemRow key={item.id} item={item} currentPage={currentPage} isPremium={isPremium} supabaseUser={supabaseUser} onNavigate={onNavigate} />
        ))}

        <Divider />

        {/* Groupe Principal */}
        <GroupLabel label="Principal" />
        {PRINCIPAL_ITEMS.map(item => (
          <NavItemRow key={item.id} item={item} currentPage={currentPage} isPremium={isPremium} supabaseUser={supabaseUser} onNavigate={onNavigate} />
        ))}

        <Divider />

        {/* Groupe Compte */}
        <GroupLabel label="Compte" />
        {ACCOUNT_ITEMS.map(item => (
          <NavItemRow key={item.id} item={item} currentPage={currentPage} isPremium={isPremium} supabaseUser={supabaseUser} onNavigate={onNavigate} />
        ))}
      </div>

      {/* Premium CTA */}
      {!isPremium && (
        <div
          onClick={onUnlockPremium}
          style={{
            margin: "8px",
            padding: "12px",
            borderRadius: "8px",
            background: "var(--primary-dim)",
            border: "1px solid var(--primary-border)",
            cursor: "pointer",
          }}
        >
          <div style={{ fontSize: "11px", color: "var(--primary)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
            Passer Premium
          </div>
          <div style={{ fontSize: "10px", color: "#666", lineHeight: 1.4 }}>
            Déverrouillez tous les tweaks avancés
          </div>
          <div style={{ marginTop: "8px", padding: "6px 10px", background: "var(--primary)", borderRadius: "6px", textAlign: "center", fontSize: "10px", fontWeight: 700, color: "white", letterSpacing: "0.05em" }}>
            Entrer ma clé
          </div>
        </div>
      )}

      {isPremium && (
        <div
          style={{
            margin: "8px",
            padding: "10px 12px",
            borderRadius: "8px",
            background: "rgba(34,197,94,0.06)",
            border: "1px solid rgba(34,197,94,0.2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontSize: "10px", color: "#22c55e", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Premium Actif
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
