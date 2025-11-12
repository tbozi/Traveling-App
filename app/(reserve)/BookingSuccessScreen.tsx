import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingSuccessScreen() {
  const router = useRouter();
  const { hotelName } = useLocalSearchParams<{ hotelName: string }>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/148/148767.png",
          }}
          style={styles.icon}
        />

        <Text style={styles.title}>🎉 Đặt phòng thành công!</Text>
        <Text style={styles.desc}>
          Cảm ơn bạn đã đặt phòng tại{" "}
          <Text style={{ fontWeight: "700", color: "#0071C2" }}>
            {hotelName}
          </Text>
        </Text>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.homeText}>🏠 Quay về Trang chủ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/(tabs)/search")}
        >
          <Text style={styles.backText}>🔍 Tiếp tục tìm khách sạn khác</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  icon: { width: 120, height: 120, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "700", color: "#0071C2" },
  desc: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    marginVertical: 10,
  },
  homeButton: {
    backgroundColor: "#0071C2",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
  },
  homeText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  backButton: { marginTop: 15 },
  backText: { color: "#0071C2", fontWeight: "600" },
});
