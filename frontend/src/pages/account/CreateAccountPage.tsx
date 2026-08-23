import React from "react";
import { useCreateAccount } from "@/features/accounts/hooks/useCreateAccount";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";
import type { CreateAccountPayload } from "@/features/accounts/types/account";
import { createAccountFormFields } from "./data/formFields";
import { useNavigate } from "react-router-dom";
import { NAVIGATION_ROUTES } from "@/constants/routes";
import { invalidateCacheByPrefix } from "@/cache/queryCache";
import { useGetBanks } from "@/features/banks/hooks/useGetBanks";
import { Select } from "@/components/ui/Select";
import { MAX_PIN_DIGITS } from "@/constants/config";

export default function CreateAccountPage() {
  const navigate = useNavigate();

  const { createAccount, error, isLoading } = useCreateAccount();
  const {banksData, isLoading: isLoadingBanks, error: bankError} = useGetBanks();

  const [values, setValues] = React.useState({
    ownerName: "",
    bankId: 0,
    pin: "",
  } satisfies CreateAccountPayload)

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();

    if (!values.ownerName.trim() || !values.bankId || values.pin.length !== 4) return;

    try {
      await createAccount({...values, bankId: Number(values.bankId)});
      if (!isLoading) {
        invalidateCacheByPrefix("ACCOUNT_LIST_");
        navigate(NAVIGATION_ROUTES.ACCOUNTS);
      }
    } catch (err) {
      console.log(err);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setValues((p) => ({...p, [e.target.name]: e.target.value}))
  }

return (
  <div className="flex flex-col items-center justify-center px-6 py-8 w-lg">
    <div className="w-full">
      <Card>
        <CardHeader
          title="Create account"
          description="Register your bank account"
        />
        <div className="px-6 pt-4 text-xs text-tertiary/70">
          Accounts are automatically deleted after 2 days to keep the sandbox
          clean - nobody's holding onto test data here.
        </div>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {createAccountFormFields.map((field) => {
              if (field.type === "select") {
                return (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Select
                      id={field.name}
                      name={field.name}
                      placeholder={isLoadingBanks ? "Loading banks..." : field.placeholder}
                      disabled={isLoading || isLoadingBanks}
                      value={values.bankId === 0 ? "" : values.bankId}
                      onChange={handleChange}
                      options={(banksData ?? []).map((bank) => ({
                        label: bank.name,
                        value: bank.id,
                      }))}
                    />
                  </div>
                );
              }

              const value = values[field.name as keyof typeof values];
              return (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Input
                    id={field.name}
                    type={field.inputType}
                    placeholder={field.placeholder}
                    name={field.name}
                    autoComplete={field.autoComplete}
                    disabled={isLoading}
                    value={value === 0 ? "" : value}
                    onChange={handleChange}
                  />
                </div>
              );
            })}

            <FieldError message={error || bankError} />

            <Button
              type="submit"
              isLoading={isLoading}
              disabled={
                isLoading ||
                !values.ownerName.trim() ||
                !values.bankId ||
                values.pin.length !== MAX_PIN_DIGITS
              }
              className="w-full"
            >
            {isLoading ? "Hold on..." : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
);
}
