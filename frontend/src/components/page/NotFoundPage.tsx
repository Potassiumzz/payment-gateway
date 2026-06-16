import { ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="space-y-4">
        <p className="font-mono text-primary text-sm">// 404</p>
        <h1 className="font-mono text-text-primary text-3xl font-bold">
          Page not found
        </h1>
        <p className="font-mono text-text-muted text-sm">
          The route you requested doesn't exist. Check the URL or go back.
        </p>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeftIcon size={14}/> go back
        </Button>
      </div>
    </div>
  );
}
