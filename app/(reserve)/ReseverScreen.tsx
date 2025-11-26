import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReserveScreen() {
  const router = useRouter();
  const { destination } = useLocalSearchParams<{ destination: string }>();

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  const [pickerType, setPickerType] = useState<"checkin" | "checkout" | null>(
    null
  );

  const [room, setRoom] = useState("1");
  const [adults, setAdults] = useState("1");

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const handleConfirmDate = (selectedDate: Date) => {
    if (!selectedDate) return;
    const formatted = formatDate(selectedDate);

    if (pickerType === "checkin") {
      setCheckInDate(formatted);

      // Reset checkout nếu checkout < checkin
      if (checkOutDate && new Date(checkOutDate) <= new Date(formatted)) {
        setCheckOutDate("");
      }
    }

    if (pickerType === "checkout") {
      if (!checkInDate) {
        Alert.alert("Lỗi", "Hãy chọn ngày nhận phòng trước.");
        setPickerType(null);
        return;
      }

      if (new Date(formatted) <= new Date(checkInDate)) {
        Alert.alert("Lỗi", "Ngày trả phòng phải sau ngày nhận phòng.");
        setPickerType(null);
        return;
      }

      setCheckOutDate(formatted);
    }

    setPickerType(null);
  };

  // Tính số đêm
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const inDate = new Date(checkInDate);
    const outDate = new Date(checkOutDate);
    const nights = (outDate.getTime() - inDate.getTime()) / (1000 * 3600 * 24);
    return nights;
  };

  const handleSearch = () => {
    if (!checkInDate || !checkOutDate) {
      Alert.alert("Thiếu thông tin", "Vui lòng chọn ngày nhận và trả phòng.");
      return;
    }

    if (Number(adults) < 1) {
      Alert.alert("Lỗi", "Phải có ít nhất 1 người lớn.");
      return;
    }

    const nights = calculateNights();

    router.push({
      pathname: "/SearchResultScreen",
      params: {
        checkInDate,
        checkOutDate,
        nights, // 🔥 TRUYỀN SỐ ĐÊM QUA TRANG SAU
        room,
        adults,
        destination,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tìm phòng</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>
          Tại: {destination || "Địa điểm"}
        </Text>

        {/* Check-in */}
        <TouchableOpacity
          onPress={() => setPickerType("checkin")}
          style={styles.input}
        >
          <Text style={{ color: checkInDate ? "#000" : "#999" }}>
            {checkInDate || "Chọn ngày nhận phòng"}
          </Text>
        </TouchableOpacity>

        {/* Check-out */}
        <TouchableOpacity
          onPress={() => setPickerType("checkout")}
          style={styles.input}
        >
          <Text style={{ color: checkOutDate ? "#000" : "#999" }}>
            {checkOutDate || "Chọn ngày trả phòng"}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={pickerType !== null}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={() => setPickerType(null)}
        />

        {/* Adults & Room */}
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
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Tìm</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#013687",
    borderBottomWidth: 1,
    borderBottomColor: "#ececec",
  },
  backBtn: { marginRight: 100, padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#fff" },

  container: { flex: 1, padding: 20 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 20 },

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
    backgroundColor: "#0E65B0",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
