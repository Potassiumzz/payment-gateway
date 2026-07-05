import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { FieldTable } from "./components/FieldTable";
import { REQUEST_FIELDS, RESPONSE_FIELDS } from "./data/fields";
import { BASE_URL } from "@/constants/endpoints";
import { CODE_EXAMPLE } from "./data/code";
import { CopyButton } from "@/components/ui/CopyButton";
import { STATUS_VALUES } from "./data/status";
import { TOC_ITEMS } from "./data/TOC";

export default function DocumentationPage() {
	const [activeId, setActiveId] = React.useState<string>("endpoint");

  function handleToClick (e: React.MouseEvent, id: string) {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      setActiveId(id);
    }, 500);
  };

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[visible.length - 1].target.id);
        }
      },
      { rootMargin: "-55% 0px -40% 0px" }
    );

    TOC_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

	return (
		<div className="max-w-5xl mx-auto px-6 py-16 flex gap-16 items-start">
    {/* Visual Representation of `rootMargin` of `IntersectionObserver`
        <div className="fixed top-0 left-0 right-0 h-[55%] bg-blue-500/10 pointer-events-none z-50" />
        <div className="fixed bottom-0 left-0 right-0 h-[40%] bg-green-500/10 pointer-events-none z-50" />
    */}
			{/* Main content */}
			<div className="flex-1 min-w-0 space-y-10">
				{/* Header */}
				<div className="space-y-2 border-b border-border pb-10">
					<p className="font-mono text-xs text-text-muted tracking-widest uppercase">gateway / docs</p>
					<h1 className="text-2xl font-semibold text-text-primary">Payment Intents</h1>
					<p className="text-sm text-text-secondary leading-relaxed">
						A payment intent represents a single payment session. Create one from your server, then redirect
						the user to the returned checkout URL to complete the flow.
					</p>
				</div>

				<div id="endpoint">
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
				</div>

				<div id="request">
					<Card>
						<CardHeader title="Request body" description="Content-Type: application/json" />
						<CardContent>
							<FieldTable fields={REQUEST_FIELDS} />
						</CardContent>
					</Card>
				</div>

				<div id="response">
					<Card>
						<CardHeader title="Response" description="HTTP 201 Created" />
						<CardContent>
							<FieldTable fields={RESPONSE_FIELDS} />
						</CardContent>
					</Card>
				</div>

				<div id="example">
					<Card>
						<CardHeader title="Example" badge={<CopyButton text={CODE_EXAMPLE} />} />
						<CardContent className="p-0">
							<pre className="font-mono text-xs text-text-secondary leading-relaxed p-6 overflow-x-auto">
								<code>{CODE_EXAMPLE}</code>
							</pre>
						</CardContent>
					</Card>
				</div>

				<div id="status">
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
			</div>

			<aside className="hidden lg:block w-48 shrink-0 sticky top-16 self-start">
				<p className="text-xs text-text-muted tracking-widest uppercase mb-4">On this page</p>
				<ul className="space-y-1">
					{TOC_ITEMS.map(({ id, label }) => (
						<li key={id}>
							<a
								href={`#${id}`}
                onClick={(e) => handleToClick(e, id)}
								className={cn(
									"block text-xs py-1 pl-3 border-l transition-colors duration-150",
									activeId === id
										? "border-primary text-text-primary"
										: "border-transparent text-text-muted hover:text-text-secondary hover:border-border-strong",
								)}
							>
								{label}
							</a>
						</li>
					))}
				</ul>
			</aside>
		</div>
	);
}
