"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { v4 as uuidv4 } from "uuid";

interface PayPalCheckoutProps {
  plan: "monthly" | "lifetime";
  onSuccess: (licenseKey: string) => void;
}

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "YOUR_PAYPAL_CLIENT_ID_HERE";

const PRICES = {
  monthly: { amount: "4.99", currency: "EUR", label: "Abonnement mensuel" },
  lifetime: { amount: "29.99", currency: "EUR", label: "Licence à vie" },
};

export default function PayPalCheckout({ plan, onSuccess }: PayPalCheckoutProps) {
  const price = PRICES[plan];

  return (
    <PayPalScriptProvider
      options={{
        clientId: PAYPAL_CLIENT_ID,
        currency: "EUR",
        intent: "capture",
      }}
    >
      <PayPalButtons
        style={{
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "pay",
          height: 48,
        }}
        createOrder={(_data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: `KERMOUK OPTIMIZER Premium — ${price.label}`,
                amount: {
                  currency_code: price.currency,
                  value: price.amount,
                },
              },
            ],
          });
        }}
        onApprove={async (_data, actions) => {
          if (!actions.order) return;
          const order = await actions.order.capture();
          console.log("Paiement validé:", order);

          const licenseKey = uuidv4();
          const licenseData = {
            key: licenseKey,
            plan,
            orderId: order.id,
            purchaseDate: new Date().toISOString(),
            email: order.payer?.email_address || "",
          };

          localStorage.setItem("kermouk_license", JSON.stringify(licenseData));
          console.log("Email de confirmation simulé à:", order.payer?.email_address);
          console.log("Clé de licence générée:", licenseKey);

          onSuccess(licenseKey);
        }}
        onError={(err) => {
          console.error("Erreur PayPal:", err);
          alert("Une erreur est survenue lors du paiement. Veuillez réessayer.");
        }}
        onCancel={() => {
          console.log("Paiement annulé par l'utilisateur.");
        }}
      />
    </PayPalScriptProvider>
  );
}
