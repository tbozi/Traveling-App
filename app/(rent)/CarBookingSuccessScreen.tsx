import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CarBookingSuccessScreen() {
  const router = useRouter();
  const { name, price, image } = useLocalSearchParams();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="checkmark-circle" size={60} color="#32CD32" />
        <Text style={styles.title}>Đặt xe thành công!</Text>
        <Text style={styles.sub}>
          Chúng tôi đã gửi email xác nhận đặt xe của bạn.
        </Text>
      </View>

      {/* Car Summary */}
      <View style={styles.card}>
        <Image source={{ uri: String(image) }} style={styles.carImage} />

        <View style={{ flex: 1 }}>
          <Text style={styles.carName}>{name}</Text>
          <Text style={styles.price}>
            {Number(price).toLocaleString()}₫ / ngày
          </Text>

          <View style={styles.row}>
            <Feather name="check" size={18} color="#1E90FF" />
            <Text style={styles.text}>Đặt xe thành công</Text>
          </View>

          <View style={styles.row}>
            <Feather name="check" size={18} color="#1E90FF" />
            <Text style={styles.text}>Không cần đặt cọc</Text>
          </View>

          <View style={styles.row}>
            <Feather name="check" size={18} color="#1E90FF" />
            <Text style={styles.text}>Hủy miễn phí trong 48 giờ</Text>
          </View>
        </View>
      </View>

      {/* Total */}
      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Tổng thanh toán hôm nay</Text>
        <Text style={styles.totalValue}>
          {Number(price).toLocaleString()}₫
        </Text>
      </View>

      {/* Button */}
      <TouchableOpacity
        style={styles.doneBtn}
        onPress={() => router.push("/(tabs)")}
      >
        <Text style={styles.doneText}>Quay về trang chủ</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={() => router.push("/(rent)/CarSearchResultScreen")}
      >
        <Text style={styles.secondaryText}>Xem thêm xe khác</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginTop: 12,
    color: "#1E90FF",
  },
  sub: {
    color: "#666",
    marginTop: 6,
    textAlign: "center",
    paddingHorizontal: 20,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#F7F9FC",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  carImage: { width: 110, height: 80, borderRadius: 8 },
  carName: { fontSize: 18, fontWeight: "700" },
  price: { color: "#1E90FF", marginVertical: 4, fontWeight: "600" },
  row: { flexDirection: "row", alignItems: "center", marginTop: 4, gap: 6 },
  text: { fontSize: 14, color: "#444" },

  totalBox: {
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  totalLabel: { color: "#666" },
  totalValue: { fontSize: 22, fontWeight: "700", marginTop: 4 },

  doneBtn: {
    backgroundColor: "#1E90FF",
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    marginHorizontal: 16,
  },
  doneText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },

  secondaryBtn: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1E90FF",
    marginTop: 10,
    marginHorizontal: 16,
  },
  secondaryText: {
    color: "#1E90FF",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});
