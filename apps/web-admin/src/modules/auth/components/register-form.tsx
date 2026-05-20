import {
  Alert,
  Button,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@qrave/ui";
import { useState } from "react";
import { signUp } from "@/lib/auth-client";

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export function RegisterForm({
  onSuccess,
  onSwitchToLogin,
}: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await signUp.email({ name, email, password });

    if (res.error) {
      setError(res.error.message ?? "Registration failed");
      return;
    }

    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md" w="100%" maw={380}>
        <Title order={2} ta="center">
          Create Account
        </Title>

        {error && <Alert color="red">{error}</Alert>}

        <TextInput
          label="Name"
          required
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />

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
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />

        <Button type="submit" fullWidth>
          Create Account
        </Button>

        <Button variant="subtle" size="compact-sm" onClick={onSwitchToLogin}>
          Already have an account? Sign In
        </Button>
      </Stack>
    </form>
  );
}
