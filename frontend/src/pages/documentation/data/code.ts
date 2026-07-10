import { BASE_URL } from "@/constants/endpoints";

export const CODE_EXAMPLE_JS = `const response = await fetch("${BASE_URL}/payment-intents", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    amount: 1500,
    return_url: "https://your-site.com/payment/success",
    receiver_account_number: 900001,
  }),
});

const intent = await response.json();
// Redirect user to the checkout page
window.location.href = intent.checkout_url;`;

export const CODE_EXAMPLE_CURL = `curl -X POST ${BASE_URL}/payment-intents \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 1500,
    "return_url": "https://your-site.com/payment/success",
    "receiver_account_number": 900001
  }'`;
