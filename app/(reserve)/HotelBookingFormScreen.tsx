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

export default function HotelBookingFormScreen() {
  const router = useRouter();
  const { userEmail } = useAuth();

  const params = useLocalSearchParams<{
    hotelName: string;
    roomName: string;
    price: string;
    image: string;
    guests: string;
    beds: string;
    checkInDate: string;
    checkOutDate: string;
    nights: string;
    totalAmount: string;
  }>();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(userEmail || "");
  const [phone, setPhone] = useState("");

  const isValidEmail = (mail: string) => /\S+@\S+\.\S+/.test(mail);
  const isValidPhone = (txt: string) => /^[0-9]{10}$/.test(txt);

  const handleNext = async () => {
  if (!firstName || !lastName || !email || !phone) {
    Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ.");
    return;
  }

  if (!isValidEmail(email)) {
    Alert.alert("Email không hợp lệ", "Vui lòng nhập đúng định dạng email.");
    return;
  }

  if (!isValidPhone(phone)) {
    Alert.alert("Sai số điện thoại", "Số điện thoại phải gồm đúng 10 chữ số.");
    return;
  }

  try {
    await addDoc(collection(db, "bookings"), {
      hotelName: params.hotelName,
      roomName: params.roomName,
      price: Number(params.price),
      image: params.image,
      guests: params.guests,
      beds: params.beds,
      checkInDate: params.checkInDate,
      checkOutDate: params.checkOutDate,
      nights: Number(params.nights),
      totalAmount: Number(params.totalAmount),
      firstName,
      lastName,
      email,
      phone,
      userEmail,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    router.push({
      pathname: "/(reserve)/PaymentScreen",
      params: {
        hotelName: params.hotelName,
        totalAmount: params.totalAmount,
      },
    });
  } catch (err) {
    console.log("Booking error:", err);
    Alert.alert("Lỗi", "Không thể tạo đơn đặt phòng.");
  }
};


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin đặt phòng</Text>
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
          <TextInput
            style={styles.input}
            value={email}
            keyboardType="email-address"
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.box}>
          <Text style={styles.label}>Số điện thoại *</Text>
          <TextInput
            style={styles.input}
            maxLength={10}
            keyboardType="number-pad"
            value={phone}
            onChangeText={(txt) => setPhone(txt.replace(/[^0-9]/g, ""))}
          />
        </View>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>Hoàn tất đặt phòng</Text>
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
  },
  backBtn: { marginRight: 65 },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },

  box: { padding: 16 },
  label: { fontWeight: "600", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
  },

  nextBtn: {
    backgroundColor: "#0E65B0",
    margin: 16,
    padding: 16,
    borderRadius: 10,
  },
  nextBtnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
});
