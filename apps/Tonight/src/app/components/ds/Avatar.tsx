import { useState, type ImgHTMLAttributes } from "react";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
type AvatarShape = "circle" | "rounded" | "square";
type AvatarStatus = "online" | "offline" | "away" | "busy" | "none";

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "size"> {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  status?: AvatarStatus;
  className?: string;
}

const sizeMap: Record<AvatarSize, { box: string; text: string; status: string }> = {
  xs: { box: "w-6 h-6", text: "text-[0.5rem]", status: "w-2 h-2 border" },
  sm: { box: "w-8 h-8", text: "text-[0.625rem]", status: "w-2.5 h-2.5 border-[1.5px]" },
  md: { box: "w-10 h-10", text: "text-[0.75rem]", status: "w-3 h-3 border-[1.5px]" },
  lg: { box: "w-12 h-12", text: "text-[0.875rem]", status: "w-3.5 h-3.5 border-2" },
  xl: { box: "w-16 h-16", text: "text-[1.125rem]", status: "w-4 h-4 border-2" },
  "2xl": { box: "w-20 h-20", text: "text-[1.5rem]", status: "w-5 h-5 border-2" },
};

const shapeMap: Record<AvatarShape, string> = {
  circle: "rounded-full",
  rounded: "rounded-xl",
  square: "rounded-none",
};

const statusColorMap: Record<AvatarStatus, string> = {
  online: "bg-success",
  offline: "bg-muted-foreground",
  away: "bg-warning",
  busy: "bg-destructive",
  none: "",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function hashColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 55%, 60%)`;
}

export function Avatar({
  src,
  alt,
  name = "",
  size = "md",
  shape = "circle",
  status = "none",
  className = "",
  ...props
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const s = sizeMap[size];
  const showImage = src && !imgError;

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div
        className={`${s.box} ${shapeMap[shape]} overflow-hidden flex items-center justify-center`}
        style={!showImage ? { backgroundColor: hashColor(name || "U") } : undefined}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt || name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
            {...props}
          />
        ) : (
          <span className={`${s.text} text-white select-none`}>
            {name ? getInitials(name) : "?"}
          </span>
        )}
      </div>
      {status !== "none" && (
        <span
          className={`absolute bottom-0 right-0 ${s.status} ${statusColorMap[status]} ${shapeMap[shape] === "rounded-full" ? "rounded-full" : "rounded-full"} border-background`}
        />
      )}
    </div>
  );
}

// ── AvatarGroup ────────────────────────────────────────────
export interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: AvatarSize;
  className?: string;
}

export function AvatarGroup({ children, max = 5, size = "md", className = "" }: AvatarGroupProps) {
  const childArr = Array.isArray(children) ? children : [children];
  const visible = childArr.slice(0, max);
  const overflow = childArr.length - max;

  return (
    <div className={`flex items-center -space-x-2 ${className}`}>
      {visible.map((child, i) => (
        <div key={i} className="ring-2 ring-background rounded-full">
          {child}
        </div>
      ))}
      {overflow > 0 && (
        <div
          className={`${sizeMap[size].box} rounded-full bg-muted flex items-center justify-center ring-2 ring-background`}
        >
          <span className={`${sizeMap[size].text} text-muted-foreground`}>+{overflow}</span>
        </div>
      )}
    </div>
  );
}
