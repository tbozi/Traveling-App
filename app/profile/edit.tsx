import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthConText"; // ⚠️ đường dẫn đúng theo thư mục của bạn

export default function EditProfileScreen() {
  const router = useRouter();
  const { userEmail } = useAuth(); // ✅ lấy email đang đăng nhập

  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");

  const apiUrl = "https://68ff4999e02b16d1753d49db.mockapi.io/users";

  // 🔹 Tải dữ liệu user theo email đang đăng nhập
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(apiUrl);
        const users = await res.json();
        const currentUser = users.find((u: any) => u.email === userEmail);

        if (currentUser) {
          setFullname(currentUser.fullname || "");
          setPhone(currentUser.phone || "");
          setUserId(currentUser.id);
        } else {
          Alert.alert("Lỗi", "Không tìm thấy người dùng!");
        }
      } catch (error) {
        console.error("Fetch user error:", error);
        Alert.alert("Lỗi mạng", "Không thể tải thông tin người dùng.");
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) fetchUser();
  }, [userEmail]);

  // 🔹 Hàm cập nhật dữ liệu
  const handleSave = async () => {
    if (!fullname || !phone) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, phone }),
      });

      if (res.ok) {
        Alert.alert("Thành công", "Cập nhật thông tin thành công!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Lỗi", "Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Lỗi mạng", "Không thể cập nhật dữ liệu.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}></Text>

      </View>


      <TextInput
        style={styles.input}
        placeholder="Họ và tên"
        value={fullname}
        onChangeText={setFullname}
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TouchableOpacity style={styles.btn} onPress={handleSave}>
        <Text style={styles.btnText}>Lưu thay đổi</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
        <Text style={styles.cancelText}>Hủy</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", padding: 20 },
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
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  btn: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  cancelBtn: { marginTop: 12, alignItems: "center" },
  cancelText: { color: "#888", fontSize: 15 },
});
