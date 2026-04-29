import { useState, useEffect } from "react";
import { motion } from "motion/react";

function Logo({ size = 140 }: { size?: number }) {
  const tableD = size * 0.58;
  const holeD = tableD * 0.3;
  const chairD = size * 0.15;
  const orbitR = tableD / 2 + chairD * 0.9;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Table (big circle) */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: tableD,
          height: tableD,
          left: cx - tableD / 2,
          top: cy - tableD / 2,
          background: "#FF385C",
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: holeD,
            height: holeD,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: "transparent",
            boxShadow: "0 0 0 100px white inset",
          }}
        />
      </motion.div>

      {/* Chair — static, left center */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: chairD,
          height: chairD,
          background: "#FF385C",
          left: cx - orbitR - chairD / 2,
          top: cy - chairD / 2,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      />
    </div>
  );
}

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 4200);
    const t2 = setTimeout(onComplete, 4800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center"
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <Logo size={140} />

      <motion.h1
        className="mt-5 text-[1.75rem] tracking-tight text-[#222]"
        style={{ fontWeight: 800 }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        CatchTable
      </motion.h1>

      <motion.p
        className="text-[0.8125rem] text-[#717171] mt-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        Reserve your perfect table
      </motion.p>
    </motion.div>
  );
}
