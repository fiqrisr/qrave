import {
  Alert,
  Button,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@qrave/ui";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await signIn.email({ email, password });

    if (res.error) {
      setError(res.error.message ?? "Login failed");
      return;
    }

    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md" w="100%" maw={380}>
        <Title order={2} ta="center">
          Sign In
        </Title>

        {error && <Alert color="red">{error}</Alert>}

        <TextInput
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />

        <PasswordInput
          label="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />

        <Button type="submit" fullWidth>
          Sign In
        </Button>

        <Button variant="subtle" size="compact-sm" onClick={onSwitchToRegister}>
          Don&apos;t have an account? Sign Up
        </Button>
      </Stack>
    </form>
  );
}
