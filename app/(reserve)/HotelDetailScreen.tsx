import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { db } from "../../js/config";

export default function HotelDetailScreen() {
  const router = useRouter();
  const { id, hotelId } = useLocalSearchParams<{ id?: string; hotelId?: string }>();
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const hid = String(hotelId ?? "").trim();
        const docId = String(id ?? "").trim();

        console.log("📌 DETAIL PARAM:", { hid, docId });

        if (hid && hid !== "undefined") {
          const hotelSnap = await getDocs(
            query(collection(db, "hotels"), where("hotelId", "==", hid))
          );
          const info = hotelSnap.docs[0]?.data();

          if (info) {
            const detailSnap = await getDocs(
              query(collection(db, "hoteldetails"), where("hotelId", "==", hid))
            );
            const detail = detailSnap.docs[0]?.data();

            setHotel({
              ...info,
              ...detail,
              images: parse(detail?.images),
              facilities: parse(detail?.facilities),
            });
            return;
          }
        }

        if (docId) {
          const hotelDoc = await getDoc(doc(db, "hotels", docId));
          if (hotelDoc.exists()) {
            const info = hotelDoc.data();

            const hid2 = String(info.hotelId ?? docId);

            const detailSnap = await getDocs(
              query(collection(db, "hoteldetails"), where("hotelId", "==", hid2))
            );
            const detail = detailSnap.docs[0]?.data();

            setHotel({
              ...info,
              ...detail,
              images: parse(detail?.images),
              facilities: parse(detail?.facilities),
            });
            return;
          }
        }

        console.log("⚠ Fallback scan all docs");

        const allHotels = await getDocs(collection(db, "hotels"));
        const allDetails = await getDocs(collection(db, "hoteldetails"));

        let fallbackHotel: any = null;
        let fallbackDetail: any = null;

        allHotels.forEach((d) => {
          if (d.id === docId || d.data().hotelId === hid) fallbackHotel = d.data();
        });

        allDetails.forEach((d) => {
          if (d.data().hotelId === hid) fallbackDetail = d.data();
        });

        if (fallbackHotel || fallbackDetail) {
          setHotel({
            ...(fallbackHotel ?? {}),
            ...(fallbackDetail ?? {}),
            images: parse(fallbackDetail?.images),
            facilities: parse(fallbackDetail?.facilities),
          });
          return;
        }

        setHotel(null);
      } catch (e) {
        console.error("🔥 DETAIL ERROR:", e);
        setHotel(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, hotelId]);

  const parse = (val: any) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try {
      return JSON.parse(val);
    } catch {
      return [];
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0071C2" />
      </View>
    );

  if (!hotel)
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy khách sạn.</Text>
      </View>
    );

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{hotel.name?.toUpperCase()}</Text>
      </View>
      <ScrollView>
        <ScrollView horizontal style={{ marginVertical: 10 }}>
          {hotel.images.map((img: string, i: number) => (
            <Image key={i} source={{ uri: img }} style={styles.image} />
          ))}
        </ScrollView>

        <View style={styles.info}>
          <Text style={styles.name}>{hotel.name}</Text>
          <Text style={styles.location}>{hotel.location || hotel.rental}</Text>
          <Text style={styles.rating}>⭐ {hotel.rating}</Text>
          <Text style={styles.price}>{Number(hotel.price).toLocaleString()}₫ / đêm</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tiện nghi nổi bật</Text>
          {hotel.facilities.map((f: string, i: number) => (
            <Text key={i}>• {f}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mô tả</Text>
          <Text>{hotel.description}</Text>
        </View>

        {/* ⭐⭐⭐ THÊM NÚT XEM CÁC LỰA CHỌN ⭐⭐⭐ */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              router.push({
                pathname: "/(reserve)/RoomOptionScreen",
                params: { id: hotelId ?? id, hotelName: hotel.name },
              })
            }
          >
            <Text style={styles.buttonText}>Xem các lựa chọn</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    paddingTop: 60,
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
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 0,
  },
  image: { width: 320, height: 180, marginRight: 10, borderRadius: 8 },
  info: { padding: 16 },
  name: { fontSize: 20, fontWeight: "700" },
  location: { color: "#555" },
  rating: { color: "#f39c12" },
  price: { color: "#0071C2", fontWeight: "700" },
  section: { padding: 16 },
  sectionTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 6 },

  /* ⭐ STYLE CHO NÚT ⭐ */
  button: {
    backgroundColor: "#0E65B0",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
