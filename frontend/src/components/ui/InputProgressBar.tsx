import { useFakeProgress } from "@/lib/hooks/useFakeProgressBar";

export function InputProgressBar({ active }: { active: boolean }) {
  const { progress, visible, fading } = useFakeProgress(active);

  if (!visible) return null;

  return (
  <div
    className={`
      absolute bottom-0 left-0 right-0 h-0.5 overflow-visible
      rounded-b-sm pointer-events-none
      transition-opacity duration-250
      ${fading ? "opacity-0" : "opacity-100"}
    `}
    aria-hidden="true"
  >
    <div
      className="
        h-full bg-white
        transition-[width]
        ease-[cubic-bezier(0.22,1,0.36,1)]
        drop-shadow-[0_0_4px_#3b82f6]
        drop-shadow-[0_0_8px_#3b82f6]
      "
      style={{
        width: `${progress}%`,
        transitionDuration: progress === 100 ? "250ms" : "400ms",
        boxShadow: `
          0 0 2px rgba(255,255,255,0.9),
          0 0 5px rgba(255,255,255,0.6),
          0 0 8px rgba(59,130,246,0.45)
        `,
      }}
    />
    </div>
  );
}
