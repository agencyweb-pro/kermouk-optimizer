import TweakSection from "../components/TweakSection";
import { PREMIUM_TWEAKS } from "../utils/tweakEngine";

const GPU_TWEAKS = [
  PREMIUM_TWEAKS.find((t) => t.id === "gpu-tdr")!,
  PREMIUM_TWEAKS.find((t) => t.id === "gpu-hwsched")!,
  PREMIUM_TWEAKS.find((t) => t.id === "disable-hpet")!,
].filter(Boolean);

interface Props {
  isPremium: boolean;
  openLicenseModal: () => void;
}

export default function GpuTweaks({ isPremium, openLicenseModal }: Props) {
  return (
    <TweakSection
      title="TWEAKS GPU"
      subtitle="Optimisation registre et drivers GPU pour des FPS stables et maximaux"
      tweaks={GPU_TWEAKS}
      isPremium={isPremium}
      openLicenseModal={openLicenseModal}
    />
  );
}
