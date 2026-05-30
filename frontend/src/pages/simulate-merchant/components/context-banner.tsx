import { CONTEXT_ITEMS } from "@/pages/simulate-merchant/components/context-banner-data";

export function ContextBanner() {
  return (
    <div className="border border-border bg-surface rounded-sm p-4 font-sans">
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
    </div>
  );
}
