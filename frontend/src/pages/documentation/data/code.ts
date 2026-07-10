import { BACKEND_ENDPOINTS, BASE_URL } from "@/constants/endpoints";

export const CODE_EXAMPLE_JS = `const response = await fetch("${BASE_URL}${BACKEND_ENDPOINTS.PAYMENT_INTENTS_ENDPOINT}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    amount: 50,
    return_url: "https://your-site.com/payment/success",
    receiver_account_number: 100001,
  }),
});

const intent = await response.json();
// Redirect user to the checkout page
window.location.href = intent.checkout_url;`;

export const CURL_BASE_URL = BASE_URL.startsWith("http") ? BASE_URL : `http:${BASE_URL}`;

export const CODE_EXAMPLE_CURL = `curl -X POST ${CURL_BASE_URL}${BACKEND_ENDPOINTS.PAYMENT_INTENTS_ENDPOINT} \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 50,
    "return_url": "https://your-site.com/payment/success",
    "receiver_account_number": 100001
  }'`;
