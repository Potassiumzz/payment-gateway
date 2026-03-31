import { PaymentIntentResponse } from "@/types/paymentIntent";

type CheckoutFormProps = {
  intentDetail: PaymentIntentResponse;
}
export default function CheckoutForm({ intentDetail }: CheckoutFormProps) {
  const checkoutFormFields = [
    {
      id: "1",
      label: "Account Number",
      inputType: "number",
      placeholder: "Your account number"
    },
    {
      id: "2",
      label: "Receiver Account Number",
      inputType: "number",
      placeholder: "Receiver's account number"
    },
    // {
    //   id: "3",
    //   label: "Email",
    //   inputType: "email",
    //   placeholder: "email@example.com"
    // },
    {
      id: "4",
      label: "Security pin",
      inputType: "password",
      placeholder: "Your security pin"
    }
  ]

  function handlePaySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("paid");
  }

  return (
    <form onSubmit={handlePaySubmit}>
      {checkoutFormFields.map((field) => {
        return (
          <div key={field.id}>
            <label>{field.label}</label>
            <input type={field.inputType} placeholder={field.placeholder} />
          </div>
        )
      })}
      <button type="submit">Pay {intentDetail.amount}</button>
    </form>
  )
}
