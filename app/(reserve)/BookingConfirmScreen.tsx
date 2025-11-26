import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingConfirmScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    hotelName: string;
    roomName: string;
    price: string;
    image: string | string[];
    guests: string;
    beds: string;
    checkInDate: string;
    checkOutDate: string;
    nights: string;
  }>();

  const image = Array.isArray(params.image) ? params.image[0] : params.image;

  const pricePerNight = Number(params.price);
  const nights = Number(params.nights || "1");
  const totalAmount = pricePerNight * nights;

  return (
    <SafeAreaView style={styles.safeArea}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xác nhận đặt phòng</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {image && <Image source={{ uri: image }} style={styles.image} />}

        <View style={styles.infoBox}>
          <Text style={styles.hotel}>{params.hotelName}</Text>
          <Text style={styles.room}>{params.roomName}</Text>

          <Text style={styles.detail}>📅 Nhận phòng: {params.checkInDate}</Text>
          <Text style={styles.detail}>📅 Trả phòng: {params.checkOutDate}</Text>
          <Text style={styles.detail}>⏳ {nights} đêm</Text>
          <Text style={styles.detail}>👥 {params.guests} khách</Text>
          <Text style={styles.detail}>🛏️ {params.beds}</Text>

          <Text style={styles.price}>💰 {pricePerNight.toLocaleString()}₫ / đêm</Text>
        </View>

        <View style={styles.priceBox}>
          <Text style={styles.priceTitle}>Tổng giá cho {nights} đêm</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Giá mỗi đêm</Text>
            <Text style={styles.priceValue}>{pricePerNight.toLocaleString()}₫</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Số đêm</Text>
            <Text style={styles.priceValue}>{nights}</Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.priceRow}>
            <Text style={styles.totalText}>Tổng cộng</Text>
            <Text style={styles.totalAmount}>{totalAmount.toLocaleString()}₫</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/(reserve)/HotelBookingFormScreen",
              params: {
                ...params,
                totalAmount,
              },
            })
          }
        >
          <Text style={styles.buttonText}>Điền thông tin người đặt</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancel} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Quay lại</Text>
        </TouchableOpacity>
      </ScrollView>
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
  },
  backBtn: { marginRight: 70, padding: 4 },
  headerTitle: { color: "#fff", fontWeight: "700", fontSize: 20 },

  container: { padding: 16 },

  image: { width: "100%", height: 200, borderRadius: 10 },

  infoBox: { marginVertical: 20 },
  hotel: { fontSize: 22, fontWeight: "700" },
  room: { fontSize: 18, fontWeight: "600", marginTop: 4 },

  detail: { color: "#444", marginTop: 6 },

  price: { fontWeight: "700", marginTop: 15 },

  priceBox: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#f9fbff",
  },

  priceTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },

  priceLabel: { fontSize: 15 },
  priceValue: { fontSize: 15, fontWeight: "700" },

  separator: { height: 1, backgroundColor: "#ddd", marginVertical: 10 },

  totalText: { fontSize: 17, fontWeight: "700" },
  totalAmount: { fontSize: 17, fontWeight: "700", color: "#0E65B0" },

  button: {
    backgroundColor: "#0E65B0",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontWeight: "700" },

  cancel: { alignItems: "center", marginTop: 10 },
  cancelText: { color: "#1E90FF", fontWeight: "600" },
});
