import React from "react";
import { NAVIGATION_ROUTES } from "@/constants/routes";
import { useCreatePaymentIntent } from "@/features/payments/hooks/useCreatePaymentIntent";
import type { PaymentIntentPayload } from "@/features/payments/types/paymentIntent";
import { useNavigate } from "react-router-dom";
import { ContextBanner } from "./components/context-banner";

export default function SimulateMerchantPage() {
	const router = useNavigate();
	const [intent, setIntent] = React.useState<PaymentIntentPayload>({
		amount: 0,
	});
	const { createIntent, error, isLoading } = useCreatePaymentIntent();

	async function handleSubmit(e: React.SubmitEvent) {
		e.preventDefault();

		if (intent.amount <= 0) return;

		try {
			const data = await createIntent(intent);
			router(`${NAVIGATION_ROUTES.CHECKOUT_ROUTE}${data.id}`);
		} catch (err) {
			console.error("Error creating intent:", err);
		}
	}

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
      <div className="w-full max-w-lg space-y-8">
        {/* Card */}
        <div className="border border-border bg-surface rounded-sm">
          {/* Card header */}
          <div className="border-b border-border px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="font-mono text-sm font-semibold text-text-primary">
                Simulate Merchant Checkout
              </h1>
              <p className="font-sans text-xs text-text-muted mt-0.5">
                Triggers a payment intent creation
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              <span className="font-sans text-[2px] leading-none uppercase tracking-widest text-text-muted">
                sandbox
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            {/* Simulated request preview */}
            <div className="bg-background rounded-sm border border-border p-4 font-mono text-xs space-y-1">
              <p className="text-text-muted uppercase tracking-widest text-[10px] mb-2">
                Simulated request payload
              </p>
              <p className="text-text-muted">{"{"}</p>
              <p className="pl-4">
                <span className="text-secondary">"amount"</span>
                <span className="text-text-muted">: </span>
                <span className="text-primary">
                  {intent.amount > 0 ? intent.amount : "..."}
                </span>
              </p>
              <p className="text-text-muted">{"}"}</p>
            </div>

            {/* Amount field */}
            <div className="space-y-2">
              <label
                htmlFor="amount"
                className="font-mono text-xs text-text-secondary uppercase tracking-widest"
              >
                Amount{" "}
                <span className="text-text-muted normal-case tracking-normal font-sans">
                  (what the merchant backend would send)
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-text-muted">
                  $
                </span>
                <input
                  type="number"
                  id="amount"
                  min={0.01}
                  step={0.01}
                  placeholder="0.00"
                  className="w-full bg-background border border-border hover:border-border-strong focus:border-primary/50 focus:outline-none font-mono text-sm text-text-primary placeholder:text-text-muted pl-7 pr-4 py-2.5 rounded-sm transition-colors"
                  onChange={(e) =>
                    setIntent({ amount: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="font-mono text-xs text-red-400 border border-red-400/20 bg-red-400/5 px-3 py-2 rounded-sm">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || intent.amount <= 0}
              className="w-full bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono text-sm font-semibold px-5 py-2.5 rounded-sm transition-colors duration-150 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                  Creating intent...
                </>
              ) : (
                <>
                  Create Payment Intent
                </>
              )}
            </button>
          </form>
        </div>

        {/* Context banner */}
        <ContextBanner />

        {/* Footer note */}
        <p className="font-mono text-[11px] text-text-muted text-center mt-6">
          This flow is only accessible in sandbox mode.
        </p>
      </div>
    </main>
  );
}
