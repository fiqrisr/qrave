import { createTheme } from "@mantine/core";
import { qraveColors } from "./colors";

export const theme = createTheme({
  primaryColor: "qrave-primary",
  colors: {
    "qrave-primary": qraveColors.primary,
  },
  defaultRadius: "md",
  fontFamily: "Inter, system-ui, -apple-system, sans-serif",
  headings: {
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    fontWeight: "700",
  },
  components: {
    Button: {
      defaultProps: {
        radius: "md",
      },
    },
    TextInput: {
      defaultProps: {
        radius: "md",
      },
    },
    PasswordInput: {
      defaultProps: {
        radius: "md",
      },
    },
    Select: {
      defaultProps: {
        radius: "md",
      },
    },
    NumberInput: {
      defaultProps: {
        radius: "md",
      },
    },
    Card: {
      defaultProps: {
        radius: "md",
      },
    },
    Paper: {
      defaultProps: {
        radius: "md",
      },
    },
  },
});
