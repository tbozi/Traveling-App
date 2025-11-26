import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CarDetailScreen() {
  const router = useRouter();
  const { id, name, price, image } = useLocalSearchParams();

  return (
    <ScrollView style={styles.container}>

      {/* Nút Back */}
      {/* <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={26} color="#000" />
      </TouchableOpacity> */}
      <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết thuê xe</Text>
        </View> 

      {/* Ảnh xe */}
      <Image source={{ uri: String(image) }} style={styles.carImage} />

      {/* Tên xe + giá */}
      <View style={styles.header}>
        <Text style={styles.carName}>{name}</Text>
        <Text style={styles.price}>{Number(price).toLocaleString()}₫ / ngày</Text>
      </View>

      {/* Thông tin xe */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin xe</Text>

        <View style={styles.infoRow}>
          <Ionicons name="people-outline" size={22} />
          <Text style={styles.infoText}>5 chỗ</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="briefcase-outline" size={22} />
          <Text style={styles.infoText}>2 hành lý lớn</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="settings-outline" size={22} />
          <Text style={styles.infoText}>Số tự động</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="speedometer-outline" size={22} />
          <Text style={styles.infoText}>Xăng / 6.5L / 100km</Text>
        </View>
      </View>

      {/* Tiện ích */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tiện ích</Text>

        {[
          "Miễn phí huỷ trong 48h",
          "Không cần đặt cọc",
          "Hỗ trợ 24/7",
          "Bảo hiểm cơ bản",
          "Điều hoà 2 vùng",
        ].map((item, i) => (
          <View key={i} style={styles.infoRow}>
            <Feather name="check-circle" size={20} color="#1E90FF" />
            <Text style={styles.infoText}>{item}</Text>
          </View>
        ))}
      </View>

      {/* Điều kiện thuê */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Điều kiện thuê</Text>

        {[
          "Tài xế từ 23 tuổi trở lên",
          "Có bằng lái B2 còn hiệu lực",
          "Mang theo CCCD bản gốc",
          "Giới hạn 300km / ngày",
        ].map((item, i) => (
          <View key={i} style={styles.infoRow}>
            <Feather name="alert-circle" size={20} color="#f39c12" />
            <Text style={styles.infoText}>{item}</Text>
          </View>
        ))}
      </View>

      {/* Nút đặt xe */}
      <TouchableOpacity
        style={styles.bookBtn}
        onPress={() =>
          router.push({
            pathname: "/(rent)/CarBookingFormScreen",
            params: { id, name, price, image },
          })
        }
      >
        <Text style={styles.bookBtnText}>Đặt xe</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", paddingBottom: 40 },
  // backBtn: {
  //   position: "absolute",
  //   top: 40,
  //   left: 16,
  //   zIndex: 20,
  //   backgroundColor: "rgba(255, 255, 255, 0.8)",
  //   padding: 6,
  //   borderRadius: 30,
  // },
  carImage: { width: "100%", height: 230 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#013687",
    borderBottomWidth: 1,
    borderBottomColor: "#ececec",
    paddingTop:50,
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
  carName: { fontSize: 24, fontWeight: "700" },
  price: { fontSize: 18, fontWeight: "600", color: "#1E90FF", marginTop: 6 },
  section: { padding: 16, borderTopWidth: 8, borderColor: "#F5F6F8" },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  infoText: { fontSize: 15, marginLeft: 10 },
  bookBtn: {
    backgroundColor: "#0E65B0",
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 10,
    marginBottom: 40,
  },
  bookBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
});
