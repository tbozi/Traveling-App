import { useRouter } from "expo-router";
import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    // Xoá token hoặc dữ liệu người dùng nếu có
    router.replace("/(auth)/login"); // ✅ quay lại login
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Hồ sơ cá nhân</Text>
      <Button title="Đăng xuất" onPress={handleLogout} />
    </SafeAreaView>
  );
}
