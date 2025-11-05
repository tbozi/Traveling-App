import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { db } from "../js/config"; // Đường dẫn đến file config firebase

export default function HotelDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;

  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Lấy dữ liệu khách sạn từ Firestore (đổi lại dùng "hotels" cho đúng)
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const docRef = doc(db, "hotels", String(id)); // ✅ ĐÃ SỬA Ở ĐÂY
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setHotel(docSnap.data());
        } else {
          console.log("Không tìm thấy khách sạn!");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu khách sạn:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0071C2" />
      </View>
    );
  }

  if (!hotel) {
    return (
      <View style={styles.errorContainer}>
        <Text style={{ color: "#555" }}>Không có dữ liệu khách sạn.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Ảnh khách sạn */}
        {Array.isArray(hotel.images) && hotel.images.length > 0 ? (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.imageScroll}
          >
            {hotel.images.map((img: string, index: number) => (
              <Image key={index} source={{ uri: img }} style={styles.image} />
            ))}
          </ScrollView>
        ) : (
          <Image
            source={{
              uri:
                hotel.image ||
                "https://cdn-icons-png.flaticon.com/512/3448/3448611.png",
            }}
            style={styles.image}
          />
        )}

        {/* Nút quay lại */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        {/* Thông tin chính */}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{hotel.name}</Text>
          <Text style={styles.location}>{hotel.location}</Text>
          <View style={styles.row}>
            <Text style={styles.rating}>⭐ {hotel.rating}</Text>
            <Text style={styles.price}>
              {hotel.price?.toLocaleString()}₫ / đêm
            </Text>
          </View>
        </View>

        {/* Mô tả */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giới thiệu</Text>
          <Text style={styles.description}>
            {hotel.description ||
              "Khách sạn cung cấp nhiều tiện nghi hiện đại, vị trí thuận lợi gần trung tâm thành phố."}
          </Text>
        </View>

        {/* Tiện nghi */}
        {hotel.facilities && Array.isArray(hotel.facilities) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tiện nghi nổi bật</Text>
            {hotel.facilities.map((item: string, index: number) => (
              <View key={index} style={styles.facilityItem}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color="#0071C2"
                />
                <Text style={styles.facilityText}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Nút đặt phòng */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Xem các lựa chọn</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  imageScroll: { height: 250 },
  image: { width: 380, height: 250, marginRight: 5, borderRadius: 8 },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    padding: 6,
    zIndex: 10,
  },
  infoContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  name: { fontSize: 22, fontWeight: "700", color: "#222" },
  location: { color: "#555", marginVertical: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  rating: { color: "#f39c12", fontWeight: "600" },
  price: { color: "#0071C2", fontWeight: "700" },
  section: { padding: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#222",
  },
  description: { color: "#555", lineHeight: 20 },
  facilityItem: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  facilityText: { marginLeft: 8, color: "#333" },
  button: {
    backgroundColor: "#0071C2",
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
