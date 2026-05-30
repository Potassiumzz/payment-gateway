export const CONTEXT_ITEMS = [
  {
    question: "What is this?",
    answer: (
      <>
        <p>
          In a real integration, your backend hits{" "}
          <code className="text-primary bg-tertiary/10 px-1 py-0.5 rounded-sm text-[11px]">
            <span className="text-green-600">POST</span> /api/payment/intent
          </code>{" "}
          endpoint with an amount when a customer checks out and the gateway
          takes it from there.
        </p>

        <p>
          Since there's no external backend here, you're playing the role of
          that backend. Enter any amount in the input field above to simulate a
          checkout trigger.
        </p>
      </>
    ),
  },
];

