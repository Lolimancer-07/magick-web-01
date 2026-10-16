import React from "react";

interface ClayCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "white" | "gray";
  interactive?: boolean;
}

export default function ClayCard({
  children,
  variant = "white",
  interactive = false,
  className = "",
  style,
  ...props
}: ClayCardProps) {
  const baseClass = variant === "gray" ? "clay-card-gray" : "clay-card";
  const interactiveClass = interactive ? "clay-card-interactive" : "";

  return (
    <div
      className={`${baseClass} ${interactiveClass} ${className}`.trim()}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}
