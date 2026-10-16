import React from "react";

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  animated?: boolean;
}

export default function ProgressBar({
  value,
  animated = true,
  className = "",
  style,
  ...props
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      className={`clay-progress-track ${className}`.trim()}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      style={style}
      {...props}
    >
      <div
        className="clay-progress-fill"
        style={{
          width: `${clamped}%`,
          transition: animated ? "width 0.4s ease" : "none",
        }}
      />
    </div>
  );
}
