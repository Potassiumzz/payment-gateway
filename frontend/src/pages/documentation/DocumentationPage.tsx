import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { FieldTable } from "./components/FieldTable";
import { REQUEST_FIELDS, RESPONSE_FIELDS } from "./data/fields";
import { BASE_URL } from "@/constants/endpoints";
import { CODE_EXAMPLE } from "./data/code";
import { CopyButton } from "@/components/ui/CopyButton";
import { STATUS_VALUES } from "./data/status";

export default function DocumentationPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-10">
      {/* Header */}
      <div className="space-y-2 border-b border-border pb-10">
        <p className="font-mono text-xs text-text-muted tracking-widest uppercase">gateway / docs</p>
        <h1 className="font-mono text-2xl font-semibold text-text-primary">Payment Intents</h1>
        <p className="font-mono text-sm text-text-secondary leading-relaxed">
          A payment intent represents a single payment session. Create one from your server, then redirect the
          user to the returned checkout URL to complete the flow.
        </p>
      </div>

      {/* Endpoint */}
      <Card>
        <CardHeader title="Endpoint" />
        <CardContent>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2 py-1 rounded-sm bg-primary/10 text-primary border border-primary/20">
              POST
            </span>
            <code className="font-mono text-sm text-text-secondary">
              {BASE_URL}
              <span className="text-text-primary">/payment-intents</span>
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Request */}
      <Card>
        <CardHeader title="Request body" description="Content-Type: application/json" />
        <CardContent>
          <FieldTable fields={REQUEST_FIELDS} />
        </CardContent>
      </Card>

      {/* Response */}
      <Card>
        <CardHeader title="Response" description="HTTP 201 Created" />
        <CardContent>
          <FieldTable fields={RESPONSE_FIELDS} />
        </CardContent>
      </Card>

      {/* Code example */}
      <Card>
        <CardHeader title="Example" badge={<CopyButton text={CODE_EXAMPLE} />} />
        <CardContent className="p-0">
          <pre className="font-mono text-xs text-text-secondary leading-relaxed p-6 overflow-x-auto">
            <code>{CODE_EXAMPLE}</code>
          </pre>
        </CardContent>
      </Card>

      {/* Status values */}
      <Card>
        <CardHeader title="Status values" />
        <CardContent>
          <div className="space-y-3">
            {STATUS_VALUES.map((s) => (
              <div key={s.value} className="flex items-start gap-4">
                <span className={cn("font-mono text-xs w-30 shrink-0 pt-px", s.color)}>{s.value}</span>
                <span className="font-mono text-xs text-text-secondary">{s.desc}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
