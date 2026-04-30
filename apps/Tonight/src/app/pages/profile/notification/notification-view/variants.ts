import { type Variants } from "framer-motion";

const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.18, ease: [0.2, 0, 0, 1], staggerChildren: 0.035 },
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.24, ease: [0.2, 0, 0, 1] } },
};

const listVariants: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", damping: 28, stiffness: 330 },
  },
  opening: {
    opacity: 1,
    y: -1,
    scale: 0.988,
    backgroundColor: "#FAF9F5",
    transition: { type: "spring", damping: 22, stiffness: 420 },
  },
  marking: {
    opacity: 1,
    y: 0,
    scale: 0.992,
    backgroundColor: "#F0FBF6",
    transition: { type: "spring", damping: 20, stiffness: 380 },
  },
  removing: {
    opacity: 0,
    x: 28,
    scale: 0.96,
    transition: { duration: 0.18, ease: [0.2, 0, 0, 1] },
  },
  exit: { opacity: 0, x: -12, scale: 0.985, transition: { duration: 0.16 } },
};

export { pageVariants, sectionVariants, listVariants };
