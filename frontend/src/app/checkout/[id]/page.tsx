"use client";

import { useGetPaymentIntent } from "@/features/payments/hooks/useGetPaymentIntent";
import { useParams } from "next/navigation";
import CheckoutForm from "../components/checkoutForm";

export default function CheckoutPage() {
  const params = useParams();
  const intentId = params.id as string;
  const { intentDetail, error, isLoading } = useGetPaymentIntent(intentId);

  if (isLoading) return <div>Loading payment details...</div>;
  if (error || !intentDetail) return <div>{error}</div>;

  console.log(intentDetail)

  return (
    <div>
      <h1>Checkout</h1>
      <dl>
        <dt>Total Amount: {intentDetail.amount}</dt>
      </dl>
      <CheckoutForm intentDetail={intentDetail} />
    </div>
  );
}
