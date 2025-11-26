import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../js/config";

interface CarBooking {
  id: string;
  userEmail: string;
  carName: string;
  price: number;
  image: string;
  pickup: string;
  dropoff: string;
  location: string;
  status: string;
  createdAt?: { seconds: number };

  // 🔥 THÊM 3 FIELD NÀY
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export default function CarBookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [data, setData] = useState<CarBooking | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch booking
  useEffect(() => {
    const load = async () => {
      try {
        if (!id) return;

        const ref = doc(db, "carBookings", String(id));
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setData({ id: snap.id, ...snap.data() } as CarBooking);
        } else {
          setData(null);
        }
      } catch (err) {
        console.error("Lỗi tải chi tiết đơn:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Cancel booking
  const handleCancel = () => {
    Alert.alert(
      "Hủy đơn thuê xe",
      "Bạn có chắc muốn hủy đơn này không?",
      [
        { text: "Không", style: "cancel" },
        {
          text: "Hủy đơn",
          style: "destructive",
          onPress: async () => {
            try {
              const ref = doc(db, "carBookings", String(id));

              await updateDoc(ref, { status: "canceled" });

              setData((prev) =>
                prev ? { ...prev, status: "canceled" } : prev
              );

              Alert.alert("Đã hủy đơn", "Đơn thuê xe đã được hủy.");
            } catch (err) {
              console.error("Lỗi hủy đơn:", err);
              Alert.alert("Lỗi", "Không thể hủy đơn. Vui lòng thử lại.");
            }
          },
        },
      ]
    );
  };

  if (loading)
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text>Đang tải đơn...</Text>
      </SafeAreaView>
    );

  if (!data)
    return (
      <SafeAreaView style={styles.center}>
        <Text>Không tìm thấy đơn thuê xe.</Text>
      </SafeAreaView>
    );

  const createdDate = data.createdAt
    ? new Date(data.createdAt.seconds * 1000).toLocaleString("vi-VN")
    : "—";

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết đơn thuê xe</Text>
        </View> 

      <ScrollView style={{ flex: 1 }}>
        {/* Car image */}
        <Image source={{ uri: data.image }} style={styles.image} />

        {/* Car info */}
        <View style={styles.section}>
          <Text style={styles.carName}>{data.carName}</Text>
          <Text style={styles.price}>{data.price.toLocaleString()}₫ / ngày</Text>
          <Text style={styles.status}>
            Trạng thái:{" "}
            <Text
              style={{
                color:
                  data.status === "canceled"
                    ? "red"
                    : data.status === "confirmed"
                    ? "green"
                    : "#f39c12",
              }}
            >
              {data.status === "pending"
                ? "Chờ xử lý"
                : data.status === "confirmed"
                ? "Đã xác nhận"
                : "Đã hủy"}
            </Text>
          </Text>
        </View>

        {/* Booking details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin chi tiết</Text>

          <DetailRow icon="calendar" label="Ngày tạo" value={createdDate} />
          <DetailRow icon="map-pin" label="Địa điểm nhận xe" value={data.pickup} />
          <DetailRow icon="map" label="Trả xe tại" value={data.dropoff} />
          <DetailRow icon="map-pin" label="Khu vực" value={data.location} />
        </View>

        {/* 🔥 NEW — Customer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin khách đặt</Text>

          <DetailRow
            icon="user"
            label="Họ và tên"
            value={data.customerName || "—"}
          />
          <DetailRow
            icon="mail"
            label="Email"
            value={data.customerEmail || "—"}
          />
          <DetailRow
            icon="phone"
            label="Số điện thoại"
            value={data.customerPhone || "—"}
          />
        </View>

        {/* Cancel Button */}
        {data.status !== "canceled" && (
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.cancelText}>Hủy đơn</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detailRow}>
      <Feather name={icon} size={20} color="#1E90FF" />
      <Text style={styles.detailLabel}>{label}: </Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 6 },

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

  image: {
    width: "100%",
    height: 200,
  },

  section: {
    padding: 16,
    borderBottomWidth: 8,
    borderColor: "#F5F6F8",
  },
  carName: { fontSize: 22, fontWeight: "700" },
  price: { marginTop: 6, color: "#1E90FF", fontSize: 17, fontWeight: "700" },
  status: { marginTop: 6, fontSize: 15 },

  sectionTitle: { fontSize: 17, fontWeight: "700", marginBottom: 10 },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailLabel: { marginLeft: 8, fontWeight: "600", width: 130 },
  detailValue: { flex: 1 },

  cancelBtn: {
    margin: 16,
    padding: 14,
    backgroundColor: "#ff4d4d",
    borderRadius: 10,
  },
  cancelText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});
