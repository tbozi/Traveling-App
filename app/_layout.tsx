import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(auth)/login"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(auth)/register"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="details/[id]"
        options={{ title: "Place Details" }}
      />
      <Stack.Screen
        name="(reserve)"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
