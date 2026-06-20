import React from "react";
import { useCreateAccount } from "@/features/accounts/hooks/useCreateAccount";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";
import { registerFormFields } from "./data/formFields";
import type { CreateAccountPayload } from "@/features/accounts/types/account";

export default function RegisterPage() {
  const { createAccount, error, isLoading } = useCreateAccount();

  const [values, setValues] = React.useState({
    owner_name: "",
    bank_id: 0,
    pin: "",
  } satisfies CreateAccountPayload)

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();

    try {
      const res = await createAccount({...values, bank_id: Number(values.bank_id)});
      if (!isLoading) console.log("Account created", {...res});
    } catch (err) {
      console.log(err);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValues((p) => ({...p, [e.target.name]: e.target.value}))
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
            {registerFormFields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  type={field.inputType}
                  placeholder={field.placeholder}
                  name={field.name}
                  autoComplete={field.autoComplete}
                  disabled={isLoading}
                  onChange={handleChange}
                />
              </div>
            ))}
            <FieldError message={error} />

            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
              className="w-full"
            >
            {isLoading ? "Hold on..." : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  </main>
);
}
