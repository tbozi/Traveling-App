import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const hotels = [
  {
    id: "1",
    name: "Redhome Dorm",
    location: "TP. Hồ Chí Minh",
    image:
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/616736774.jpg?k=123",
    price: 450000,
    rating: 8.7,
  },
  {
    id: "2",
    name: "The Saigon Hotel",
    location: "Quận 1, TP. Hồ Chí Minh",
    image:
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/616736776.jpg?k=456",
    price: 890000,
    rating: 9.1,
  },
  {
    id: "3",
    name: "Golden Star Hotel",
    location: "Hà Nội",
    image:
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/616736777.jpg?k=789",
    price: 720000,
    rating: 8.4,
  },
];

export default function SearchResultScreen() {
  const router = useRouter();

  const renderHotel = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/HotelDetailScreen",
          params: { ...item },
        })
      }
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.location}>{item.location}</Text>
        <Text style={styles.price}>{item.price.toLocaleString()}₫ / đêm</Text>
        <Text style={styles.rating}>⭐ {item.rating}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Kết quả tìm kiếm khách sạn</Text>
      <FlatList
        data={hotels}
        renderItem={renderHotel}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fafafa",
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 2,
  },
  image: { width: 110, height: 110 },
  info: { flex: 1, padding: 8 },
  name: { fontSize: 16, fontWeight: "600" },
  location: { color: "#555", marginVertical: 4 },
  price: { color: "#007bff", fontWeight: "600" },
  rating: { color: "#f39c12", marginTop: 4 },
});
