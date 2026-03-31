"use client";

import { CHECKOUT_ROUTE } from "@/constants/routes";
import { useCreatePaymentIntent } from "@/features/payments/hooks/useCreatePaymentIntent";
import { PaymentIntentPayload } from "@/features/payments/types/paymentIntent";
import { useRouter } from "next/navigation"
import React from "react";

export default function SimulateMerchantPage() {
  const router = useRouter();
  const [intent, setIntent] = React.useState<PaymentIntentPayload>({
    amount: 0,
  });
  const { createIntent, error, isLoading } = useCreatePaymentIntent();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (intent.amount <= 0) return;

    try {
      const { data } = await createIntent(intent);
      router.push(`${CHECKOUT_ROUTE}${data.id}`)
    } catch (err) {
      console.error("Error creating intent:", err);
    }
  }

  return (
    <div>
      <form className="flex flex-col max-w-80 gap-5 mx-auto" onSubmit={handleSubmit}>
        <div className="space-x-2">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            className="border"
            onChange={(e) => setIntent({ amount: Number(e.target.value) })}
          />
        </div>
        <button type="submit" disabled={isLoading}>{isLoading ? "Loading..." : "Create payment intent"}</button>
      </form>
      {error && <p>Error: {error}</p>}
    </div>
  )
}
