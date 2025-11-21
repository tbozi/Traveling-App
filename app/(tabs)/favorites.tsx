import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../js/config";

interface Place {
  id: string;
  title: string;
  location: string;
  image: string;
  type: string;
  desc: string;
}

export default function FavoritesScreen() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlaces = async () => {
    try {
      const snapshot = await getDocs(collection(db, "places"));
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          title: d.title,
          location: d.location,
          image: d.image,
          type: d.type,
          desc: d.desc,
        };
      });

      setPlaces(data);
    } catch (err) {
      console.error("🔥 Firebase error:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id: string) => {
    const updated = favorites.filter((fid) => fid !== id);
    setFavorites(updated);
    await AsyncStorage.setItem("favorites", JSON.stringify(updated));
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
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* Nút bỏ yêu thích */}
              <TouchableOpacity
                style={styles.favoriteBtn}
                onPress={() => removeFavorite(item.id)}
              >
                <Ionicons name="heart-dislike" size={24} color="red" />
              </TouchableOpacity>

              <Link href={{ pathname: "/details/[id]", params: { id: item.id } }} asChild>
                <TouchableOpacity>
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <View style={styles.info}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.location}>{item.location}</Text>
                  </View>
                </TouchableOpacity>
              </Link>
            </View>
          )}
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
  favoriteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 4,
    borderRadius: 20,
  },
});
