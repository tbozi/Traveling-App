import { Ionicons } from "@expo/vector-icons";
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
import { db } from "../../js/config";

interface CarItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  seats: number;
  image: string;
}

export default function CarSearchResultScreen() {
  const router = useRouter();
  const { pickup, dropoff, location } = useLocalSearchParams();

  const [cars, setCars] = useState<CarItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 LẤY XE TỪ FIRESTORE
  useEffect(() => {
    const loadCars = async () => {
      try {
        const snap = await getDocs(collection(db, "carItems"));
        const list: CarItem[] = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
        }));

        setCars(list);
      } catch (err) {
        console.error("Lỗi tải carItems:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text>Đang tìm xe phù hợp...</Text>
      </View>
    );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kết quả tìm kiếm</Text>
      </View>

      <FlatList
        data={cars}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/(rent)/CarDetailScreen",
                params: { ...item },
              })
            }
          >
            <Image source={{ uri: item.image }} style={styles.carImage} />

            <View style={{ flex: 1 }}>
              <Text style={styles.carName}>{item.name}</Text>
              <Text style={styles.brand}>{item.brand}</Text>

              <View style={styles.row}>
                <Ionicons name="people-outline" size={18} />
                <Text style={styles.textSmall}>{item.seats} chỗ</Text>
              </View>

              <Text style={styles.price}>
                {item.price.toLocaleString()}₫ / ngày
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 8 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#013687",
    borderBottomWidth: 1,
    borderBottomColor: "#ececec",
    paddingTop: 50,
  },
  backBtn: { marginRight: 80, padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#fff" },

  card: {
    flexDirection: "row",
    backgroundColor: "#f8f9fc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    gap: 12,
  },
  carImage: { width: 110, height: 80, borderRadius: 8 },
  carName: { fontSize: 16, fontWeight: "700" },
  brand: { color: "#666", marginBottom: 4 },
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  textSmall: { color: "#555" },
  price: { marginTop: 8, color: "#1E90FF", fontWeight: "700", fontSize: 15 },
});
