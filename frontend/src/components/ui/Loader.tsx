import React from "react";

type EllipsisLoaderProps = {
  value?: string;
}

export function EllipsisLoader({value = "Loading"}: EllipsisLoaderProps) {
  const [dots, setDots] = React.useState("");

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div className="font-mono text-md text-text-muted">
        {value}
        <span className="inline-block w-[3ch] text-left">
          {dots}
        </span>
      </div>
    </div>
  );
}
