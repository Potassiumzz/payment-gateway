import { Card, CardContent } from "@/components/ui/Card";
import { CONTEXT_ITEMS } from "@/pages/simulate-merchant/components/context-banner-data";

export function ContextBanner() {
  return (
    <Card className="font-sans">
      <CardContent>
        {CONTEXT_ITEMS.map(({ question, answer }) => (
          <div key={question} className="space-y-1.5">
            <p className="text-xs text-text-secondary leading-relaxed tracking-wide">
              <span className="text-text-primary">{question}</span>
            </p>

            <div className="ml-1 border-l-2 border-tertiary/50 hover:border-tertiary pl-2 duration-200 text-xs tracking-wide space-y-2">
              {answer}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
