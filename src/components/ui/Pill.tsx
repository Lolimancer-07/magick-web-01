import React from "react";

interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  color?: "green" | "blue" | "salmon" | "mint" | "lavender";
}

export default function Pill({
  children,
  color = "blue",
  className = "",
  style,
  ...props
}: PillProps) {
  const colorClass = `pill-${color}`;

  return (
    <span
      className={`clay-pill ${colorClass} ${className}`.trim()}
      style={style}
      {...props}
    >
      {children}
    </span>
  );
}
