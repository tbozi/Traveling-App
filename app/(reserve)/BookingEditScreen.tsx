import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../js/config";

export default function EditBookingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);

  // Form States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("1");
  const [beds, setBeds] = useState("");

  // ─────────── LOAD BOOKING ───────────
  const fetchBooking = async () => {
    try {
      const docRef = doc(db, "bookings", id);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();
        setBooking(data);

        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setGuests(String(data.guests || "1"));
        setBeds(data.beds || "");
      }
    } catch (e) {
      console.log("Lỗi load booking:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, []);

  // ─────────── UPDATE BOOKING ───────────
  const handleUpdate = async () => {
    if (!firstName || !lastName || !email || !phone || !guests || !beds) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ.");
      return;
    }

    try {
      const docRef = doc(db, "bookings", id);

      await updateDoc(docRef, {
        firstName,
        lastName,
        email,
        phone,
        guests: Number(guests),
        beds,
      });

      Alert.alert("Thành công", "Bạn đã cập nhật thông tin đặt phòng!");
      router.replace({
        pathname: "/(reserve)/BookingDetailScreen",
        params: { id },
      });
    } catch (e) {
      console.log("Lỗi update:", e);
      Alert.alert("Lỗi", "Không thể cập nhật thông tin.");
    }
  };

  if (loading)
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text>Đang tải dữ liệu...</Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sửa thông tin đặt phòng</Text>
      </View>

      <ScrollView>
        <View style={styles.box}>
          <Text style={styles.label}>Họ *</Text>
          <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />
        </View>

        <View style={styles.box}>
          <Text style={styles.label}>Tên *</Text>
          <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />
        </View>

        <View style={styles.box}>
          <Text style={styles.label}>Email *</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} />
        </View>

        <View style={styles.box}>
          <Text style={styles.label}>Số điện thoại *</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* NEW: Guests */}
        <View style={styles.box}>
          <Text style={styles.label}>Số khách *</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={guests}
            onChangeText={setGuests}
          />
        </View>

        {/* NEW: Beds */}
        {/* <View style={styles.box}>
          <Text style={styles.label}>Loại giường *</Text>
          <TextInput
            style={styles.input}
            value={beds}
            onChangeText={setBeds}
            placeholder="VD: 1 giường đôi, 1 giường đơn"
          />
        </View> */}

        <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
          <Text style={styles.updateBtnText}>Cập nhật</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    backgroundColor: "#0071C2",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 12,
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

  updateBtn: {
    backgroundColor: "#1E90FF",
    padding: 16,
    margin: 16,
    borderRadius: 10,
  },
  updateBtnText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
