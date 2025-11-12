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

interface Booking {
  id: string;
  hotelName: string;
  roomName: string;
  price: number;
  guests: number;
  beds: string;
  createdAt?: { seconds: number };
}

export default function MyBookingScreen() {
  const { userEmail } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    try {
      if (!userEmail) return;

      setLoading(true);
      const q = query(collection(db, "bookings"), where("userEmail", "==", userEmail));
      const snap = await getDocs(q);

      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Booking[];

      setBookings(list);
    } catch (err) {
      console.error("Lỗi khi tải bookings:", err);
    } finally {
      setLoading(false);
    }
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
        <Text>Đang tải lịch sử đặt phòng...</Text>
      </SafeAreaView>
    );

  const renderItem = ({ item }: { item: Booking }) => {
    const date = item.createdAt
      ? new Date(item.createdAt.seconds * 1000).toLocaleString("vi-VN")
      : "—";

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/(reserve)/BookingDetailScreen",
            params: { id: item.id, title: "Chi tiết đặt phòng" },
          })
        }
      >
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/148/148767.png",
          }}
          style={styles.image}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.hotel}>{item.hotelName}</Text>
          <Text style={styles.room}>{item.roomName}</Text>
          <Text style={styles.info}>👥 {item.guests} khách · 🛏️ {item.beds}</Text>
          <Text style={styles.price}>
            💰 {item.price ? item.price.toLocaleString() : "N/A"}₫ / đêm
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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Danh sách đặt phòng</Text>
        </View>

        <FlatList
          data={bookings}
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
    backgroundColor: "#0071C2",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 10,
    textAlign: "center",
    justifyContent: "center",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#F9FBFF",
    borderRadius: 10,
    margin: 10,
    padding: 10,
    elevation: 2,
    alignItems: "center",
  },
  image: { width: 60, height: 60, marginRight: 10 },
  hotel: { fontSize: 16, fontWeight: "700", color: "#0071C2" },
  room: { fontSize: 14, color: "#333" },
  info: { fontSize: 13, color: "#555", marginTop: 2 },
  price: { fontWeight: "700", color: "#000", marginTop: 4 },
  date: { color: "#888", fontSize: 12, marginTop: 2 },
});
