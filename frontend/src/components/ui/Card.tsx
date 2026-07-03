import { cn } from "@/lib/utils";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

type CardHeaderProps = {
  title: string;
  description?: string;
  badge?: React.ReactNode;  // top-right status badge, icon, etc.
  className?: string;
};

type CardContentProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("border border-border bg-surface rounded-sm", className)}>
      {children}
    </div>
  );
}

export function CardHeader({ title, description, badge, className }: CardHeaderProps) {
  return (
    <div
      className={cn(
        "border-b border-border px-6 py-4 flex xl:items-center justify-between",
        className
      )}
    >
      <div>
        <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
        {description && (
          <p className="text-xs text-text-primary/60 mt-0.5">{description}</p>
        )}
      </div>
      {badge && <div>{badge}</div>}
    </div>
  );
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn("px-6 py-6", className)}>
      {children}
    </div>
  );
}
