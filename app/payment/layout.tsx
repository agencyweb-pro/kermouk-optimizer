import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium — Kermouk Optimizer",
  description:
    "Passe Premium sur Kermouk Optimizer pour débloquer tous les tweaks avancés : réseau TCP/IP, GPU, CPU, Fortnite. 4,99€/mois ou 29,99€ à vie.",
  alternates: { canonical: "https://kermouk.gg/payment" },
};

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
