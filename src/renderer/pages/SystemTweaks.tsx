import TweakSection from "../components/TweakSection";
import { FREE_TWEAKS, PREMIUM_TWEAKS } from "../utils/tweakEngine";

const SYSTEM_TWEAKS = [
  ...FREE_TWEAKS,
  PREMIUM_TWEAKS.find((t) => t.id === "cpu-priority")!,
  PREMIUM_TWEAKS.find((t) => t.id === "disable-superfetch")!,
  PREMIUM_TWEAKS.find((t) => t.id === "disable-tracking")!,
  PREMIUM_TWEAKS.find((t) => t.id === "disable-xbox-services")!,
  PREMIUM_TWEAKS.find((t) => t.id === "disable-other-services")!,
  PREMIUM_TWEAKS.find((t) => t.id === "memory-usage")!,
  PREMIUM_TWEAKS.find((t) => t.id === "disable-memory-compression")!,
].filter(Boolean);

interface Props {
  isPremium: boolean;
  openLicenseModal: () => void;
}

export default function SystemTweaks({ isPremium, openLicenseModal }: Props) {
  return (
    <TweakSection
      title="TWEAKS SYSTÈME"
      subtitle="Optimisation Windows, timer, Hyper-V, SSD, Defender et MMCSS — 10 tweaks FREE inclus"
      tweaks={SYSTEM_TWEAKS}
      isPremium={isPremium}
      openLicenseModal={openLicenseModal}
    />
  );
}
