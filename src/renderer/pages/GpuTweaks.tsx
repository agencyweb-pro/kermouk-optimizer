import TweakSection from "../components/TweakSection";
import { PREMIUM_TWEAKS } from "../utils/tweakEngine";

const GPU_TWEAKS = [
  PREMIUM_TWEAKS.find((t) => t.id === "gpu-tdr")!,
  PREMIUM_TWEAKS.find((t) => t.id === "gpu-hwsched")!,
  PREMIUM_TWEAKS.find((t) => t.id === "disable-hpet")!,
  PREMIUM_TWEAKS.find((t) => t.id === "nvidia-ull")!,
  PREMIUM_TWEAKS.find((t) => t.id === "nvidia-shader-cache")!,
  PREMIUM_TWEAKS.find((t) => t.id === "nvidia-auto-boost")!,
  PREMIUM_TWEAKS.find((t) => t.id === "nvidia-power-management")!,
].filter(Boolean);

interface Props {
  isPremium: boolean;
  openLicenseModal: () => void;
}

export default function GpuTweaks({ isPremium, openLicenseModal }: Props) {
  return (
    <TweakSection
      title="TWEAKS GPU"
      subtitle="TDR, Hardware Scheduling, Ultra Low Latency NVIDIA et Power Management Maximum"
      tweaks={GPU_TWEAKS}
      isPremium={isPremium}
      openLicenseModal={openLicenseModal}
    />
  );
}
