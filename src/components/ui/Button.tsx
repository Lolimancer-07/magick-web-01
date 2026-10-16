import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "white";
  size?: "sm" | "md" | "lg";
  href?: string;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className = "",
  style,
  ...props
}: ButtonProps) {
  const variantClass =
    variant === "primary" ? "btn-green" : variant === "secondary" ? "btn-blue" : "btn-white";

  const sizeStyle: React.CSSProperties =
    size === "sm"
      ? { minHeight: "38px", padding: "6px 16px", fontSize: "0.85rem" }
      : size === "lg"
      ? { minHeight: "54px", padding: "14px 32px", fontSize: "1.1rem" }
      : { minHeight: "46px", padding: "10px 22px", fontSize: "0.95rem" };

  const combinedStyle = { ...sizeStyle, ...style };

  if (href) {
    return (
      <Link
        href={href}
        className={`btn-clay ${variantClass} ${className}`.trim()}
        style={combinedStyle}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={`btn-clay ${variantClass} ${className}`.trim()}
      style={combinedStyle}
      {...props}
    >
      {children}
    </button>
  );
}
