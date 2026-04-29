import { motion, type Variants, type Transition } from "motion/react";
import { type ReactNode, type HTMLAttributes } from "react";
import { useMemo } from "react";

// ── Preset Animations ──────────────────────────────────────
type AnimationPreset =
  | "fadeIn"
  | "fadeInUp"
  | "fadeInDown"
  | "fadeInLeft"
  | "fadeInRight"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scaleIn"
  | "scaleInBounce"
  | "rotate"
  | "flip"
  | "pulse"
  | "shake"
  | "bounce"
  | "swing"
  | "rubberBand"
  | "blur"
  | "none";

type TriggerType = "mount" | "hover" | "tap" | "inView" | "both";

export interface AnimateProps extends Omit<HTMLAttributes<HTMLDivElement>, "onAnimationStart"> {
  preset?: AnimationPreset;
  trigger?: TriggerType;
  duration?: number;
  delay?: number;
  stagger?: number;
  repeat?: number | "infinity";
  ease?: string | number[];
  once?: boolean;
  amount?: number;
  children: ReactNode;
  className?: string;
  as?: "div" | "span" | "section" | "article" | "li" | "ul";
}

const presetVariants: Record<AnimationPreset, { hidden: Record<string, unknown>; visible: Record<string, unknown> }> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -24 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0 },
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0 },
  },
  slideUp: {
    hidden: { y: 40, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },
  slideDown: {
    hidden: { y: -40, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },
  slideLeft: {
    hidden: { x: -40, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  },
  slideRight: {
    hidden: { x: 40, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  },
  scaleIn: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  },
  scaleInBounce: {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  },
  rotate: {
    hidden: { rotate: -180, opacity: 0, scale: 0.5 },
    visible: { rotate: 0, opacity: 1, scale: 1 },
  },
  flip: {
    hidden: { rotateY: 90, opacity: 0 },
    visible: { rotateY: 0, opacity: 1 },
  },
  pulse: {
    hidden: { scale: 1 },
    visible: { scale: [1, 1.05, 1] },
  },
  shake: {
    hidden: { x: 0 },
    visible: { x: [0, -8, 8, -6, 6, -3, 3, 0] },
  },
  bounce: {
    hidden: { y: 0 },
    visible: { y: [0, -16, 0, -8, 0, -4, 0] },
  },
  swing: {
    hidden: { rotate: 0 },
    visible: { rotate: [0, 12, -10, 6, -4, 0] },
  },
  rubberBand: {
    hidden: { scaleX: 1, scaleY: 1 },
    visible: {
      scaleX: [1, 1.25, 0.75, 1.15, 0.95, 1],
      scaleY: [1, 0.75, 1.25, 0.85, 1.05, 1],
    },
  },
  blur: {
    hidden: { filter: "blur(10px)", opacity: 0 },
    visible: { filter: "blur(0px)", opacity: 1 },
  },
  none: {
    hidden: {},
    visible: {},
  },
};

export function Animate({
  preset = "fadeIn",
  trigger = "mount",
  duration = 0.5,
  delay = 0,
  stagger = 0,
  repeat = 0,
  ease = "easeOut",
  once = true,
  amount = 0.3,
  children,
  className = "",
  as = "div",
  ...props
}: AnimateProps) {
  const variants = presetVariants[preset];
  const MotionTag = useMemo(() => motion.create(as), [as]);

  const transition: Transition = {
    duration,
    delay,
    ease: ease as any,
    repeat: repeat === "infinity" ? Infinity : repeat,
    ...(preset === "scaleInBounce" ? { type: "spring", stiffness: 260, damping: 20 } : {}),
  };

  const hoverAnims = ["pulse", "shake", "bounce", "swing", "rubberBand"];
  const isHoverPreset = hoverAnims.includes(preset);

  // Mount-based animation
  if (trigger === "mount") {
    return (
      <MotionTag
        initial="hidden"
        animate="visible"
        variants={variants as any}
        transition={transition}
        className={className}
        {...(props as any)}
      >
        {children}
      </MotionTag>
    );
  }

  // In-view animation
  if (trigger === "inView") {
    return (
      <MotionTag
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount }}
        variants={variants as any}
        transition={transition}
        className={className}
        {...(props as any)}
      >
        {children}
      </MotionTag>
    );
  }

  // Hover animation
  if (trigger === "hover") {
    return (
      <MotionTag
        initial={isHoverPreset ? undefined : "hidden"}
        animate={isHoverPreset ? undefined : "visible"}
        whileHover="visible"
        variants={variants as any}
        transition={transition}
        className={className}
        {...(props as any)}
      >
        {children}
      </MotionTag>
    );
  }

  // Tap animation
  if (trigger === "tap") {
    return (
      <MotionTag
        whileTap="visible"
        variants={variants as any}
        transition={transition}
        className={className}
        {...(props as any)}
      >
        {children}
      </MotionTag>
    );
  }

  // Both mount + inView
  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants as any}
      transition={transition}
      className={className}
      {...(props as any)}
    >
      {children}
    </MotionTag>
  );
}

// ── Stagger Container ──────────────────────────────────────
export interface StaggerProps {
  children: ReactNode;
  stagger?: number;
  delayStart?: number;
  className?: string;
  as?: "div" | "ul" | "section";
}

export function Stagger({
  children,
  stagger = 0.08,
  delayStart = 0,
  className = "",
  as = "div",
}: StaggerProps) {
  const MotionTag = useMemo(() => motion.create(as), [as]);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delayStart,
      },
    },
  };

  return (
    <MotionTag
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

// ── StaggerItem ────────────────────────────────────────────
export interface StaggerItemProps {
  children: ReactNode;
  preset?: AnimationPreset;
  duration?: number;
  className?: string;
  as?: "div" | "li" | "span";
}

export function StaggerItem({
  children,
  preset = "fadeInUp",
  duration = 0.4,
  className = "",
  as = "div",
}: StaggerItemProps) {
  const MotionTag = useMemo(() => motion.create(as), [as]);
  const variants = presetVariants[preset];

  return (
    <MotionTag
      variants={variants as any}
      transition={{ duration }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

// ── AnimatePresence wrapper re-export for convenience ──────
export { AnimatePresence } from "motion/react";
