// Theme colors supporting light and dark mode
export const Colors = {
  light: {
    // Primary colors
    primary: "#FF6B35",
    primaryDark: "#E85A2A",
    secondary: "#004E89",

    // Background
    background: "#FFFFFF",
    surface: "#F7F9FB",
    card: "#FFFFFF",

    // Text
    text: "#2D3748",
    textSecondary: "#718096",
    textLight: "#A0AEC0",

    // Status
    success: "#06D6A0",
    error: "#EF476F",
    warning: "#FFB800",
    info: "#3182CE",

    // Borders
    border: "#E2E8F0",
    borderLight: "#F7FAFC",

    // Other
    disabled: "#CBD5E0",
    placeholder: "#A0AEC0",
    shadow: "#000000",
  },
  dark: {
    // Primary colors
    primary: "#FF6B35",
    primaryDark: "#E85A2A",
    secondary: "#4A9FD8",

    // Background
    background: "#1A202C",
    surface: "#2D3748",
    card: "#2D3748",

    // Text
    text: "#F7FAFC",
    textSecondary: "#CBD5E0",
    textLight: "#A0AEC0",

    // Status
    success: "#06D6A0",
    error: "#FC8181",
    warning: "#FFB800",
    info: "#63B3ED",

    // Borders
    border: "#4A5568",
    borderLight: "#2D3748",

    // Other
    disabled: "#4A5568",
    placeholder: "#718096",
    shadow: "#000000",
  },
};

export type ColorScheme = "light" | "dark";
