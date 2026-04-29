/* Auth Flow Container */
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { LoginPage } from "./LoginPage";
import { RegisterPage } from "./RegisterPage";
import { ForgotPasswordPage } from "./ForgotPasswordPage";

export function AuthFlow({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [page, setPage] = useState<"login" | "register" | "forgot">("login");

  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden bg-white">
      <AnimatePresence mode="wait">
        {page === "login" && (
          <LoginPage key="login" onLogin={onAuthenticated} onGoRegister={() => setPage("register")} onForgotPassword={() => setPage("forgot")} />
        )}
        {page === "register" && (
          <RegisterPage key="register" onRegister={onAuthenticated} onGoLogin={() => setPage("login")} />
        )}
        {page === "forgot" && (
          <ForgotPasswordPage key="forgot" onBack={() => setPage("login")} />
        )}
      </AnimatePresence>
    </div>
  );
}
