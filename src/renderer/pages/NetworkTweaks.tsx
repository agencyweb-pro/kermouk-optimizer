import TweakSection from "../components/TweakSection";
import { PREMIUM_TWEAKS } from "../utils/tweakEngine";

const NETWORK_TWEAKS = [
  PREMIUM_TWEAKS.find((t) => t.id === "tcp-autotune")!,
  PREMIUM_TWEAKS.find((t) => t.id === "tcp-rss")!,
  PREMIUM_TWEAKS.find((t) => t.id === "tcp-chimney")!,
  PREMIUM_TWEAKS.find((t) => t.id === "dns-cloudflare")!,
].filter(Boolean);

interface Props {
  isPremium: boolean;
  openLicenseModal: () => void;
}

export default function NetworkTweaks({ isPremium, openLicenseModal }: Props) {
  return (
    <TweakSection
      title="TWEAKS RÉSEAU"
      subtitle="Optimisation TCP/IP et DNS pour réduire le ping et la latence sur Fortnite"
      tweaks={NETWORK_TWEAKS}
      isPremium={isPremium}
      openLicenseModal={openLicenseModal}
    />
  );
}
