import { useParams } from "react-router-dom";
import { useGetTransactionByID } from "@/features/transactions/hooks/useGetTransactionByID";

export default function PaymentSuccessPage() {
	const {id} = useParams();

  if (!id) return <div>Invalid transaction ID.</div>

	const { transactionDetail, error, isLoading } = useGetTransactionByID(id);

	if (isLoading) return <div>Loading payment details...</div>;
	if (error || !transactionDetail) return <div>{error}</div>;

  return (
    <div>
      <h1>Payment Successful</h1>
      <p>Amount paid: {transactionDetail.amount_transferred}</p>
      <p>Payment status: {transactionDetail?.status}</p>
    </div>
  )
}
