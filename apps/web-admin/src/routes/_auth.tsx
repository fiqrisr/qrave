import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { LoginForm, RegisterForm } from "@/modules/auth";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (session.data) {
      throw redirect({ to: "/" });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {mode === "login" ? (
        <LoginForm
          onSuccess={() => globalThis.window.location.reload()}
          onSwitchToRegister={() => setMode("register")}
        />
      ) : (
        <RegisterForm
          onSuccess={() => globalThis.window.location.reload()}
          onSwitchToLogin={() => setMode("login")}
        />
      )}
    </div>
  );
}
