import { useState } from "react";
import { useCreateAccount } from "@/features/accounts/hooks/useCreateAccount";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";

export default function RegisterPage() {
  const { createIntent, error, isLoading } = useCreateAccount();

  const [ownerName, setOwnerName] = useState("");
  const [bankId, setBankId] = useState("");
  const [pin, setPin] = useState("");

  async function handleSubmit() {
    await createIntent({
      owner_name: ownerName,
      bank_id: Number(bankId),
      pin,
    });
  }

return (
  <main className="min-h-screen flex flex-col items-center justify-center px-6 py-8">
    <div className="w-full max-w-sm">
      <Card>
        <CardHeader
          title="Create account"
          description="Register your bank account"
        />
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="owner_name">Owner name</Label>
              <Input
                id="owner_name"
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Enter a fake name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bank_id">Bank ID</Label>
              <Input
                id="bank_id"
                type="number"
                value={bankId}
                onChange={(e) => setBankId(e.target.value)}
                placeholder="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin">PIN</Label>
              <Input
                id="pin"
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="1234"
                autoComplete="current-password"
              />
            </div>

            <FieldError message={error} />

            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
              className="w-full"
            >
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  </main>
);
}
