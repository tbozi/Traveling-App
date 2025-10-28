import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { hotels } from "./HotelData";

export default function HotelDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const hotel = hotels.find((h) => h.id === id);

  if (!hotel) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>Không tìm thấy khách sạn 🥲</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
          {hotel.images.map((img, idx) => (
            <Image key={idx} source={{ uri: img }} style={styles.image} />
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Điểm nổi bật của chỗ nghỉ</Text>
        <View style={styles.highlightContainer}>
          {hotel.highlights.map((item, idx) => (
            <View key={idx} style={styles.highlightItem}>
              <Text style={styles.highlightText}>{item}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.description}>{hotel.description}</Text>

        <View style={styles.infoSection}>
          <View>
            <Text style={styles.infoLabel}>Nhận phòng</Text>
            <Text style={styles.infoValue}>{hotel.checkIn}</Text>
          </View>
          <View>
            <Text style={styles.infoLabel}>Trả phòng</Text>
            <Text style={styles.infoValue}>{hotel.checkOut}</Text>
          </View>
        </View>

        <Text style={styles.searchInfo}>{hotel.searchInfo}</Text>

        <View style={styles.promoContainer}>
          <Text style={styles.discount}>{hotel.discount}</Text>
          <Text style={styles.promo}>{hotel.promo}</Text>
        </View>

        <Text style={styles.freeCancel}>{hotel.freeCancel}</Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Xem các lựa chọn</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#003B95",
  },
  back: { color: "white", fontSize: 20, marginRight: 10 },
  headerTitle: { color: "white", fontWeight: "bold", fontSize: 18 },
  imageScroll: { marginVertical: 10 },
  image: {
    width: 250,
    height: 180,
    borderRadius: 10,
    marginHorizontal: 8,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 16,
    marginVertical: 8,
  },
  highlightContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 16,
  },
  highlightItem: {
    backgroundColor: "#f0f4ff",
    borderRadius: 10,
    padding: 8,
    margin: 4,
  },
  highlightText: { color: "#003B95", fontWeight: "500" },
  description: {
    marginHorizontal: 16,
    marginVertical: 8,
    color: "#444",
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginVertical: 10,
  },
  infoLabel: { color: "#777" },
  infoValue: { fontWeight: "600", color: "#003B95" },
  searchInfo: {
    marginHorizontal: 16,
    color: "#333",
    marginBottom: 8,
  },
  promoContainer: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  discount: {
    backgroundColor: "#0A8754",
    color: "white",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  promo: {
    backgroundColor: "#1D4ED8",
    color: "white",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  freeCancel: {
    marginHorizontal: 16,
    color: "#666",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#0071C2",
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
