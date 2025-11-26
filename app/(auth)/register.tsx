import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../js/config";

export default function RegisterScreen() {
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleRegister = async () => {
    if (!fullname || !email || !password || !confirm) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      // 1. Tạo tài khoản bằng Firebase Auth
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // 2. Lưu thông tin bổ sung vào Firestore
      await setDoc(doc(db, "users", res.user.uid), {
        fullname,
        email,
        createdAt: new Date(),
      });

      Alert.alert("Đăng ký thành công!", "Hãy đăng nhập để tiếp tục.");
      router.replace("/(auth)/login");
    } catch (error: any) {
      console.log("Register error:", error);
      Alert.alert("Lỗi", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Đăng ký</Text>

      <TextInput
        placeholder="Họ và tên"
        value={fullname}
        onChangeText={setFullname}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="Xác nhận mật khẩu"
        value={confirm}
        onChangeText={setConfirm}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.btn} onPress={handleRegister}>
        <Text style={styles.btnText}>Đăng ký</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Đã có tài khoản?{" "}
        <Link href="/(auth)/login" style={styles.link}>
          Đăng nhập
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
