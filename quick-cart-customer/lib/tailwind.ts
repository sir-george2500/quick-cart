/**
 * Tailwind Configuration for twrnc
 * Customized with app's emerald green theme
 */

import { create } from "twrnc";

const tw = create({
  theme: {
    extend: {
      colors: {
        // Primary - Emerald Green (Agriculture theme)
        primary: {
          DEFAULT: "#10B981",
          dark: "#059669",
          light: "#34D399",
        },
        // Secondary
        secondary: {
          DEFAULT: "#1E40AF",
          light: "#60A5FA",
        },
        // Status colors
        success: "#22C55E",
        error: "#EF4444",
        warning: "#F59E0B",
        info: "#3B82F6",
      },
    },
  },
});

export default tw;
