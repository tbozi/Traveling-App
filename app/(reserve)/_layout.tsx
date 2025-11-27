import { Stack } from "expo-router";

export default function ReserveLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "white" },
        headerTintColor: "black",
        headerTitleAlign: "center",
        headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
      }}
    >

      {/* 🔥 TẮT HEADER Ở TRANG ĐẦU TIÊN */}
      <Stack.Screen
        name="ReseverScreen"
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name="SearchResultScreen"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="HotelDetailScreen"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="RoomOptionScreen"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="BookingConfirmScreen"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="HotelBookingFormScreen"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ChatAIScreen" options={{ headerShown: false }} />
      <Stack.Screen name="PaymentScreent" options={{ headerShown: false }} />
    </Stack>
    
  );
}
