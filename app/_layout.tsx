import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthConText";

export default function RootLayout() {
  return (
    <AuthProvider>
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
    </AuthProvider> 
  );
}