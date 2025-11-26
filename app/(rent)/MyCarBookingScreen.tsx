import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useCallback, useState } from "react";
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
import { useAuth } from "../../context/AuthConText";
import { db } from "../../js/config";

interface CarBooking {
  id: string;
  carName: string;
  brand: string;
  seats: number;
  price: number;
  pickup: string;
  dropoff: string;
  image: string;
  status: "pending" | "confirmed" | "canceled";
  createdAt?: { seconds: number };
}

export default function MyCarBookingScreen() {
  const { userEmail } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<CarBooking[]>([]);
  const [filtered, setFiltered] = useState<CarBooking[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    try {
      if (!userEmail) return;

      setLoading(true);
      const snap = await getDocs(
        query(collection(db, "carBookings"), where("userEmail", "==", userEmail))
      );

      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CarBooking[];

      // 🔥 Sort mới nhất → cũ nhất
      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

      setBookings(list);
      applyFilter("all", list);
    } catch (err) {
      console.error("🔥 Lỗi tải car bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (type: string, data = bookings) => {
    setActiveFilter(type);
    if (type === "all") return setFiltered(data);
    setFiltered(data.filter((b) => b.status === type));
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [userEmail])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  if (loading)
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#0071C2" />
        <Text>Đang tải đơn thuê xe...</Text>
      </SafeAreaView>
    );

  const getStatusColor = (status: string) => {
    if (status === "confirmed") return "green";
    if (status === "canceled") return "red";
    return "#FFB800";
  };

  const getStatusLabel = (status: string) => {
    if (status === "confirmed") return "Đã xác nhận";
    if (status === "canceled") return "Đã hủy";
    return "Đang chờ";
  };

  const renderItem = ({ item }: { item: CarBooking }) => {
    const date = item.createdAt
      ? new Date(item.createdAt.seconds * 1000).toLocaleString("vi-VN")
      : "—";

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/(rent)/CarBookingDetailScreen",
            params: { id: item.id },
          })
        }
      >
        <Image source={{ uri: item.image }} style={styles.image} />

        <View style={{ flex: 1 }}>
          <Text style={styles.car}>{item.carName}</Text>
          <Text style={styles.info}>🚗 {item.brand}</Text>
          <Text style={styles.info}>👥 {item.seats} chỗ</Text>

          <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
            ● {getStatusLabel(item.status)}
          </Text>

          <Text style={styles.price}>💰 {item.price.toLocaleString()}₫ / ngày</Text>

          <Text style={styles.location}>
            📍 {item.pickup} → {item.dropoff}
          </Text>

          <Text style={styles.date}>📅 {date}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Danh sách thuê xe</Text>
        </View> 


        {/* FILTER TABS giống MyBookingScreen */}
        <View style={styles.filterRow}>
          {[
            { key: "all", label: "Tất cả" },
            { key: "pending", label: "Đang chờ" },
            { key: "confirmed", label: "Xác nhận" },
            { key: "canceled", label: "Đã hủy" },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.filterBtn,
                activeFilter === tab.key && styles.filterBtnActive,
              ]}
              onPress={() => applyFilter(tab.key)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === tab.key && styles.filterTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* LIST */}
        <FlatList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      </SafeAreaView>
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
    marginRight: 70,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },

  filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  filterBtnActive: {
    backgroundColor: "#013687",
  },

  filterText: { fontSize: 14, color: "#333" },
  filterTextActive: { color: "#fff", fontWeight: "700" },

  card: {
    flexDirection: "row",
    backgroundColor: "#F9FBFF",
    borderRadius: 10,
    margin: 10,
    padding: 10,
    elevation: 2,
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
  },

  car: { fontSize: 16, fontWeight: "700", color: "#0071C2" },
  info: { fontSize: 13, color: "#555", marginTop: 2 },

  status: { marginTop: 4, fontWeight: "700" },

  location: { fontSize: 13, color: "#555", marginTop: 4 },

  price: { fontWeight: "700", fontSize: 14, marginTop: 4 },

  date: { color: "#888", fontSize: 12, marginTop: 4 },
});
