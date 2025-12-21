import { Stack } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";

export default function RootLayout() {
  const { loadUser } = useAuthStore();
  const { loadTheme } = useThemeStore();

  useEffect(() => {
    loadUser();
    loadTheme();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
