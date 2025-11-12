import { useLocalSearchParams, useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthConText";
import { db } from "../../js/config";

export default function BookingConfirmScreen() {
  const router = useRouter();
  const { hotelName, roomName, price, image, guests, beds } = useLocalSearchParams<{
    hotelName: string;
    roomName: string;
    price: string;
    image: string;
    guests: string;
    beds: string;
  }>();

  const { userEmail } = useAuth();

  const handleReserve = async () => {
    try {
      if (!userEmail) {
        Alert.alert("Cần đăng nhập", "Vui lòng đăng nhập để đặt phòng!");
        router.replace("/(auth)/login");
        return;
      }

      await addDoc(collection(db, "bookings"), {
        userEmail,
        hotelName,
        roomName,
        price: Number(price),
        guests: Number(guests),
        beds,
        createdAt: serverTimestamp(),
      });

      router.replace({
        pathname: "/(reserve)/BookingSuccessScreen",
        params: { hotelName },
      });
    } catch (error) {
      console.error("Lỗi khi lưu đơn đặt phòng:", error);
      Alert.alert("Lỗi", "Không thể lưu thông tin đặt phòng.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {image && <Image source={{ uri: image }} style={styles.image} />}

        <View style={styles.infoBox}>
          <Text style={styles.hotel}>{hotelName}</Text>
          <Text style={styles.room}>{roomName}</Text>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.detail}>👥 {guests} khách</Text>
            <Text style={styles.detail}>🛏️ {beds}</Text>
          </View>

          <Text style={styles.price}>💰 Giá: {price} / đêm</Text>

          <View style={styles.policyBox}>
            <Text>🔁 Miễn phí huỷ phòng</Text>
            <Text>✅ Thanh toán tại chỗ nghỉ</Text>
            <Text style={{ color: "green" }}>💳 Không cần thẻ tín dụng</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleReserve}>
          <Text style={styles.buttonText}>Xác nhận đặt phòng</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancel} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Quay lại</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 16 },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  infoBox: { marginBottom: 20 },
  hotel: { fontSize: 20, fontWeight: "700", color: "#0071C2" },
  room: { fontSize: 18, fontWeight: "600", color: "#222", marginTop: 4 },
  detail: { color: "#333", marginVertical: 2 },
  price: { fontSize: 16, fontWeight: "700", marginTop: 10 },
  policyBox: {
    backgroundColor: "#F9FBFF",
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#0071C2",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  cancel: { alignItems: "center" },
  cancelText: { color: "#0071C2", fontWeight: "600" },
});
