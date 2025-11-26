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
      <Stack.Screen
        name="ReserveScreen"
        options={{
          title: "Đặt phòng",headerShown: true
        }}
      />
      <Stack.Screen
        name="SearchResultScreen"
        options={{
          title: "Kết quả tìm kiếm",headerShown: false
        }}
      />
      <Stack.Screen
        name="HotelDetailScreen"
        options={{
          title: "Chi tiết khách sạn",headerShown: false
        }}
      />
      <Stack.Screen
        name="RoomOptionScreen"
        options={{
          title: "Chọn phòng",headerShown: false
        }}
      />
      <Stack.Screen
        name="BookingConfirmScreen"
        options={{
          title: "Xác nhận đặt phòng",headerShown: false
        }}
      />
      <Stack.Screen
        name="HotelBookingFormScreen"
        options={{
          title: "Thông tin đặt phòng",headerShown: false
        }}
      />
    </Stack>
    
  );
}
