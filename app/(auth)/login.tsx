import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthConText";

import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../js/config";

export default function LoginScreen() {
  const router = useRouter();
  const { redirectTo, hotelId } = useLocalSearchParams();

  const { setUserEmail, setUserName } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const userData = snap.data();
        setUserEmail(user.email || "");
        setUserName(userData.fullname || "Người dùng");
      }

      Alert.alert("Đăng nhập thành công!");

      if (redirectTo && hotelId) {
        router.replace({
          pathname: redirectTo as any,   // 🔥 FIX TYPE Ở ĐÂY
          params: { id: hotelId },
        });
        return;
      }

      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Lỗi đăng nhập", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Đăng nhập</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Chưa có tài khoản?{" "}
        <Link href="/(auth)/register" style={styles.link}>
          Đăng ký
        </Link>
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 20 },
  input: { width: "100%", backgroundColor: "#fff", borderRadius: 8, padding: 12, borderWidth: 1, borderColor: "#ddd", marginBottom: 12 },
  btn: { backgroundColor: "#1E90FF", width: "100%", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 10 },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  footerText: { marginTop: 20, color: "#555" },
  link: { color: "#1E90FF", fontWeight: "600" },
});
