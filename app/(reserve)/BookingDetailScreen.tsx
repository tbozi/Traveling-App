import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthConText";
import { db } from "../../js/config";

interface Booking {
  id: string;
  hotelName: string;
  roomName: string;
  price: number;
  guests: number;
  beds: string;
  createdAt?: { seconds: number };
}

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { userEmail } = useAuth();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        if (!id) return;
        const docRef = doc(db, "bookings", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBooking({ id: docSnap.id, ...docSnap.data() } as Booking);
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết đặt phòng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetail();
  }, [id]);

  if (loading)
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#0071C2" />
        <Text>Đang tải chi tiết đặt phòng...</Text>
      </SafeAreaView>
    );

  if (!booking)
    return (
      <SafeAreaView style={styles.center}>
        <Text>Không tìm thấy thông tin đặt phòng.</Text>
      </SafeAreaView>
    );

  const date = booking.createdAt
    ? new Date(booking.createdAt.seconds * 1000).toLocaleString("vi-VN")
    : "—";

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết đặt phòng</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View style={styles.card}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/148/148767.png",
              }}
              style={styles.image}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.hotel}>{booking.hotelName}</Text>
              <Text style={styles.room}>{booking.roomName}</Text>
              <Text style={styles.info}>
                👥 {booking.guests} khách · 🛏️ {booking.beds}
              </Text>
              <Text style={styles.price}>
                💰 {booking.price?.toLocaleString()}₫ / đêm
              </Text>
              <Text style={styles.date}>📅 Ngày đặt: {date}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
            <Text>🏨 Khách sạn: {booking.hotelName}</Text>
            <Text>📧 Email người đặt: {userEmail || "Chưa xác định"}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trạng thái</Text>
            <Text>✅ Đã xác nhận đặt phòng</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "#0071C2",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#F9FBFF",
    borderRadius: 10,
    marginBottom: 15,
    padding: 12,
    elevation: 2,
    alignItems: "center",
  },
  image: { width: 80, height: 80, marginRight: 12 },
  hotel: { fontSize: 18, fontWeight: "700", color: "#0071C2" },
  room: { fontSize: 16, color: "#333" },
  info: { fontSize: 14, color: "#555", marginTop: 2 },
  price: { fontWeight: "700", color: "#000", marginTop: 4 },
  date: { color: "#888", fontSize: 13, marginTop: 2 },
  section: { marginTop: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
    color: "#0071C2",
  },
  backButton: {
    backgroundColor: "#0071C2",
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 30,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
