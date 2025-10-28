import { Stack } from "expo-router";
import React from "react";

export default function ReserveLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#003580" },
        headerTintColor: "#fff",
        headerTitleAlign: "center",
        headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
      }}
    >
      <Stack.Screen
        name="ReseverScreen"
        options={{
          title: "Đặt phòng",
        }}
      />
      <Stack.Screen
        name="SearchResultScreen"
        options={{
          title: "Kết quả tìm kiếm",
        }}
      />
      <Stack.Screen
        name="HotelDetailScreen"
        options={{
          title: "Chi tiết khách sạn",
        }}
      />
    </Stack>
  );
}
