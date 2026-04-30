import type { Variants } from "framer-motion";

export const springTransition = { type: "spring", stiffness: 300, damping: 28 } as const;

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export const itemVariant: Variants = {
  hidden: { opacity: 0, y: 15, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: springTransition },
};
