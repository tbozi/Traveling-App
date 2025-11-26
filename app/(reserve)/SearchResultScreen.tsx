import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import removeAccents from "remove-accents";
import { db } from "../../js/config";

const PAGE_SIZE = 10;

export default function SearchResultScreen() {
  const router = useRouter();

  // 🔥 ĐỌC thêm các params mà ReserveScreen đã gửi (nếu có)
  const {
    destination,
    checkInDate,
    checkOutDate,
    nights,
    adults,
    room,
  } = useLocalSearchParams<{
    destination?: string;
    checkInDate?: string;
    checkOutDate?: string;
    nights?: string;
    adults?: string;
    room?: string;
  }>();

  const [allHotels, setAllHotels] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  const [refreshing, setRefreshing] = useState(false);

  // ================= LOAD HOTELS =================
  const fetchHotels = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "hotels"));
      const list: any[] = [];

      snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));

      // lọc theo địa điểm
      const destNormalized = removeAccents(destination || "").toLowerCase();
      const filtered = list.filter((h) =>
        removeAccents(String(h.location || ""))
          .toLowerCase()
          .includes(destNormalized)
      );

      setAllHotels(filtered);
      setHotels(filtered.slice(0, PAGE_SIZE));
      setPage(1);
    } catch (err) {
      console.error("🔥 Lỗi khi tải danh sách khách sạn:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (destination) fetchHotels();
  }, [destination]);

  // ================= PULL TO REFRESH =================
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHotels();
  }, []);

  // ================= LOAD MORE =================
  const loadMore = useCallback(() => {
    if (loadingMore) return;

    const total = allHotels.length;
    const nextPage = page + 1;
    const start = page * PAGE_SIZE;
    const end = nextPage * PAGE_SIZE;

    if (start >= total) return;

    setLoadingMore(true);

    setTimeout(() => {
      setHotels((prev) => [...prev, ...allHotels.slice(start, end)]);
      setPage(nextPage);
      setLoadingMore(false);
    }, 400);
  }, [page, allHotels, loadingMore]);

  // ================= RENDER =================
  if (loading)
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text>Đang tải dữ liệu khách sạn...</Text>
      </SafeAreaView>
    );

  if (hotels.length === 0)
    return (
      <SafeAreaView style={styles.center}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Kết quả tìm kiếm</Text>
        </View>
        <Text>Không tìm thấy khách sạn tại {destination}</Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ================= HEADER KIỂU B ================= */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kết quả tìm kiếm</Text>
      </View>

      <FlatList
        data={hotels}
        keyExtractor={(item) => item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={{ padding: 10 }}>
              <ActivityIndicator size="small" color="#2563EB" />
            </View>
          ) : null
        }
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                // giữ flow cũ: chuyển sang trang chi tiết khách sạn (HotelDetailScreen)
                // 🔥 THÊM tất cả params liên quan đến ngày & nights để forward tiếp
                pathname: "/HotelDetailScreen",
                params: {
                  id: item.id,
                  hotelId: item.hotelId ?? item.id,
                  hotelName: item.name,
                  // truyền tiếp dates & nights → đảm bảo các trang sau nhận được
                  checkInDate: String(checkInDate ?? ""),
                  checkOutDate: String(checkOutDate ?? ""),
                  nights: String(nights ?? ""),
                  adults: String(adults ?? ""),
                  room: String(room ?? ""),
                },
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },

  // ===== HEADER BOOKING STYLE =====
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
