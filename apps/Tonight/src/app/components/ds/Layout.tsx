import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

// ── Container ──────────────────────────────────────────────
type ContainerSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  padded?: boolean;
  centered?: boolean;
}

const containerSizes: Record<ContainerSize, string> = {
  sm: "max-w-xl",
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-7xl",
  "2xl": "max-w-[96rem]",
  full: "max-w-full",
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = "xl", padded = true, centered = true, className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          ${containerSizes[size]}
          ${padded ? "px-4 sm:px-6" : ""}
          ${centered ? "mx-auto" : ""}
          ${className}
        `.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";

// ── Stack ──────────────────────────────────────────────────
type StackDirection = "row" | "column" | "row-reverse" | "column-reverse";
type StackAlign = "start" | "center" | "end" | "stretch" | "baseline";
type StackJustify = "start" | "center" | "end" | "between" | "around" | "evenly";
type StackGap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: StackDirection;
  align?: StackAlign;
  justify?: StackJustify;
  gap?: StackGap;
  wrap?: boolean;
  fullWidth?: boolean;
}

const dirMap: Record<StackDirection, string> = {
  row: "flex-row",
  column: "flex-col",
  "row-reverse": "flex-row-reverse",
  "column-reverse": "flex-col-reverse",
};

const alignMap: Record<StackAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const justifyMap: Record<StackJustify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

const gapMap: Record<StackGap, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
};

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      direction = "column",
      align = "stretch",
      justify = "start",
      gap = 4,
      wrap = false,
      fullWidth = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          flex
          ${dirMap[direction]}
          ${alignMap[align]}
          ${justifyMap[justify]}
          ${gapMap[gap]}
          ${wrap ? "flex-wrap" : ""}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Stack.displayName = "Stack";

// ── HStack / VStack convenience ────────────────────────────
export function HStack(props: Omit<StackProps, "direction">) {
  return <Stack direction="row" align="center" {...props} />;
}

export function VStack(props: Omit<StackProps, "direction">) {
  return <Stack direction="column" {...props} />;
}

// ── Grid ───────────────────────────────────────────────────
type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 12;

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: GridCols;
  mdCols?: GridCols;
  lgCols?: GridCols;
  gap?: StackGap;
}

const colMap: Record<GridCols, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  12: "grid-cols-12",
};

const mdColMap: Record<GridCols, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
  12: "md:grid-cols-12",
};

const lgColMap: Record<GridCols, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
  12: "lg:grid-cols-12",
};

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ cols = 1, mdCols, lgCols, gap = 4, className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          grid
          ${colMap[cols]}
          ${mdCols ? mdColMap[mdCols] : ""}
          ${lgCols ? lgColMap[lgCols] : ""}
          ${gapMap[gap]}
          ${className}
        `.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = "Grid";
