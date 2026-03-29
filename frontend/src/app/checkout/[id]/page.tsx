"use client";

import { useGetPaymentIntent } from "@/features/payments/hooks/useGetPaymentIntent";
import { useParams } from "next/navigation";

export default function CheckoutPage() {
  const params = useParams();
  const intentId = params.id as string;
  const { intentDetail, error, isLoading } = useGetPaymentIntent(intentId);

  if (isLoading) return <div>Loading payment details...</div>;
  if (error) return <div>{error}</div>;

  console.log(intentDetail)

  return <div>Checkout for intent: {intentId}</div>;
}
