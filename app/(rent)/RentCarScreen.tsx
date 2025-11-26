import { Feather, Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RentCarScreen() {
  const [sameLocation, setSameLocation] = useState(true);
  const [pickupDate, setPickupDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [showPickupPicker, setShowPickupPicker] = useState(false);
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["bottom"]}>
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thuê xe</Text>
        </View> 


          <View style={styles.formContainer}>
            <View style={styles.rowBetween}>
              <Text style={styles.formLabel}>Quay lại vị trí cũ</Text>
              <Switch
                value={sameLocation}
                onValueChange={setSameLocation}
                thumbColor="#fff"
                trackColor={{ true: "#1E90FF", false: "#ccc" }}
              />
            </View>

            <TouchableOpacity style={styles.inputRow}>
              <Ionicons name="car-outline" size={22} />
              <Text style={styles.inputText}>Địa điểm nhận xe</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.inputRow}
              onPress={() => setShowPickupPicker(true)}
            >
              <Feather name="calendar" size={22} />
              <Text style={styles.inputText}>
                {pickupDate.toLocaleDateString()} – {returnDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {showPickupPicker && (
              <DateTimePicker
                value={pickupDate}
                mode="date"
                onChange={(e, date) => {
                  setShowPickupPicker(false);
                  if (date) setPickupDate(date);
                }}
              />
            )}

            <TouchableOpacity style={styles.inputRow}>
              <Feather name="user" size={22} />
              <Text style={styles.inputText}>Độ tuổi tài xế: 30 – 65</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.searchBtn}
              onPress={() =>
                router.push({
                  pathname: "/(rent)/CarSearchResultScreen",
                  params: {
                    location: "Hồ Chí Minh",
                    pickup: pickupDate.toISOString(),
                    dropoff: returnDate.toISOString(),
                  },
                })
              }
            >
              <Text style={styles.searchBtnText}>Tìm</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Các hãng thuê xe được ưa chuộng</Text>

          <View style={styles.brandGrid}>
            {["HONDA", "YAMAHA", "SUZUKI", "TOYOTA", "HUYNDAI", "VINFAST", "KIA", "FORD"].map(
              (name, i) => (
                <View key={i} style={styles.brandBox}>
                  <Text style={styles.brandText}>{name}</Text>
                </View>
              )
            )}
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
    borderBottomWidth: 1,
    borderBottomColor: "#ececec",
    paddingTop:50,
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
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  formLabel: { fontSize: 16, fontWeight: "600" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  inputText: { marginLeft: 12, fontSize: 15 },
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
