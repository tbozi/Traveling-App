import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentScreen() {
  const router = useRouter();
  const { hotelName, totalAmount } = useLocalSearchParams<{
    hotelName: string;
    totalAmount: string;
  }>();

  return (
    <SafeAreaView style={styles.safe}>
      
      {/* HEADER */}
      <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Kết quả tìm kiếm</Text>
        </View> 


      <View style={styles.container}>
        <Text style={styles.title}>Quét mã để thanh toán</Text>

        <Text style={styles.amount}>
          Số tiền:{" "}
          <Text style={{ color: "#0071C2", fontWeight: "700" }}>
            {Number(totalAmount).toLocaleString()}₫
          </Text>
        </Text>

        {/* QR CODE */}
        <Image
          source={{
            uri: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=travelapp-payment",
          }}
          style={styles.qr}
        />

        <Text style={styles.desc}>
          Vui lòng quét mã QR để hoàn tất thanh toán đơn đặt phòng tại{" "}
          <Text style={{ fontWeight: "700" }}>{hotelName}</Text>.
        </Text>

        <TouchableOpacity
          style={styles.btn}
          onPress={() =>
            router.replace({
              pathname: "/(reserve)/BookingSuccessScreen",
              params: { hotelName },
            })
          }
        >
          <Text style={styles.btnText}>Tôi đã thanh toán</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#013687",
    borderBottomWidth: 1,
    borderBottomColor: "#ececec",
  },
  backBtn: {
    marginRight: 80,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },

  container: { flex: 1, alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginTop: 10 },
  amount: { fontSize: 18, marginTop: 10 },
  qr: { width: 250, height: 250, marginVertical: 25 },
  desc: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: "#0E65B0",
    padding: 14,
    borderRadius: 10,
    width: "80%",
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 16,
  },
});
