import { MantineProvider } from "@mantine/core";
import type { ReactNode } from "react";
import { theme } from "../theme";

interface QraveProviderProps {
  children: ReactNode;
}

export function QraveProvider({ children }: QraveProviderProps) {
  return <MantineProvider theme={theme}>{children}</MantineProvider>;
}
