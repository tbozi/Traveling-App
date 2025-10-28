import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ReserveScreen() {
  const router = useRouter();
  const { destination } = useLocalSearchParams<{ destination: string }>();

  const [date, setDate] = useState("");
  const [room, setRoom] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đặt vé cho: {destination || "Địa điểm"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Chọn ngày đi (VD: 2025-11-02)"
        value={date}
        onChangeText={setDate}
      />

      <TextInput
        style={styles.input}
        placeholder="Chọn loại phòng"
        value={room}
        onChangeText={setRoom}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          router.push({
            pathname: "/SearchResultScreen",
            params: { date, room, destination },
          })
        }
      >
        <Text style={styles.buttonText}>Tìm</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
