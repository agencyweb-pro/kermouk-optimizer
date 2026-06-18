interface StatusBarProps {
  isPremium: boolean;
  appliedTweaksCount: number;
}

export default function StatusBar({ isPremium, appliedTweaksCount }: StatusBarProps) {
  return (
    <div className="status-bar">
      <span>KERMOUK OPTIMIZER v{__APP_VERSION__}</span>

      <span style={{ display: "flex", alignItems: "center" }}>
        <span
          className="status-bar-dot"
          style={{ background: isPremium ? "#22c55e" : "var(--primary)" }}
        />
        {isPremium ? "Licence Premium" : "Version Gratuite"}
      </span>

      <span>
        {appliedTweaksCount > 0
          ? `${appliedTweaksCount} tweak${appliedTweaksCount > 1 ? "s" : ""} appliqué${appliedTweaksCount > 1 ? "s" : ""}`
          : "Aucun tweak appliqué"}
      </span>
    </div>
  );
}
