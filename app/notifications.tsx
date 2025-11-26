import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
const NOTIFICATIONS = [
  { id: "1", title: "Ưu đãi đặc biệt 🎉", message: "Giảm 30% cho chuyến đi Sapa tuần này!" },
  { id: "2", title: "Địa điểm mới 🌴", message: "Khám phá đảo Phú Quốc - thiên đường nhiệt đới." },
  { id: "3", title: "Nhắc nhở ✈️", message: "Đừng quên hoàn tất đặt vé cho chuyến đi Đà Nẵng." },
];
const router = useRouter();

export default function NotificationsScreen() {
  return (
    
    <View style={styles.container}>
      
<View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thông báo</Text>
        </View> 


      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA", paddingTop: 50 },
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
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  title: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  message: { color: "#555" },
});
