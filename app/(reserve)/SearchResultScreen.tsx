import { useRouter } from "expo-router";
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
      "https://500px.com/photo/1118006889/reddorm2-by-01.-huynh-van-hieu",
    price: 450000,
    rating: 4.3,
  },
  {
    id: "2",
    name: "The Saigon Hotel",
    location: "Quận 1, TP. Hồ Chí Minh",
    image:
      "https://500px.com/photo/1118007728/the-hotel-by-01.-huynh-van-hieu",
    price: 890000,
    rating: 4.9,
  },
  {
    id: "3",
    name: "Golden Star Hotel",
    location: "Hà Nội",
    image:
      "https://500px.com/photo/1118007627/golden-strt-by-01.-huynh-van-hieu",
    price: 720000,
    rating: 4.2,
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
