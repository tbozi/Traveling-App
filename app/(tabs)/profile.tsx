// app/(tabs)/profile.tsx

import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthConText";

import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../js/config";

type ProfileMenuItemProps = {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  onPress: () => void;
  isLogout?: boolean;
};

const ProfileMenuItem = ({ icon, title, onPress, isLogout = false }: ProfileMenuItemProps) => (
  <Pressable style={styles.menuItem} onPress={onPress}>
    <Feather name={icon} size={22} color={isLogout ? "#E53935" : "#333"} />
    <Text style={[styles.menuTitle, isLogout && styles.logoutText]}>{title}</Text>
    {!isLogout && <Feather name="chevron-right" size={22} color="#888" />}
  </Pressable>
);

export default function ProfileScreen() {
  const router = useRouter();
  const { userEmail, userName, setUserEmail, setUserName } = useAuth();

  const [userData, setUserData] = useState<{ fullname: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    setUserEmail(null);
    setUserName(null);
    Alert.alert("Đã đăng xuất", "Hẹn gặp lại bạn!");
    router.replace("/(auth)/login");
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setLoading(false);
          return;
        }

        const snap = await getDoc(doc(db, "users", currentUser.uid));

        if (snap.exists()) {
          const data = snap.data();
          setUserData({
            fullname: data.fullname || userName || "Không có tên",
            email: data.email || userEmail || "",
          });
        } else {
          setUserData({
            fullname: userName || "Không có tên",
            email: userEmail || "",
          });
        }
      } catch (error) {
        console.error("Firestore fetch error:", error);
        Alert.alert("Lỗi mạng", "Không thể tải dữ liệu người dùng.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userName]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  if (!userEmail) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 16, color: "#555", textAlign: "center", marginBottom: 20 }}>
            Bạn chưa đăng nhập.{"\n"}Vui lòng đăng nhập để xem hồ sơ.
          </Text>

          <Pressable
            onPress={() => router.replace("/(auth)/login")}
            style={{
              backgroundColor: "#0E65B0",
              paddingVertical: 12,
              paddingHorizontal: 30,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>Đăng nhập ngay</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileHeader}>
          <Image
            style={styles.avatar}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            }}
          />
          <Text style={styles.name}>{userData?.fullname || userName}</Text>
          <Text style={styles.email}>{userData?.email}</Text>

          <Pressable
            style={styles.editButton}
            onPress={() => router.push("/profile/edit")} // ✔ ABSOLUTE PATH
          >
            <Text style={styles.editButtonText}>Chỉnh sửa hồ sơ</Text>
          </Pressable>
        </View>

        <View style={styles.menuContainer}>
          <ProfileMenuItem icon="settings" title="Cài đặt" onPress={() => {}} />
          <ProfileMenuItem icon="bell" title="Thông báo" onPress={() => router.push("/notifications")} />
          <ProfileMenuItem
            icon="book"
            title="Đơn đặt phòng của tôi"
            onPress={() => router.push("/(reserve)/MyBookingScreen")}
          />
          <ProfileMenuItem
            icon="truck"
            title="Đơn thuê xe của tôi"
            onPress={() => router.push("/(rent)/MyCarBookingScreen")}
          />
          <ProfileMenuItem icon="credit-card" title="Thanh toán" onPress={() => {}} />
          <ProfileMenuItem icon="help-circle" title="Trung tâm hỗ trợ" onPress={() => {}} />
        </View>

        <View style={styles.logoutContainer}>
          <ProfileMenuItem icon="log-out" title="Đăng xuất" onPress={handleLogout} isLogout />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f8" },
  scrollContainer: { paddingBottom: 20 },

  profileHeader: {
    backgroundColor: "#ffffff",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 15,
  },

  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  name: { fontSize: 22, fontWeight: "bold", color: "#333" },
  email: { fontSize: 16, color: "#888", marginBottom: 20 },

  editButton: {
    backgroundColor: "#0E65B0",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  editButtonText: { color: "#fff", fontSize: 14, fontWeight: "600" },

  menuContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    marginHorizontal: 10,
    overflow: "hidden",
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f8",
  },
  menuTitle: { flex: 1, fontSize: 16, color: "#333", marginLeft: 15 },
  logoutContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    marginHorizontal: 10,
    marginTop: 15,
    overflow: "hidden",
  },
  logoutText: { color: "#E53935", fontWeight: "600" },
});
