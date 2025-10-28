import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* Auth Screens */}
      <Stack.Screen
        name="(auth)/login"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(auth)/register"
        options={{ headerShown: false }}
      />

      {/* Main App Tabs */}
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />

      {/* Details */}
      <Stack.Screen
        name="details/[id]"
        options={{ title: "Place Details" }}
      />
    </Stack>
  );
}
