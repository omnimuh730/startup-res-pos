import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { TonightLogoBadge } from "../../utils/brand/TonightLogo";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 4200);
    const t2 = setTimeout(onComplete, 4800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ scale: 0.86, opacity: 0, rotate: -8 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <TonightLogoBadge size={140} variant="plain" title="Tonight" />
      </motion.div>

      <motion.h1
        className="mt-5 text-[1.75rem] font-semibold tracking-tight text-[#222]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Tonight
      </motion.h1>

      <motion.p
        className="mt-1.5 text-[0.8125rem] text-[#717171]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        Reserve your perfect table
      </motion.p>
    </motion.div>
  );
}
