import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingSuccessScreen() {
  const router = useRouter();
  const { hotelName } = useLocalSearchParams<{ hotelName: string }>();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/190/190411.png" }}
          style={styles.icon}
        />

        <Text style={styles.title}>🎉 Đặt phòng thành công!</Text>
        <Text style={styles.desc}>
          Cảm ơn bạn đã đặt phòng tại{" "}
          <Text style={{ fontWeight: "700", color: "#0071C2" }}>{hotelName}</Text>
        </Text>

        <TouchableOpacity style={styles.btn} onPress={() => router.replace("/(tabs)")}>
          <Text style={styles.btnText}>Quay về Trang chủ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  icon: { width: 120, height: 120, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "700", color: "#0071C2" },
  desc: { textAlign: "center", marginTop: 10, color: "#444" },
  btn: {
    backgroundColor: "#0071C2",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    width: "80%",
  },
  btnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
});
