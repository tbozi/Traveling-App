import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { db } from "../../js/config";


interface Place {
  id: string;
  title: string;
  location: string;
  image: string;
  type: string;
  desc: string;
}

interface Review {
  id: string;
  createdAt: string;
  author: string;
  rating: number;
  comment: string;
  placeid: string;
}

const StarDisplay = ({ rating }: { rating: number }) => (
  <View style={styles.starDisplay}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Feather key={s} name="star" size={16} color={s <= rating ? "#FFD700" : "#ccc"} />
    ))}
  </View>
);

const ReviewItem = ({ review }: { review: Review }) => (
  <View style={styles.reviewItem}>
    <Text style={styles.reviewAuthor}>{review.author}</Text>
    <StarDisplay rating={review.rating} />
    <Text style={styles.reviewComment}>{review.comment}</Text>
  </View>
);

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchPlace = async () => {
      try {
        setLoading(true);
        const placeRef = doc(db, "places", id);
        const placeSnap = await getDoc(placeRef);
        if (placeSnap.exists()) {
          setPlace({ id: placeSnap.id, ...placeSnap.data() } as Place);
        } else {
          setPlace(null);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPlace();
  }, [id]);


  useEffect(() => {
    if (!id) return;

    setReviewsLoading(true);
    const q = query(
      collection(db, "reviews"),
      where("placeid", "==", id),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const reviewList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Review[];
        setReviews(reviewList);
        setReviewsLoading(false);
      },
      (error) => {
        console.error("Lỗi khi nghe realtime reviews:", error);
        setReviewsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [id]);

  if (loading)
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text>Đang tải chi tiết...</Text>
      </SafeAreaView>
    );

  if (!place)
    return (
      <SafeAreaView style={styles.center}>
        <Text>Không tìm thấy địa điểm 🥲</Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.safeArea}>
      
          <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết địa điểm</Text>
      </View>
<ScrollView style={styles.container}>
        <Image source={{ uri: place.image }} style={styles.image} />

        <View style={styles.content}>
          <Text style={styles.title}>{place.title}</Text>
          <Text style={styles.location}>{place.location}</Text>

          <Text style={styles.descTitle}>Giới thiệu</Text>
          <Text style={styles.desc}>{place.desc}</Text>

          <Pressable
            style={styles.reviewButton}
            onPress={() =>
              router.push({
                pathname: "/modal/review",
                params: { placeid: place.id, placeName: place.title },
              })
            }
          >
            <Feather name="edit-3" size={18} color="#fff" />
            <Text style={styles.reviewButtonText}>Viết đánh giá của bạn</Text>
          </Pressable>

          <View style={styles.reviewsContainer}>
            <Text style={styles.reviewsTitle}>Đánh giá ({reviews.length})</Text>

            {reviewsLoading ? (
              <ActivityIndicator color="#1E90FF" style={{ marginVertical: 20 }} />
            ) : reviews.length === 0 ? (
              <Text style={styles.noReviewsText}>Chưa có đánh giá nào cho địa điểm này.</Text>
            ) : (
              <>
                <ScrollView style={styles.reviewsScroll} nestedScrollEnabled>
                  {(showAllReviews ? reviews : reviews.slice(0, 3)).map((r) => (
                    <ReviewItem key={r.id} review={r} />
                  ))}
                </ScrollView>

                {reviews.length > 3 && (
                  <TouchableOpacity
                    style={styles.moreButton}
                    onPress={() => setShowAllReviews(!showAllReviews)}
                  >
                    <Text style={styles.moreButtonText}>
                      {showAllReviews ? "Thu gọn" : "Xem thêm"}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={() =>
            router.push({
              pathname: "/(reserve)/ReserveScreen",
              params: { id: place.id, destination: place.title },
            })
          }
        >
          <Text style={styles.bookButtonText}>Đặt phòng</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },
  image: { width: "100%", height: 250 },
  content: { padding: 16, paddingBottom: 50 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 6 },
  location: { fontSize: 16, color: "#666", marginBottom: 10 },
  descTitle: { fontSize: 18, fontWeight: "600", marginTop: 16 },
  desc: { fontSize: 15, color: "#444", marginTop: 6, lineHeight: 22 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  reviewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0E65B0",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  reviewButtonText: { color: "#fff", fontWeight: "600", marginLeft: 6 },
  reviewsContainer: { marginTop: 20 },
  reviewsTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  reviewItem: {
    backgroundColor: "#F4F6F8",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  reviewAuthor: { fontWeight: "600" },
  reviewComment: { color: "#444", marginTop: 4 },
  noReviewsText: { color: "#888", fontStyle: "italic" },
  bookButton: {
    backgroundColor: "#0E65B0",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
    borderRadius: 10,
  },
  bookButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  starDisplay: { flexDirection: "row", marginVertical: 4 },
  reviewsScroll: { maxHeight: 250, marginBottom: 10 },
  moreButton: {
    alignSelf: "center",
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#E8F0FE",
  },
  moreButtonText: { color: "#1E90FF", fontWeight: "600" },
    header: {
    color: "#013687",
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
    textAlign: "center",

  },
});
