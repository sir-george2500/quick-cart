// Theme colors supporting light and dark mode
// Quick-Cart Brand Colors - Emerald Green Theme
export const Colors = {
  light: {
    // Primary colors - Emerald Green
    primary: "#10B981",
    primaryDark: "#059669",
    primaryLight: "#34D399",
    secondary: "#1E40AF",

    // Background
    background: "#FFFFFF",
    surface: "#F9FAFB",
    card: "#FFFFFF",

    // Text
    text: "#111827",
    textSecondary: "#6B7280",
    textLight: "#9CA3AF",

    // Status
    success: "#22C55E",
    error: "#EF4444",
    warning: "#F59E0B",
    info: "#3B82F6",

    // Borders
    border: "#E5E7EB",
    borderLight: "#F3F4F6",

    // Other
    disabled: "#D1D5DB",
    placeholder: "#9CA3AF",
    shadow: "#000000",
  },
  dark: {
    // Primary colors - Emerald Green
    primary: "#10B981",
    primaryDark: "#059669",
    primaryLight: "#34D399",
    secondary: "#60A5FA",

    // Background
    background: "#111827",
    surface: "#1F2937",
    card: "#1F2937",

    // Text
    text: "#F9FAFB",
    textSecondary: "#D1D5DB",
    textLight: "#9CA3AF",

    // Status
    success: "#22C55E",
    error: "#F87171",
    warning: "#FBBF24",
    info: "#60A5FA",

    // Borders
    border: "#374151",
    borderLight: "#1F2937",

    // Other
    disabled: "#4B5563",
    placeholder: "#6B7280",
    shadow: "#000000",
  },
};

export type ColorScheme = "light" | "dark";
