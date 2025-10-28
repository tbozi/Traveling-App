import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Place {
  id: string;
  title: string;
  location: string;
  image: string;
  price: number;
  discount?: number;
  type: string;
  desc: string;
}

export default function FavoritesScreen() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlaces = async () => {
    try {
      const res = await fetch("https://68ff4999e02b16d1753d49db.mockapi.io/places");
      const data = await res.json();
      setPlaces(data);
    } catch (err) {
      console.error("Lỗi tải API:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    const data = await AsyncStorage.getItem("favorites");
    if (data) setFavorites(JSON.parse(data));
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const favPlaces = places.filter((p) => favorites.includes(p.id));

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={{ marginTop: 8 }}>Đang tải dữ liệu...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F7FA" }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Địa điểm yêu thích</Text>
      </View>

      {favPlaces.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.empty}>Chưa có địa điểm yêu thích ❤️</Text>
        </View>
      ) : (
        <FlatList
          data={favPlaces}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const discountedPrice = item.discount && item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
            return (
              <View style={styles.card}>
                <Link href={{ pathname: "/details/[id]", params: { id: item.id } }} asChild>
                  <TouchableOpacity>
                    <Image source={{ uri: item.image }} style={styles.image} />
                    <View style={styles.info}>
                      <Text style={styles.title}>{item.title}</Text>
                      <Text style={styles.location}>{item.location}</Text>
                      {item.discount && item.discount > 0 ? (
                        <View style={styles.priceRow}>
                          <Text style={styles.priceOld}>{item.price.toLocaleString()}₫</Text>
                          <Text style={styles.priceNew}>{discountedPrice.toLocaleString()}₫ (-{item.discount}%)</Text>
                        </View>
                      ) : (
                        <Text style={styles.price}>{item.price.toLocaleString()}₫</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </Link>
              </View>
            );
          }}
          contentContainerStyle={{ padding: 12 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { height: 60, backgroundColor: "#1E90FF", justifyContent: "center", alignItems: "center", paddingTop: 10 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { fontSize: 18, color: "#888", marginTop: 50 },
  card: { backgroundColor: "#fff", borderRadius: 12, marginBottom: 12, overflow: "hidden", elevation: 2 },
  image: { width: "100%", height: 150 },
  info: { padding: 8 },
  title: { fontSize: 16, fontWeight: "600" },
  location: { color: "#666", fontSize: 13 },
  price: { color: "#1E90FF", fontWeight: "bold", marginTop: 4 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  priceOld: { textDecorationLine: "line-through", color: "#999", fontSize: 13 },
  priceNew: { color: "green", fontWeight: "700" },
});
