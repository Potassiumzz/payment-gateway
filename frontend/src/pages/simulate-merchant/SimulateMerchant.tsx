import React from "react";
import { NAVIGATION_ROUTES } from "@/constants/routes";
import { useCreatePaymentIntent } from "@/features/payments/hooks/useCreatePaymentIntent";
import type { PaymentIntentPayload } from "@/features/payments/types/paymentIntent";
import { useNavigate } from "react-router-dom";
import { ContextBanner } from "./components/context-banner";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { FieldError } from "@/components/ui/FieldError";
import { Button } from "@/components/ui/Button";

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

        <Card>
          <CardHeader
            title="Simulate Merchant Checkout"
            description="Triggers a payment intent creation"
            badge={
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                <span className="font-sans text-[10px] text-text-muted uppercase tracking-widest">
                  sandbox
                </span>
              </div>
            }
          />
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

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

              <div className="space-y-2">
                <Label htmlFor="amount" hint="what the merchant backend would send" hintClassName="capitalize text-[4px]! font-sans">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  prefix="$"
                  min={0.01}
                  step={0.01}
                  onChange={(e) => setIntent({ amount: Number(e.target.value) })}
                />
              </div>

              <FieldError message={error} />

              <Button
                type="submit"
                isLoading={isLoading}
                disabled={intent.amount <= 0}
                className="w-full"
              >
                Create Payment Intent
              </Button>

            </form>
          </CardContent>
        </Card>

        <ContextBanner />

        <p className="font-mono text-[11px] text-text-muted text-center">
          This flow is only accessible in sandbox mode.
        </p>

      </div>
    </main>
  );
}
