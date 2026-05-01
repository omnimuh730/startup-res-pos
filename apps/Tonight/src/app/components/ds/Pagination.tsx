import { useMemo, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

type PaginationVariant = "default" | "outline" | "minimal" | "pill";
type PaginationSize = "sm" | "md" | "lg";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  variant?: PaginationVariant;
  size?: PaginationSize;
  showFirstLast?: boolean;
  showPageInfo?: boolean;
  disabled?: boolean;
  className?: string;
}

const sizeStyles: Record<PaginationSize, { btn: string; text: string }> = {
  sm: { btn: "w-7 h-7 text-[0.6875rem]", text: "text-[0.6875rem]" },
  md: { btn: "w-9 h-9 text-[0.8125rem]", text: "text-[0.8125rem]" },
  lg: { btn: "w-11 h-11 text-[0.9375rem]", text: "text-[0.9375rem]" },
};

function generatePages(current: number, total: number, siblings: number): (number | "...")[] {
  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  if (total <= 2 * siblings + 5) return range(1, total);

  const leftSib = Math.max(current - siblings, 1);
  const rightSib = Math.min(current + siblings, total);

  const showLeftDots = leftSib > 2;
  const showRightDots = rightSib < total - 1;

  if (!showLeftDots && showRightDots) {
    const left = range(1, 2 * siblings + 3);
    return [...left, "...", total];
  }

  if (showLeftDots && !showRightDots) {
    const right = range(total - (2 * siblings + 2), total);
    return [1, "...", ...right];
  }

  return [1, "...", ...range(leftSib, rightSib), "...", total];
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  variant = "default",
  size = "md",
  showFirstLast = false,
  showPageInfo = false,
  disabled = false,
  className = "",
}: PaginationProps) {
  const pages = useMemo(
    () => generatePages(currentPage, totalPages, siblingCount),
    [currentPage, totalPages, siblingCount]
  );

  const s = sizeStyles[size];
  const iconSize = size === "sm" ? 14 : size === "md" ? 16 : 20;

  const getButtonClass = (isActive: boolean) => {
    const base = `inline-flex items-center justify-center rounded-lg transition-colors shrink-0 ${s.btn}`;
    if (disabled) return `${base} opacity-40 cursor-not-allowed`;

    if (variant === "default") {
      return `${base} cursor-pointer ${
        isActive ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
      }`;
    }
    if (variant === "outline") {
      return `${base} border cursor-pointer ${
        isActive ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-secondary"
      }`;
    }
    if (variant === "pill") {
      return `${base} rounded-full cursor-pointer ${
        isActive ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
      }`;
    }
    // minimal
    return `${base} cursor-pointer ${
      isActive ? "text-primary underline underline-offset-4" : "text-muted-foreground hover:text-foreground"
    }`;
  };

  const navBtnClass = `inline-flex items-center justify-center rounded-lg border border-border transition-colors shrink-0 ${s.btn} ${
    disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-secondary cursor-pointer"
  }`;

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={`inline-flex items-center gap-1 ${className}`}
    >
      {showFirstLast && (
        <button
          onClick={() => !disabled && onPageChange(1)}
          disabled={disabled || currentPage === 1}
          className={navBtnClass}
          aria-label="First page"
        >
          <ChevronsLeft size={iconSize} />
        </button>
      )}

      <button
        onClick={() => !disabled && currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={disabled || currentPage === 1}
        className={navBtnClass}
        aria-label="Previous page"
      >
        <ChevronLeft size={iconSize} />
      </button>

      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} className={`${s.btn} inline-flex items-center justify-center text-muted-foreground`}>
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => !disabled && onPageChange(page)}
            className={getButtonClass(page === currentPage)}
            aria-current={page === currentPage ? "page" : undefined}
            aria-label={`Page ${page}`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => !disabled && currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={disabled || currentPage === totalPages}
        className={navBtnClass}
        aria-label="Next page"
      >
        <ChevronRight size={iconSize} />
      </button>

      {showFirstLast && (
        <button
          onClick={() => !disabled && onPageChange(totalPages)}
          disabled={disabled || currentPage === totalPages}
          className={navBtnClass}
          aria-label="Last page"
        >
          <ChevronsRight size={iconSize} />
        </button>
      )}

      {showPageInfo && (
        <span className={`${s.text} text-muted-foreground ml-2`}>
          Page {currentPage} of {totalPages}
        </span>
      )}
    </nav>
  );
}
