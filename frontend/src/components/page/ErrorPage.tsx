import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { ArrowLeftIcon } from "lucide-react";

const STATUS_LABELS: Record<number, string> = {
  400: "Bad request",
  403: "Access denied",
  422: "Validation error",
  500: "Server error",
};

interface ErrorPageProps {
  status?: number;
  message?: string;
}

export default function ErrorPage({ status = 500, message }: ErrorPageProps) {
  const navigate = useNavigate();
  const label = STATUS_LABELS[status] ?? "Unexpected error";

  return (
    <div className="bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <p className="font-mono text-primary text-sm mb-2">// {status}</p>
        <h1 className="font-mono text-text-primary text-3xl font-bold mb-3">
          {label}
        </h1>
        <p className="font-mono text-text-muted text-sm mb-8">
          {message ?? "Something went wrong. Try again or go back."}
        </p>
        <Button onClick={() => navigate(-1)} className="bg-transparent border border-white hover:bg-white/80 hover:text-black flex justify-self-center md:justify-self-start">
          <ArrowLeftIcon size={14}/> go back
        </Button>
      </div>
    </div>
  );
}
