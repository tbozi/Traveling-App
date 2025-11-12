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
import { db } from "../../js/config"; // ❗ Không dùng SafeAreaView ở đây

export default function HotelDetailScreen() {
  const router = useRouter();
  const { id, hotelId } = useLocalSearchParams<{ id: string; hotelId: string }>();
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true);
        const hotelSnap = await getDocs(
          query(collection(db, "hotels"), where("hotelId", "==", hotelId))
        );
        const hotelData = hotelSnap.docs[0]?.data();

        const detailSnap = await getDocs(
          query(collection(db, "hoteldetails"), where("hotelId", "==", hotelId))
        );
        const detailData = detailSnap.docs[0]?.data();

        const images =
          typeof detailData?.images === "string"
            ? JSON.parse(detailData.images)
            : detailData?.images || [];
        const facilities =
          typeof detailData?.facilities === "string"
            ? JSON.parse(detailData.facilities)
            : detailData?.facilities || [];

        setHotel({
          ...hotelData,
          ...detailData,
          images,
          facilities,
        });
      } catch (err) {
        console.error("🔥 Lỗi khi tải chi tiết khách sạn:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotelData();
  }, [id]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0071C2" />
      </View>
    );

  if (!hotel)
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy khách sạn.</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header tùy chỉnh — không còn trống phía trên */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{hotel.name?.toUpperCase()}</Text>
        </View>

        {/* Hình ảnh */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginVertical: 10 }}
        >
          {hotel.images?.map((img: string, i: number) => (
            <Image key={i} source={{ uri: img }} style={styles.image} />
          ))}
        </ScrollView>

        {/* Thông tin khách sạn */}
        <View style={styles.info}>
          <Text style={styles.name}>{hotel.name}</Text>
          <Text style={styles.location}>{hotel.location}</Text>
          <Text style={styles.rating}>⭐ {hotel.rating}</Text>
          <Text style={styles.price}>
            {hotel.price?.toLocaleString()}₫ / đêm
          </Text>
        </View>

        {/* Tiện nghi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tiện nghi nổi bật</Text>
          {hotel.facilities?.map((f: string, i: number) => (
            <Text key={i}>• {f}</Text>
          ))}
        </View>

        {/* Mô tả */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mô tả</Text>
          <Text>{hotel.description}</Text>
        </View>

        {/* Nút chuyển */}
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/(reserve)/RoomOptionScreen",
              params: { id: hotelId, hotelName: hotel.name },
            })
          }
        >
          <Text style={styles.buttonText}>Xem các lựa chọn</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "#0071C2",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
    justifyContent: "center",
    textAlign: "center",
  },
  image: { width: 320, height: 180, marginRight: 10, borderRadius: 8 },
  info: { padding: 16 },
  name: { fontSize: 20, fontWeight: "700" },
  location: { color: "#555" },
  rating: { color: "#f39c12" },
  price: { color: "#0071C2", fontWeight: "700" },
  section: { padding: 16 },
  sectionTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 6 },
  button: {
    backgroundColor: "#0071C2",
    padding: 14,
    borderRadius: 8,
    margin: 16,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
