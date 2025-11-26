import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Link, useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

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
import { db } from "../../js/config";

interface Place {
  id: string;
  title: string;
  location: string;
  image: string;
  desc: string;
  type: string;
}

export default function HomeScreen() {
  const router = useRouter();

  const [places, setPlaces] = useState<Place[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { icon: "bed-outline" as const, label: "Khách sạn" },
    { icon: "car-outline" as const, label: "Thuê xe" },
  ];

  useEffect(() => {
    loadFavorites();
    fetchPlaces();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const fetchPlaces = async () => {
    try {
      const snapshot = await getDocs(collection(db, "places"));
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          title: d.title,
          location: d.rental || d.location,
          image: d.picture || d.image,
          desc: d.desc,
          type: d.kind || d.type,
        };
      });
      setPlaces(data);
    } catch (err) {
      console.log("🔥 Firebase error: ", err);
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
              <Text style={styles.desc} numberOfLines={2}>
                {item.desc}
              </Text>
              <Text style={styles.typeTag}>
                Loại:{" "}
                {item.type === "hot"
                  ? "🔥 Hot"
                  : item.type === "offer"
                  ? "💸 Offer"
                  : item.type}
              </Text>
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
      
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require("../(tabs)/logo.png")}
              style={styles.logo}
            />
            {/* <Text style={styles.titleHeader}>GoJourney</Text> */}
          </View>
          <Link href="/notifications" asChild>
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={26} color="#fff" />
            </TouchableOpacity>
          </Link>
        </View>
<ScrollView>
        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBox}
          onPress={() =>
            router.push({
              pathname: "/search",
            })
          }
        >
          <Ionicons name="search" size={20} color="#888" />
          <Text style={{ marginLeft: 8, color: "#666" }}>Search destination...</Text>
        </TouchableOpacity>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
          {categories.map((c, i) => (
            <TouchableOpacity
              key={i}
              style={styles.categoryItem}
              onPress={() => {
                if (c.label === "Khách sạn") {
                  router.push("/search"); // trang Khách sạn placeholder
                }
                if (c.label === "Thuê xe") {
                  router.push("/search"); // trang Thuê xe placeholder
                }
              }}
            >
              <Ionicons name={c.icon} size={55} />
              <Text style={styles.categoryText}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Banner */}
        <View style={styles.banner}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
            }}
            style={styles.bannerImg}
          />
          <View style={styles.bannerTextBox}>
            <Text style={styles.bannerTitle}>Special Deal!</Text>
            <Text style={styles.bannerSub}>Up to 50% on holidays this week</Text>
          </View>
        </View>

        {/* Hot places */}
        <Text style={styles.sectionTitle}>🔥 Hot Destinations</Text>
        <FlatList
          data={hotPlaces}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={renderPlaceCard}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        />

        {/* Offer places */}
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#013687",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  logo: { width: 90, height: 60, marginRight: 10 },
  titleHeader: { fontSize: 22, fontWeight: "bold", color: "#FFEFAA", fontStyle: "italic" },

  searchBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#52565b",
  },

  categoryRow: { marginTop: 16, paddingHorizontal: 16 },
  categoryItem: { alignItems: "center", marginRight: 20 },
  categoryText: { marginTop: 4, fontSize: 12, fontWeight: "500", color: "#444" },

  banner: {
    marginTop: 18,
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
  },
  bannerImg: { width: "100%", height: 150 },
  bannerTextBox: { position: "absolute", bottom: 15, left: 15 },
  bannerTitle: { fontSize: 20, fontWeight: "700", color: "#fff" },
  bannerSub: { fontSize: 14, color: "#eee", marginTop: 4 },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 16,
  },

  // card styles
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 12,
    overflow: "hidden",
    width: 220,
    position: "relative",
  },
  image: { width: "100%", height: 130 },
  heartBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 20,
    padding: 4,
  },
  info: { padding: 8 },
  title: { fontSize: 16, fontWeight: "600", marginTop: 4 },
  location: { color: "#666", fontSize: 13, marginTop: 2 },
  desc: { color: "#444", fontSize: 13, marginTop: 4 },
  typeTag: { marginTop: 6, color: "#1E90FF", fontWeight: "600" },
});
