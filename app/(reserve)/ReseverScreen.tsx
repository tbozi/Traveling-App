import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
<<<<<<< Updated upstream
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

=======
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from "react-native-safe-area-context";
>>>>>>> Stashed changes
export default function ReserveScreen() {
  const router = useRouter();
  const { destination } = useLocalSearchParams<{ destination: string }>();

  // 🗓️ Trạng thái ngày nhận và trả phòng
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [pickerType, setPickerType] = useState<"checkin" | "checkout" | null>(
    null
  );

  const [room, setRoom] = useState("1");
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");

  const handleConfirmDate = (selectedDate: Date) => {
    const formatted = selectedDate.toISOString().split("T")[0];
    if (pickerType === "checkin") setCheckInDate(formatted);
    if (pickerType === "checkout") setCheckOutDate(formatted);
    setPickerType(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Nút quay lại */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.container}>
        {/* 🏨 Tiêu đề */}
        <Text style={styles.title}>
          Đặt phòng tại: {destination || "Địa điểm"}
        </Text>

        {/* 🗓️ Ngày nhận phòng */}
        <TouchableOpacity
          onPress={() => setPickerType("checkin")}
          style={styles.input}
        >
          <Text style={{ color: checkInDate ? "#000" : "#999" }}>
            {checkInDate
              ? `Ngày nhận phòng: ${checkInDate}`
              : "Chọn ngày nhận phòng"}
          </Text>
        </TouchableOpacity>

        {/* 🗓️ Ngày trả phòng */}
        <TouchableOpacity
          onPress={() => setPickerType("checkout")}
          style={styles.input}
        >
          <Text style={{ color: checkOutDate ? "#000" : "#999" }}>
            {checkOutDate
              ? `Ngày trả phòng: ${checkOutDate}`
              : "Chọn ngày trả phòng"}
          </Text>
        </TouchableOpacity>

        {/* Bộ chọn ngày */}
        <DateTimePickerModal
          isVisible={pickerType !== null}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={() => setPickerType(null)}
        />

        {/* 🛏️ Thông tin phòng */}
        <View style={styles.peopleSection}>
          <View style={styles.peopleRow}>
            <Ionicons name="bed-outline" size={20} color="#333" />
            <TextInput
              style={styles.peopleInput}
              keyboardType="numeric"
              value={room}
              onChangeText={setRoom}
            />
            <Text style={styles.peopleText}>phòng</Text>
          </View>

          <View style={styles.peopleRow}>
            <Ionicons name="person-outline" size={20} color="#333" />
            <TextInput
              style={styles.peopleInput}
              keyboardType="numeric"
              value={adults}
              onChangeText={setAdults}
            />
            <Text style={styles.peopleText}>người lớn</Text>
          </View>

          <View style={styles.peopleRow}>
            <Ionicons name="happy-outline" size={20} color="#333" />
            <TextInput
              style={styles.peopleInput}
              keyboardType="numeric"
              value={children}
              onChangeText={setChildren}
            />
            <Text style={styles.peopleText}>
              {children === "0" ? "Không có trẻ em" : "trẻ em"}
            </Text>
          </View>
        </View>

        {/* 🔍 Nút tìm */}
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/SearchResultScreen",
              params: {
                checkInDate,
                checkOutDate,
                room,
                destination,
                adults,
                children,
              },
            })
          }
        >
          <Text style={styles.buttonText}>Tìm</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  peopleSection: {
    marginTop: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
  },
  peopleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  peopleInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    width: 60,
    padding: 6,
    marginHorizontal: 8,
    textAlign: "center",
  },
  peopleText: { fontSize: 15 },
  button: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: "#f1f1f1",
    padding: 8,
    borderRadius: 20,
  },
});


