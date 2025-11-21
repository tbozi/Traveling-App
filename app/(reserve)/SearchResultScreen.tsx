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
import removeAccents from "remove-accents";
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
        const snapshot = await getDocs(collection(db, "hotels"));
        const list: any[] = [];
        snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));

        const destNormalized = removeAccents(destination || "").toLowerCase();
        const filtered = list.filter((h) =>
          removeAccents(h.location || "").toLowerCase().includes(destNormalized)
        );
        setHotels(filtered);
      } catch (err) {
        console.error("🔥 Lỗi khi tải danh sách khách sạn:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, [destination]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text>Đang tải dữ liệu khách sạn...</Text>
      </View>
    );

  if (hotels.length === 0)
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy khách sạn tại {destination}</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <FlatList
        data={hotels}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/HotelDetailScreen",
                params: { hotelId: item.hotelId, id: item.id },
              })
            }
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.location}>{item.location}</Text>
              <Text style={styles.price}>{item.price}₫ / đêm</Text>
              <Text style={styles.rating}>⭐ {item.rating}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
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
  location: { color: "#555" },
  price: { color: "#007bff", fontWeight: "600" },
  rating: { color: "#f39c12" },
});
