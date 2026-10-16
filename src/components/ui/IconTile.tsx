import React from "react";

interface IconTileProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  color: "salmon" | "mint" | "lavender" | "blue" | "green" | "gold";
  size?: "sm" | "md" | "lg";
}

export default function IconTile({
  children,
  color,
  size = "md",
  className = "",
  style,
  ...props
}: IconTileProps) {
  const colorClass = `tile-${color}`;

  const sizeStyle: React.CSSProperties =
    size === "sm"
      ? { width: "36px", height: "36px", borderRadius: "10px" }
      : size === "lg"
      ? { width: "54px", height: "54px", borderRadius: "14px" }
      : { width: "44px", height: "44px", borderRadius: "12px" };

  return (
    <div
      className={`icon-tile ${colorClass} ${className}`.trim()}
      style={{ ...sizeStyle, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
