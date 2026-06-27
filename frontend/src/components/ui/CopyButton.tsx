import React from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-text-secondary transition-colors duration-150 cursor-pointer"
    >
      {copied ? <CheckIcon size={13} className="text-secondary" /> : <CopyIcon size={13} />}
      {copied ? "copied" : "copy"}
    </button>
  );
}
