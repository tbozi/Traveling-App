import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
<<<<<<< Updated upstream
=======

import { collection, getDocs } from "firebase/firestore";
import { db } from "../js/config"; // ✅ Firebase config
>>>>>>> Stashed changes

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

export default function SearchScreen() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const snap = await getDocs(collection(db, "places"));

      const data: Place[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Place[];

      setPlaces(data);
    } catch (error) {
      console.error("Lỗi Firebase:", error);
      Alert.alert("Không thể tải dữ liệu từ Firestore!");
    } finally {
      setLoading(false);
    }
  };

  const filtered = places.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  if (loading)
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text>Đang tải dữ liệu...</Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tìm kiếm</Text>
      </View>

      <TextInput
        placeholder="Tìm kiếm địa điểm..."
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />

      {filtered.length === 0 ? (
        <Text style={styles.emptyText}>Không tìm thấy địa điểm nào 😢</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const discountedPrice =
              item.discount > 0
                ? item.price * (1 - item.discount / 100)
                : item.price;

            return (
              <Link
                href={{ pathname: "/details/[id]", params: { id: item.id } }}
                asChild
              >
                <TouchableOpacity style={styles.card}>
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.location}>{item.location}</Text>

                    {item.discount > 0 ? (
                      <View style={styles.priceRow}>
                        <Text style={styles.priceOld}>
                          {item.price.toLocaleString()}₫
                        </Text>
                        <Text style={styles.priceNew}>
                          {discountedPrice.toLocaleString()}₫
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.price}>
                        {item.price.toLocaleString()}₫
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              </Link>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    height: 60,
    backgroundColor: "#1E90FF",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#fff" },
  input: {
    margin: 12,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 8,
    elevation: 2,
  },
  image: { width: 90, height: 70, borderRadius: 8, marginRight: 10 },
  title: { fontSize: 16, fontWeight: "600" },
  location: { fontSize: 13, color: "#666", marginBottom: 4 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  priceOld: { textDecorationLine: "line-through", color: "#999", fontSize: 12 },
  priceNew: { color: "green", fontWeight: "700", fontSize: 14 },
  price: { color: "#1E90FF", fontWeight: "bold" },
  emptyText: { textAlign: "center", marginTop: 30, fontSize: 16, color: "#666" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
