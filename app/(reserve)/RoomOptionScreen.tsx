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
  price: number | string;
  refundable: boolean;
  payLater: boolean;
}

export default function RoomOptionScreen() {
  const router = useRouter();
  const { id, hotelName } = useLocalSearchParams<{ id: string; hotelName: string }>();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, "hotelRooms"), where("hotelId", "==", id));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc) => {
          const data = doc.data() as any;
          const parsedAmenities =
            typeof data.amenities === "string"
              ? JSON.parse(data.amenities)
              : data.amenities;

          return {
            id: doc.id,
            ...data,
            amenities: parsedAmenities || [],
          } as Room;
        });
        setRooms(list);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu phòng:", err);
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Các lựa chọn phòng tại</Text>
          <Text style={styles.headerHotel}>{hotelName}</Text>
        </View>

        {rooms.map((room) => (
          <View key={room.id} style={styles.card}>
            <Text style={styles.roomName}>{room.name}</Text>

            {room.image && (
              <Image source={{ uri: room.image }} style={styles.roomImage} />
            )}

            <View style={styles.roomInfo}>
              <Text>🛏️ {room.beds}</Text>
              <Text>📏 {room.size}</Text>

              <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 4 }}>
                {room.amenities?.slice(0, 5).map((a, i) => (
                  <Text key={i} style={styles.amenity}>
                    {a}
                  </Text>
                ))}
              </View>
            </View>

            <View style={styles.policyBox}>
              {room.refundable && <Text>🔁 Miễn phí huỷ phòng</Text>}
              {room.payLater && <Text>✅ Thanh toán sau tại chỗ nghỉ</Text>}
              <Text style={{ color: "green", marginTop: 4 }}>
                💳 Không cần thẻ tín dụng
              </Text>
              <Text style={styles.priceText}>Giá: {room.price} / đêm</Text>
            </View>

            <TouchableOpacity
              style={styles.selectButton}
              onPress={() =>
                router.push({
                  pathname: "/(reserve)/BookingConfirmScreen",
                  params: {
                    hotelName,
                    roomName: room.name,
                    price: String(room.price),
                    image: room.image,
                    guests: String(room.guests),
                    beds: room.beds,
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
    backgroundColor: "#0071C2",
    borderRadius: 6,
    paddingVertical: 10,
    marginTop: 10,
    alignItems: "center",
  },
  selectText: { color: "#fff", fontWeight: "700" },
});
