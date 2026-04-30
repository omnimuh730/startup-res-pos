import type { CSSProperties } from "react";

interface TonightLogoMarkProps {
  className?: string;
  size?: number;
  color?: string;
  style?: CSSProperties;
  title?: string;
}

interface TonightLogoBadgeProps extends TonightLogoMarkProps {
  variant?: "plain" | "soft" | "solid";
}

export function TonightLogoMark({
  className,
  size,
  color = "#D93844",
  style,
  title = "Tonight",
}: TonightLogoMarkProps) {
  return (
    <svg
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: size, height: size, ...style }}
      role="img"
      aria-label={title}
    >
      <circle cx="20" cy="50" r="12" fill={color} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M75 85C94.33 85 110 69.33 110 50C110 30.67 94.33 15 75 15C55.67 15 40 30.67 40 50C40 69.33 55.67 85 75 85ZM75 62C81.627 62 87 56.627 87 50C87 43.373 81.627 38 75 38C68.373 38 63 43.373 63 50C63 56.627 68.373 62 75 62Z"
        fill={color}
      />
    </svg>
  );
}

export function TonightLogoBadge({
  className = "",
  size = 56,
  color = "#D93844",
  variant = "soft",
  style,
  title,
}: TonightLogoBadgeProps) {
  const variantClass = {
    plain: "bg-transparent",
    soft: "bg-primary/10 shadow-[0_12px_28px_rgba(255,56,92,0.12)]",
    solid: "bg-primary shadow-[0_12px_28px_rgba(255,56,92,0.22)]",
  }[variant];
  const markColor = variant === "solid" ? "white" : color;

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-[1.25rem] ${variantClass} ${className}`}
      style={{ width: size, height: size, ...style }}
    >
      <TonightLogoMark size={size * 0.74} color={markColor} title={title} />
    </span>
  );
}
