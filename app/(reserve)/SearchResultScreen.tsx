import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import removeAccents from "remove-accents"; // ✅ thêm package
import { db } from "../../js/config";

export default function SearchResultScreen() {
  const router = useRouter();
  const { destination } = useLocalSearchParams<{ destination: string }>();

  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "hotels"));
        const allHotels: any[] = [];

        querySnapshot.forEach((doc) =>
          allHotels.push({ id: doc.id, ...doc.data() })
        );

        // 🔍 Lọc địa điểm: bỏ dấu, ignore case, match nhiều từ
        const destNormalized = removeAccents(destination || "").toLowerCase();

        const filtered = allHotels.filter((h) => {
          const locationNormalized = removeAccents(h.location || "").toLowerCase();
          return locationNormalized.includes(destNormalized);
        });


        setHotels(filtered);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu khách sạn:", error);
      } finally {
        setLoading(false);
      }
    };

    if (destination) fetchHotels();
  }, [destination]);

  if (loading)
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text>Đang tải dữ liệu khách sạn...</Text>
      </View>
    );

  if (hotels.length === 0)
    return (
      <View style={styles.loading}>
        <Text style={{ fontSize: 18, color: "#888" }}>
          Không tìm thấy khách sạn tại {destination}.
        </Text>
      </View>
    );

  const renderHotel = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/HotelDetailScreen",
          params: { ...item },
        })
      }
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.location}>{item.location}</Text>
        <Text style={styles.price}>
          {item.price?.toLocaleString()}₫ / đêm
        </Text>
        <Text style={styles.rating}>⭐ {item.rating}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      <FlatList
        data={hotels}
        renderItem={renderHotel}
        keyExtractor={(i) => i.id}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fafafa",
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 2,
  },
  image: { width: 110, height: 110 },
  info: { flex: 1, padding: 8 },
  name: { fontSize: 16, fontWeight: "600" },
  location: { color: "#555", marginVertical: 4 },
  price: { color: "#007bff", fontWeight: "600" },
  rating: { color: "#f39c12", marginTop: 4 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});
