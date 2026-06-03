import TweakSection from "../components/TweakSection";
import { PREMIUM_TWEAKS } from "../utils/tweakEngine";

const NETWORK_TWEAKS = [
  PREMIUM_TWEAKS.find((t) => t.id === "tcp-autotune")!,
  PREMIUM_TWEAKS.find((t) => t.id === "tcp-rss")!,
  PREMIUM_TWEAKS.find((t) => t.id === "tcp-chimney")!,
  PREMIUM_TWEAKS.find((t) => t.id === "dns-cloudflare")!,
  PREMIUM_TWEAKS.find((t) => t.id === "nagle-algorithm")!,
  PREMIUM_TWEAKS.find((t) => t.id === "mtu-gaming")!,
  PREMIUM_TWEAKS.find((t) => t.id === "qos-fortnite")!,
  PREMIUM_TWEAKS.find((t) => t.id === "interrupt-affinity")!,
].filter(Boolean);

interface Props {
  isPremium: boolean;
  openLicenseModal: () => void;
}

export default function NetworkTweaks({ isPremium, openLicenseModal }: Props) {
  return (
    <TweakSection
      title="TWEAKS RÉSEAU"
      subtitle="TCP/IP, Nagle, MTU, QoS et Interrupt Affinity — optimisation complète pour Fortnite"
      tweaks={NETWORK_TWEAKS}
      isPremium={isPremium}
      openLicenseModal={openLicenseModal}
    />
  );
}
