/* Root gate — shows splash once, then renders child routes */
import { useState, useCallback } from "react";
import { AnimatePresence } from "motion/react";
import { Outlet } from "react-router";
import { SplashScreen } from "./pages/shared/SplashScreen";

export function SplashGate() {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashDone = useCallback(() => setSplashDone(true), []);

  return (
    <>
      <AnimatePresence>
        {!splashDone && <SplashScreen key="splash" onComplete={handleSplashDone} />}
      </AnimatePresence>
      <Outlet />
    </>
  );
}
