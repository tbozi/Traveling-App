import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../js/config";

export default function BookingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchBooking = async () => {
    try {
      const snap = await getDoc(doc(db, "bookings", id));
      if (snap.exists()) setBooking({ id: snap.id, ...snap.data() });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, []);

  const handleCancel = async () => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn hủy đơn?", [
      { text: "Không" },
      {
        text: "Hủy",
        style: "destructive",
        onPress: async () => {
          await updateDoc(doc(db, "bookings", booking.id), {
            status: "cancelled",
          });
          router.back();
        },
      },
    ]);
  };

  const handleDelete = async () => {
    Alert.alert("Xóa đơn", "Bạn chắc chắn xóa vĩnh viễn?", [
      { text: "Không" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "bookings", booking.id));
          router.back();
        },
      },
    ]);
  };

  const handleEdit = () => {
    router.push({
      pathname: "/(reserve)/BookingEditScreen",
      params: { ...booking },
    });
  };

  if (loading || !booking)
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#0071C2" />
      </SafeAreaView>
    );

  const createdDate = booking.createdAt
    ? new Date(booking.createdAt.seconds * 1000).toLocaleString("vi-VN")
    : "—";

return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        {loading || !booking ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#0071C2" />
          </View>
        ) : (
          <ScrollView>
            
            {/* 🔵 HEADER CUSTOM */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Ionicons name="chevron-back" size={26} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Chi tiết đặt phòng</Text>
            </View>

            <View style={styles.content}>
              {booking.image && (
                <Image source={{ uri: booking.image }} style={styles.image} />
              )}

              <Text style={styles.hotel}>{booking.hotelName}</Text>
              <Text style={styles.room}>{booking.roomName}</Text>

              {/* info */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>👤 Người đặt</Text>
                <Text style={styles.item}>Họ tên: {booking.lastName} {booking.firstName}</Text>
                <Text style={styles.item}>Email: {booking.email}</Text>
                <Text style={styles.item}>SĐT: {booking.phone}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🏨 Thông tin phòng</Text>
                <Text style={styles.item}>Khách: {booking.guests}</Text>
                <Text style={styles.item}>Giường: {booking.beds}</Text>
                <Text style={styles.item}>
                  Giá: {booking.price.toLocaleString()}₫ / đêm
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📌 Trạng thái</Text>
                <Text style={styles.item}>Đơn: {booking.status}</Text>
              </View>

              {/* Buttons */}
              <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
                <Text style={styles.editText}>✏️ Sửa thông tin đặt phòng</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                <Text style={styles.cancelText}>❌ Hủy đặt phòng</Text>
              </TouchableOpacity>

            </View>
          </ScrollView>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
 header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#013687",
    borderBottomWidth: 1,
    borderBottomColor: "#ececec",
  },
  backBtn: {
    marginRight: 80,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  content: { padding: 16 },
  image: { width: "100%", height: 180, borderRadius: 10, marginBottom: 16 },
  hotel: { fontSize: 20, fontWeight: "700", color: "#0071C2" },
  room: { fontSize: 16, marginBottom: 16 },
  section: { backgroundColor: "#F5F8FF", padding: 14, borderRadius: 10, marginTop: 16 },
  sectionTitle: { fontWeight: "700", marginBottom: 6 },
  item: { marginBottom: 4 },

  editBtn: { backgroundColor: "#0E65B0", padding: 14, borderRadius: 8, marginTop: 16 },
  editText: { textAlign: "center", color: "#fff", fontWeight: "700" },

  cancelBtn: { backgroundColor: "#FFB800", padding: 14, borderRadius: 8, marginTop: 12 },
  cancelText: { textAlign: "center", color: "#fff", fontWeight: "700" },

  deleteBtn: { backgroundColor: "red", padding: 14, borderRadius: 8, marginTop: 12 },
  deleteText: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
