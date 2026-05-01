import { useState, useCallback } from "react";
import { AnimatePresence } from "motion/react";
import { SplashScreen } from "./pages/shared/SplashScreen";
import { AuthFlow } from "./pages/auth/AuthFlow";
import RestaurantApp from "./pages/RestaurantApp";

type Phase = "splash" | "auth" | "app";

export function AppShell() {
  const [phase, setPhase] = useState<Phase>("splash");

  const handleSplashDone = useCallback(() => setPhase("auth"), []);
  const handleAuth = useCallback(() => setPhase("app"), []);

  return (
    <>
      {/* Splash overlay */}
      <AnimatePresence>
        {phase === "splash" && (
          <SplashScreen key="splash" onComplete={handleSplashDone} />
        )}
      </AnimatePresence>

      {/* Auth or App */}
      {phase === "auth" && <AuthFlow onAuthenticated={handleAuth} />}
      {phase === "app" && <RestaurantApp />}
    </>
  );
}