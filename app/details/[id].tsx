import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../js/config"; // đường dẫn tới firebase config của bạn



interface Place {
  id: string;
  title: string;
  location: string;
  image: string;
  price: number;
  discount: number;
  type: string;
  desc: string;
}

interface Review {
  id: string;
  createAt: string;
  author: string;
  rating: number;
  comment: string;
  placeid: string;
}

const StarDisplay = ({ rating }: { rating: number }) => (
  <View style={styles.starDisplay}>
    {[1, 2, 3, 4, 5].map((star) => (
      <Feather
        key={`star-${star}`}
        name="star"
        size={16}
        color={star <= rating ? "#FFD700" : "#ccc"}
      />
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

  useEffect(() => {
  if (!id) return;

<<<<<<< Updated upstream
    const fetchPlaceById = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${FRIEND_API_URL}/places/${id}`);
        const data: Place = await response.json();
        setPlace(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
=======
  const fetchPlaceAndReviews = async () => {
    try {
      setLoading(true);
      setReviewsLoading(true);

      // 👉 Lấy place theo ID
      const placeRef = doc(db, "places", id);
      const placeSnap = await getDoc(placeRef);

      if (placeSnap.exists()) {
        setPlace({ id: placeSnap.id, ...placeSnap.data() } as Place);
      } else {
        setPlace(null);
>>>>>>> Stashed changes
      }

<<<<<<< Updated upstream
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const res = await fetch(`${YOUR_REVIEW_API_URL}/reviews?placeid=${id}`);
        const data: Review[] = await res.json();
        setReviews(data);
      } catch (err) {
        console.error(err);
      } finally {
        setReviewsLoading(false);
      }
    };
=======
      // 👉 Lấy reviews theo placeid
      const reviewsRef = collection(db, "reviews");
      const q = query(reviewsRef, where("placeid", "==", id));
      const querySnap = await getDocs(q);

      const reviewsData: Review[] = querySnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Review[];

      setReviews(reviewsData);
    } catch (error) {
      console.error("❌ Firebase error:", error);
    } finally {
      setLoading(false);
      setReviewsLoading(false);
    }
  };

  fetchPlaceAndReviews();
}, [id]);
>>>>>>> Stashed changes


  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text>Đang tải chi tiết...</Text>
      </SafeAreaView>
    );
  }

  if (!place) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Không tìm thấy địa điểm 🥲</Text>
      </SafeAreaView>
    );
  }

  const discountedPrice =
    place.discount && place.discount > 0
      ? place.price * (1 - place.discount / 100)
      : place.price;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Image source={{ uri: place.image }} style={styles.image} />

        <View style={styles.content}>
          <Text style={styles.title}>{place.title}</Text>
          <Text style={styles.location}>{place.location}</Text>

          {place.discount && place.discount > 0 ? (
            <>
              <Text style={styles.oldPrice}>
                {place.price.toLocaleString()}₫
              </Text>
              <Text style={styles.newPrice}>
                {discountedPrice.toLocaleString()}₫ (-{place.discount}%)
              </Text>
            </>
          ) : (
            <Text style={styles.newPrice}>{place.price.toLocaleString()}₫</Text>
          )}

          <Text style={styles.descTitle}>Giới thiệu</Text>
          <Text style={styles.desc}>{place.desc}</Text>

          <Pressable
            style={styles.reviewButton}
            onPress={() =>
              router.push({
                pathname: "/modal/review",
                params: {
                  placeid: place.id,
                  placeName: place.title,
                },
              })
            }
          >
            <Feather name="edit-3" size={18} color="#fff" />
            <Text style={styles.reviewButtonText}>Viết đánh giá của bạn</Text>
          </Pressable>

          <View style={styles.reviewsContainer}>
            <Text style={styles.reviewsTitle}>Đánh giá ({reviews.length})</Text>
            {reviewsLoading ? (
              <ActivityIndicator
                color="#1E90FF"
                style={{ marginVertical: 20 }}
              />
            ) : reviews.length === 0 ? (
              <Text style={styles.noReviewsText}>
                Chưa có đánh giá nào cho địa điểm này.
              </Text>
            ) : (
              reviews.map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={() =>
            router.push({
              pathname: "/(reserve)/ReseverScreen",
              params: { id: place.id, destination: place.title },
            })
          }
        >
          <Text style={styles.bookButtonText}>Đặt vé</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },
  image: { width: "100%", height: 250 },
  content: { padding: 16, paddingBottom: 50 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 6 },
  location: { fontSize: 16, color: "#666", marginBottom: 10 },
  oldPrice: { textDecorationLine: "line-through", color: "#999", fontSize: 15 },
  newPrice: { color: "#1E90FF", fontWeight: "bold", fontSize: 18 },
  descTitle: { fontSize: 18, fontWeight: "600", marginTop: 16 },
  desc: { fontSize: 15, color: "#444", marginTop: 6, lineHeight: 22 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  reviewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E90FF",
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
    backgroundColor: "#1E90FF",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
    borderRadius: 10,
  },
  bookButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  starDisplay: { flexDirection: "row", marginVertical: 4 },
});
