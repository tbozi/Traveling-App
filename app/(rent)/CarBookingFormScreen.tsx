import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthConText";
import { db } from "../../js/config";

export default function CarBookingFormScreen() {
  const router = useRouter();
  const { userEmail } = useAuth();

  // ⬇ NHẬN TẤT CẢ PARAMS TỪ TRANG TRƯỚC
  const {
    id,
    name,
    price,
    image,
    brand,
    seats,
    pickup,
    dropoff,
    location,
  } = useLocalSearchParams();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(userEmail || "");
  const [phone, setPhone] = useState("");
  const [flight, setFlight] = useState("");

  // ⚡ Validate email
  const isValidEmail = (mail: string) => /\S+@\S+\.\S+/.test(mail);

  // ⚡ Validate phone: chỉ số + đúng 10 số
  const isValidPhone = (txt: string) => /^[0-9]{10}$/.test(txt);

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email || !phone) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ.");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Email không hợp lệ", "Vui lòng nhập đúng định dạng email.");
      return;
    }

    if (!isValidPhone(phone)) {
      Alert.alert("Số điện thoại sai",
        "Số điện thoại phải gồm đúng 10 chữ số."
      );
      return;
    }

    try {
      await addDoc(collection(db, "carBookings"), {
        carId: id,
        carName: name,
        brand,
        seats: Number(seats),
        image,
        price: Number(price),
        pickup,
        dropoff,
        location,
        userEmail,

        // Customer Info
        firstName,
        lastName,
        email,
        phone,
        flight,

        status: "pending",
        createdAt: serverTimestamp(),
      });

      router.replace({
        pathname: "/(rent)/CarBookingSuccessScreen",
        params: { name, price, image },
      });
    } catch (err) {
      Alert.alert("Lỗi", "Không thể tạo đơn thuê xe.");
      console.log("Lỗi tạo đơn thuê xe:", err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin thuê xe</Text>
      </View>

      <ScrollView>
        {/* LAST NAME */}
        <View style={styles.box}>
          <Text style={styles.label}>Họ *</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        {/* FIRST NAME */}
        <View style={styles.box}>
          <Text style={styles.label}>Tên *</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        {/* EMAIL */}
        <View style={styles.box}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={email}
            keyboardType="email-address"
            onChangeText={setEmail}
          />
        </View>

        {/* PHONE */}
        <View style={styles.box}>
          <Text style={styles.label}>Số điện thoại *</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={phone}
            maxLength={10} // Giới hạn 10 ký tự
            onChangeText={(txt) => {
              const clean = txt.replace(/[^0-9]/g, ""); // chỉ giữ số
              setPhone(clean);
            }}
          />
        </View>

      

        {/* BUTTON */}
        <TouchableOpacity style={styles.nextBtn} onPress={handleSubmit}>
          <Text style={styles.nextBtnText}>Xác nhận thuê xe</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    marginRight: 75,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },

  box: { padding: 16 },
  label: { fontWeight: "600", marginBottom: 6, fontSize: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },

  nextBtn: {
    backgroundColor: "#0E65B0",
    padding: 16,
    margin: 16,
    borderRadius: 10,
  },
  nextBtnText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },
});
