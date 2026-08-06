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
import { MAX_AMOUNT_VALUE } from "@/constants/config";
import { getDefaultReceiver } from "@/lib/storage";

export default function SimulateMerchantPage() {
  const router = useNavigate();

  const receiver = getDefaultReceiver();
  const [intent, setIntent] = React.useState<PaymentIntentPayload>({
      amount: 0,
      ...(receiver && { receiver_account_number: receiver.accountNumber }),
  });

  const [maxAmountError, setMaxAmountError] = React.useState("");
  const [rawAmount, setRawAmount] = React.useState("");

	const { createIntent, error, isLoading } = useCreatePaymentIntent();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    if (value !== "" && !/^\d*\.?\d*$/.test(value)) return;
    setRawAmount(value);
    const amount = parseFloat(value) || 0;

    // Allow clearing the field
    if (value === "") {
      setIntent({ amount: 0 });
      setMaxAmountError("");
      return;
    }

    if (amount > MAX_AMOUNT_VALUE) {
      setMaxAmountError(`Maximum amount to create payment intent is $${MAX_AMOUNT_VALUE.toLocaleString()}`);
      return;
    }

    setMaxAmountError("");
    setIntent({ amount });
  }

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
    <div className="flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-lg space-y-8">

        <Card>
          <CardHeader
            title="Simulate Merchant Checkout"
            description="Triggers a payment intent creation"
            badge={
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                <span className="hidden md:block font-sans text-[10px] text-text-muted uppercase tracking-widest">
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
                    {rawAmount && parseFloat(rawAmount) > 0 ? rawAmount : "..."}
                  </span>
                  {receiver && <span className="text-text-muted">,</span>}
                </p>
                {receiver && (
                  <p className="pl-4">
                    <span className="text-secondary">"receiver_account_number"</span>
                    <span className="text-text-muted">: </span>
                    <span className="text-primary">{receiver.accountNumber}</span>
                    <span className="text-text-muted">,</span>
                  </p>
                )}
                <div className="pl-4">
                  <p className="line-through decoration-white/50 decoration-2">
                    <span className="text-secondary">"return_url"</span>
                    <span className="text-text-muted">: </span>
                    <span className="text-text-muted">"https://your-return-site.com"</span>
                    <span className="text-text-muted">,</span>
                  </p>
                  <p className="text-text-muted/60 text-[10px] no-underline">
                    // ignored - real gateways redirect here post-payment
                  </p>
                </div>
                <p className="text-text-muted">{"}"}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" hint="what the merchant backend would send" hintClassName="capitalize text-[4px]! font-sans">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="text"
                  placeholder="0.00"
                  leftIcon="$"
                  min={1}
                  step={1}
                  max={MAX_AMOUNT_VALUE}
                  value={rawAmount}
                  inputMode="numeric"
                  onChange={(e) =>  handleChange(e)}
                />
              </div>

              <FieldError message={maxAmountError || error} />

              <Button
                type="submit"
                isLoading={isLoading}
                disabled={intent.amount <= 0}
                className="w-full capitalize"
              >
              {isLoading ? "Creating payment intent" : "Create payment intent"}
              </Button>

            </form>
          </CardContent>
        </Card>

        <ContextBanner />

        <p className="text-[11px] text-text-muted text-center">
          This flow is only accessible in sandbox mode.
        </p>

      </div>
    </div>
  );
}
