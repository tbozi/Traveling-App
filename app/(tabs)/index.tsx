import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

export default function HomeScreen() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const res = await fetch("https://68ff4999e02b16d1753d49db.mockapi.io/places");
      const data = await res.json();
      setPlaces(data);
    } catch (err) {
      console.error("Lỗi tải API:", err);
      // Alert chỉ hoạt động trên native, web bỏ Alert
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    const data = await AsyncStorage.getItem("favorites");
    if (data) setFavorites(JSON.parse(data));
  };

  const toggleFavorite = async (id: string) => {
    let updatedFavorites: string[] = [];
    if (favorites.includes(id)) {
      updatedFavorites = favorites.filter((favId) => favId !== id);
    } else {
      updatedFavorites = [...favorites, id];
    }
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const renderPlaceCard = ({ item }: { item: Place }) => {
    const discountedPrice = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;

    return (
      <View style={styles.card}>
        <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={styles.heartBtn}>
          <Ionicons
            name={favorites.includes(item.id) ? "heart" : "heart-outline"}
            size={22}
            color={favorites.includes(item.id) ? "red" : "#333"}
          />
        </TouchableOpacity>

        <Link href={{ pathname: "/details/[id]", params: { id: String(item.id) } }} asChild>
          <TouchableOpacity>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.location}>{item.location}</Text>

              {item.discount > 0 ? (
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
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={{ marginTop: 8 }}>Đang tải dữ liệu...</Text>
      </SafeAreaView>
    );
  }

  const hotPlaces = places.filter((p) => p.type === "hot");
  const offerPlaces = places.filter((p) => p.type === "offer");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/69/69906.png" }}
              style={styles.logo}
            />
            <Text style={styles.titleHeader}>Traveling App</Text>
          </View>
          <Link href="/notifications" asChild>
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={26} color="#fff" />
            </TouchableOpacity>
          </Link>
        </View>

        <Text style={styles.sectionTitle}>🔥 Hot Destinations</Text>
        <FlatList
          data={hotPlaces}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={renderPlaceCard}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        />

        <Text style={styles.sectionTitle}>💸 Special Offers</Text>
        <FlatList
          data={offerPlaces}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={renderPlaceCard}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#1E90FF",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  logo: { width: 40, height: 40, marginRight: 10 },
  titleHeader: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginTop: 20, marginBottom: 10, marginLeft: 16 },
  card: { backgroundColor: "#fff", borderRadius: 12, marginRight: 12, overflow: "hidden", width: 200, position: "relative" },
  image: { width: "100%", height: 120 },
  heartBtn: { position: "absolute", top: 8, right: 8, zIndex: 10, backgroundColor: "rgba(255,255,255,0.7)", borderRadius: 20, padding: 4 },
  info: { padding: 8 },
  title: { fontSize: 16, fontWeight: "600", marginTop: 4 },
  location: { color: "#666", fontSize: 13 },
  price: { color: "#1E90FF", fontWeight: "bold", marginTop: 4 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  priceOld: { textDecorationLine: "line-through", color: "#999", fontSize: 13 },
  priceNew: { color: "green", fontWeight: "700" },
});
