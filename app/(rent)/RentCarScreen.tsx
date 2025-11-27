import { Feather, Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RentCarScreen() {
  const router = useRouter();

  const [pickupLocation, setPickupLocation] = useState("");
  const [returnLocation, setReturnLocation] = useState("");
  const [driverAge, setDriverAge] = useState("");

  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [pickerType, setPickerType] = useState<"pickup" | "return" | null>(null);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const handleConfirmDate = (date: Date) => {
    if (!date) return;

    const formatted = formatDate(date);

    if (pickerType === "pickup") {
      setPickupDate(formatted);
    }

    if (pickerType === "return") {
      setReturnDate(formatted);
    }

    setPickerType(null);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["bottom"]}>
       
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={26} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Thuê xe</Text>
          </View>
 <ScrollView style={{ flex: 1 }}>
          <View style={styles.formContainer}>
            {/* NHẬP ĐỊA ĐIỂM */}
            <Text style={styles.label}>Địa điểm nhận xe</Text>
            <View style={styles.inputRow}>
              <Ionicons name="car-outline" size={22} />
              <TextInput
                style={styles.textInput}
                placeholder="Nhập địa điểm..."
                value={pickupLocation}
                onChangeText={setPickupLocation}
              />
            </View>

            <Text style={styles.label}>Địa điểm trả xe</Text>
            <View style={styles.inputRow}>
              <Ionicons name="location-outline" size={22} />
              <TextInput
                style={styles.textInput}
                placeholder="Nhập địa điểm..."
                value={returnLocation}
                onChangeText={setReturnLocation}
              />
            </View>

            {/* NGÀY */}
            <TouchableOpacity
              style={styles.inputRow}
              onPress={() => setPickerType("pickup")}
            >
              <Feather name="calendar" size={22} />
              <Text style={styles.inputText}>
                {pickupDate || "Chọn ngày nhận xe"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.inputRow}
              onPress={() => setPickerType("return")}
            >
              <Feather name="calendar" size={22} />
              <Text style={styles.inputText}>
                {returnDate || "Chọn ngày trả xe"}
              </Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={pickerType !== null}
              mode="date"
              onConfirm={handleConfirmDate}
              onCancel={() => setPickerType(null)}
            />

            {/* NHẬP ĐỘ TUỔI */}
            <Text style={styles.label}>Độ tuổi tài xế</Text>
            <View style={styles.inputRow}>
              <Feather name="user" size={22} />
              <TextInput
                style={styles.textInput}
                placeholder="Ví dụ: 30"
                keyboardType="numeric"
                value={driverAge}
                onChangeText={setDriverAge}
              />
            </View>

            {/* NÚT TÌM */}
            <TouchableOpacity
              style={styles.searchBtn}
              onPress={() =>
                router.push({
                  pathname: "/(rent)/CarSearchResultScreen",
                  params: {
                    pickupLocation,
                    returnLocation,
                    pickupDate,
                    returnDate,
                    driverAge,
                  },
                })
              }
            >
              <Text style={styles.searchBtnText}>Tìm</Text>
            </TouchableOpacity>
          </View>

          {/* LIST HÃNG */}
          <Text style={styles.sectionTitle}>Các hãng thuê xe được ưa chuộng</Text>

          <View style={styles.brandGrid}>
            {[
              "HONDA",
              "YAMAHA",
              "SUZUKI",
              "TOYOTA",
              "HUYNDAI",
              "VINFAST",
              "KIA",
              "FORD",
            ].map((name, i) => (
              <View key={i} style={styles.brandBox}>
                <Text style={styles.brandText}>{name}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#013687",
    paddingTop: 50,
  },
  backBtn: {
    marginRight: 115,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },

  formContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFB800",
    backgroundColor: "#fff",
  },

  label: { fontSize: 15, fontWeight: "600", marginTop: 10 },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },

  textInput: {
    marginLeft: 10,
    fontSize: 15,
    flex: 1,
  },

  inputText: {
    marginLeft: 12,
    fontSize: 15,
  },

  searchBtn: {
    backgroundColor: "#0E65B0",
    paddingVertical: 14,
    marginTop: 18,
    borderRadius: 8,
    alignItems: "center",
  },

  searchBtnText: { color: "#fff", fontSize: 17, fontWeight: "700" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 20,
    marginLeft: 16,
  },

  brandGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    justifyContent: "center",
  },
  brandBox: {
    backgroundColor: "#F5F7FA",
    padding: 20,
    width: "40%",
    margin: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  brandText: { fontWeight: "600" },
});
