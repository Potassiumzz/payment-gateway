"use client";

import { useCreatePaymentIntent } from "@/hooks/api/useCreatePaymentIntent";
import { useRouter } from "next/navigation"
import React from "react";

export default function SimulateMerchantPage() {
  const router = useRouter();
  const [intentAmount, setIntentAmount] = React.useState<string>("");
  const { createIntent, error, isLoading } = useCreatePaymentIntent();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const data = await createIntent(Number(intentAmount));
      console.log("Payment Intent ID:", data.id);
      router.push(`/checkout/${data.id}`)
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
            onChange={(e) => setIntentAmount(e.target.value)}
          />
        </div>
        <button type="submit">Create payment intent</button>
      </form>
    </div>
  )
}
