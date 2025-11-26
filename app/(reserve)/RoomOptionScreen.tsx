import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
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
import { db } from "../../js/config";
interface Room {
  id: string;
  hotelId: string;
  name: string;
  size: string;
  beds: string;
  amenities: string[];
  image: string;
  guests: number;
  price: string;
  refundable: boolean;
  payLater: boolean;
}

export default function RoomOptionScreen() {
  const router = useRouter();

  // 🔥 NHẬN thêm checkInDate, checkOutDate, nights, adults, room
  const {
    id,
    hotelName,
    checkInDate,
    checkOutDate,
    nights,
    adults,
    room,
  } = useLocalSearchParams<{
    id?: string;
    hotelName?: string;
    checkInDate?: string;
    checkOutDate?: string;
    nights?: string;
    adults?: string;
    room?: string;
  }>();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.log("❌ Lỗi: hotelId bị undefined khi mở RoomOptionScreen");
      return;
    }

    const fetchRooms = async () => {
      try {
        setLoading(true);

        const q = query(collection(db, "hotelRooms"), where("hotelId", "==", id));
        const snapshot = await getDocs(q);

        const list: Room[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();

          // Parse tiện ích
          const amenities =
            typeof data.amenities === "string"
              ? JSON.parse(data.amenities)
              : data.amenities || [];

          // Làm sạch giá (remove ký tự VND, dấu ",", ".")
          const cleanPrice = Number(String(data.price).replace(/[^0-9]/g, ""));

          const roomObj: Room = {
            id: docSnap.id,
            hotelId: data.hotelId ?? "",
            name: data.name ?? "",
            size: data.size ?? "",
            beds: data.beds ?? "",
            guests: Number(data.guests) || 1,
            price: cleanPrice.toString(), // 🔥 CHUẨN GIÁ
            image: data.image ?? "",
            refundable: data.refundable ?? false,
            payLater: data.payLater ?? false,
            amenities,
          };

          return roomObj;
        });

        setRooms(list);
      } catch (err) {
        console.error("🔥 Lỗi khi tải dữ liệu phòng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [id]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0071C2" />
        <Text>Đang tải danh sách phòng...</Text>
      </View>
    );

  if (rooms.length === 0)
    return (
      <View style={styles.center}>
        <Text>Không có lựa chọn phòng nào cho khách sạn này.</Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header1}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chọn phòng</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Các lựa chọn phòng tại</Text>
          <Text style={styles.headerHotel}>{hotelName}</Text>
        </View>

        {rooms.map((roomItem) => (
          <View key={roomItem.id} style={styles.card}>
            {/* Tên phòng */}
            <Text style={styles.roomName}>{roomItem.name}</Text>

            {/* Ảnh phòng */}
            {roomItem.image && (
              <Image source={{ uri: roomItem.image }} style={styles.roomImage} />
            )}

            {/* Thông tin */}
            <View style={styles.roomInfo}>
              <Text>🛏️ {roomItem.beds}</Text>
              <Text>📏 {roomItem.size}</Text>

              <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 4 }}>
                {roomItem.amenities?.slice(0, 5).map((a, i) => (
                  <Text key={i} style={styles.amenity}>
                    {a}
                  </Text>
                ))}
              </View>
            </View>

            {/* Chính sách */}
            <View style={styles.policyBox}>
              {roomItem.refundable && <Text>🔁 Miễn phí huỷ phòng</Text>}
              {roomItem.payLater && <Text>✅ Thanh toán sau tại chỗ nghỉ</Text>}
              <Text style={{ color: "green", marginTop: 4 }}>💳 Không cần thẻ tín dụng</Text>

              <Text style={styles.priceText}>
                Giá: {Number(roomItem.price).toLocaleString("vi-VN")}₫ / đêm
              </Text>
            </View>

            {/* nút chọn */}
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() =>
                router.push({
                  pathname: "/(reserve)/BookingConfirmScreen",
                  params: {
                    hotelName,
                    roomName: roomItem.name,
                    price: roomItem.price,
                    image: roomItem.image,
                    guests: String(roomItem.guests),
                    beds: roomItem.beds,
                    // 🔥 TRUYỀN tiếp ngày + nights + adults + room để Confirm và Form nhận được
                    checkInDate: String(checkInDate ?? ""),
                    checkOutDate: String(checkOutDate ?? ""),
                    nights: String(nights ?? ""),
                    adults: String(adults ?? ""),
                    room: String(room ?? ""),
                  },
                })
              }
            >
              <Text style={styles.selectText}>Chọn</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header1: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#013687",
    borderBottomWidth: 1,
    borderBottomColor: "#ececec",
  },
  backBtn: {
    marginRight: 90,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  header: { padding: 16, borderBottomWidth: 1, borderColor: "#eee" },
  headerText: { fontSize: 16, color: "#666" },
  headerHotel: { fontSize: 20, fontWeight: "700", color: "#0071C2" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    elevation: 2,
  },

  roomName: { fontSize: 18, fontWeight: "700", color: "#0057B7" },
  roomImage: { width: "100%", height: 160, borderRadius: 8, marginVertical: 10 },
  roomInfo: { marginBottom: 8, gap: 4 },

  amenity: {
    backgroundColor: "#F3F6FA",
    color: "#333",
    fontSize: 13,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    margin: 3,
  },

  policyBox: { backgroundColor: "#F9FBFF", padding: 10, borderRadius: 6, marginTop: 4 },
  priceText: { fontWeight: "700", color: "#111", marginTop: 6 },

  selectButton: {
    backgroundColor: "#0E65B0",
    borderRadius: 6,
    paddingVertical: 10,
    marginTop: 10,
    alignItems: "center",
  },
  selectText: { color: "#fff", fontWeight: "700" },
});
