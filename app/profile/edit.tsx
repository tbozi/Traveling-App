// app/profile/edit.tsx

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../js/config";

import { useAuth } from "../../context/AuthConText";

export const options = {
  headerShown: false, // ✔ TẮT HEADER EXPO ROUTER
};

export default function EditProfileScreen() {
  const router = useRouter();
  const { setUserName } = useAuth();

  const [fullname, setFullname] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const snap = await getDoc(doc(db, "users", currentUser.uid));

        if (snap.exists()) {
          const data = snap.data();
          setFullname(data.fullname || "");
        }
      } catch (error) {
        Alert.alert("Lỗi", "Không thể tải dữ liệu người dùng.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleSave = async () => {
    if (!fullname.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập họ tên!");
      return;
    }

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      await updateDoc(doc(db, "users", currentUser.uid), {
        fullname: fullname.trim(),
      });

      await updateProfile(currentUser, {
        displayName: fullname.trim(),
      });

      setUserName(fullname.trim());

      Alert.alert("Thành công", "Cập nhật thông tin thành công!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật thông tin.");
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
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Họ và tên"
        value={fullname}
        onChangeText={setFullname}
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

  backBtn: { marginRight: 80, padding: 4 },

  headerTitle: { fontSize: 20, fontWeight: "700", color: "#fff" },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
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
