"use client";

import { useParams } from "next/navigation";

export default function CheckoutPage() {
  const params = useParams();
  return <div>Checkout for intent: {params.id}</div>;
}
