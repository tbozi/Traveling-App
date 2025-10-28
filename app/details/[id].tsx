import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

interface Place {
  id: string;
  title: string;
  location: string;
  image: string;
  price: number;
  discount: number;
  type: string;
  desc: string;
}

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);

  // 🧭 Tải dữ liệu chi tiết khi có id
  useEffect(() => {
    if (!id) return;

    const fetchPlaceById = async () => {
      try {
        const response = await fetch(
          `https://68ff4999e02b16d1753d49db.mockapi.io/places/${id}`
        );
        const data: Place = await response.json();
        setPlace(data);
      } catch (error) {
        console.error("❌ Lỗi tải dữ liệu chi tiết:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceById();
  }, [id]);

  // 🌀 Hiển thị khi đang tải
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text>Đang tải chi tiết...</Text>
      </View>
    );
  }

  // 🚫 Không tìm thấy dữ liệu
  if (!place) {
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy địa điểm 🥲</Text>
      </View>
    );
  }

  // 💰 Tính giá sau giảm
  const discountedPrice =
    place.discount && place.discount > 0
      ? place.price * (1 - place.discount / 100)
      : place.price;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: place.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{place.title}</Text>
        <Text style={styles.location}>{place.location}</Text>

        {place.discount && place.discount > 0 ? (
          <>
            <Text style={styles.oldPrice}>
              {place?.price?.toLocaleString?.() ?? 0}₫
            </Text>
            <Text style={styles.newPrice}>
              {discountedPrice?.toLocaleString?.() ?? 0}₫ (-{place.discount}%)
            </Text>
          </>
        ) : (
          <Text style={styles.newPrice}>
            {place?.price?.toLocaleString?.() ?? 0}₫
          </Text>
        )}

        <Text style={styles.descTitle}>Giới thiệu</Text>
        <Text style={styles.desc}>{place.desc}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  image: { width: "100%", height: 250 },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 6 },
  location: { fontSize: 16, color: "#666", marginBottom: 10 },
  oldPrice: {
    textDecorationLine: "line-through",
    color: "#999",
    fontSize: 15,
  },
  newPrice: { color: "#1E90FF", fontWeight: "bold", fontSize: 18 },
  descTitle: { fontSize: 18, fontWeight: "600", marginTop: 16 },
  desc: { fontSize: 15, color: "#444", marginTop: 6, lineHeight: 22 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
});
