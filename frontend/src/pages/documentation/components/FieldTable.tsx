import { cn } from "@/lib/utils";

export type Field = {
  name: string;
  type: string;
  required: boolean;
  description: string;
};

export function FieldTable({ fields }: { fields: Field[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-mono border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2.5 pr-6 text-text-muted font-medium tracking-wide">field</th>
            <th className="text-left py-2.5 pr-6 text-text-muted font-medium tracking-wide">type</th>
            <th className="text-left py-2.5 pr-6 text-text-muted font-medium tracking-wide">required</th>
            <th className="text-left py-2.5 text-text-muted font-medium tracking-wide">description</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((f, i) => (
            <tr
              key={f.name}
              className={cn("border-b border-border-subtle", i === fields.length - 1 && "border-none")}
            >
              <td className="py-3 pr-6 text-text-primary">{f.name}</td>
              <td className="py-3 pr-6 text-tertiary">{f.type}</td>
              <td className="py-3 pr-6">
                {f.required ? (
                  <span className="text-secondary">yes</span>
                ) : (
                  <span className="text-text-muted">no</span>
                )}
              </td>
              <td className="py-3 text-text-secondary leading-relaxed">{f.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
