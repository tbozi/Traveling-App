import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const FRIEND_API_URL = "https://68ff4999e02b16d1753d49db.mockapi.io";
const YOUR_REVIEW_API_URL = "https://68d55f5ae29051d1c0ae6203.mockapi.io";

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
  createdAt: string;
  author: string;
  rating: number;
  comment: string;
  placeid: string;
}

const StarDisplay = ({ rating }: { rating: number }) => (
  <View style={styles.starDisplay}>
    {[1, 2, 3, 4, 5].map((star) => (
      <Feather
        key={star}
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

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPlaceById = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${FRIEND_API_URL}/places/${id}`);
        const data: Place = await response.json();
        setPlace(data);
      } catch (error) {
        console.error("❌ Lỗi tải dữ liệu chi tiết:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceById();
  }, [id]);

  const fetchReviews = useCallback(async () => {
    if (!id) return;
    setReviewsLoading(true);

    try {
      const response = await fetch(
        `${YOUR_REVIEW_API_URL}/reviews?placeid=${id}`
      );

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          setReviews([]);
        }
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("❌ Lỗi tải reviews:", error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchReviews();
    }, [fetchReviews])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text>Đang tải chi tiết...</Text>
      </View>
    );
  }

  if (!place) {
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy địa điểm 🥲</Text>
      </View>
    );
  }

  const discountedPrice =
    place.discount && place.discount > 0
      ? place.price * (1 - place.discount / 100)
      : place.price;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: place.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{place.title}</Text>
        <Text style={styles.location}>{place.location}</Text>

        {place.discount && place.discount > 0 ? (
          <>
            <Text style={styles.oldPrice}>
              {place?.price?.toLocaleString?.() ?? 0}₫
            </Text>
            <Text style={styles.newPrice}>
              {discountedPrice?.toLocaleString?.() ?? 0}₫ (-{place.discount}%)
            </Text>
          </>
        ) : (
          <Text style={styles.newPrice}>
            {place?.price?.toLocaleString?.() ?? 0}₫
          </Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  image: { width: "100%", height: 250 },
  content: { padding: 16, paddingBottom: 50 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 6 },
  location: { fontSize: 16, color: "#666", marginBottom: 10 },
  oldPrice: {
    textDecorationLine: "line-through",
    color: "#999",
    fontSize: 15,
  },
  newPrice: { color: "#1E90FF", fontWeight: "bold", fontSize: 18 },
  descTitle: { fontSize: 18, fontWeight: "600", marginTop: 16 },
  desc: { fontSize: 15, color: "#444", marginTop: 6, lineHeight: 22 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  reviewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    gap: 10,
  },
  reviewButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  reviewsContainer: {
    marginTop: 25,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 15,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  noReviewsText: {
    textAlign: "center",
    color: "#888",
    fontStyle: "italic",
    padding: 20,
  },
  reviewItem: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  reviewAuthor: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
  },
  reviewComment: {
    fontSize: 14,
    color: "#555",
    marginTop: 6,
    lineHeight: 20,
  },
  starDisplay: {
    flexDirection: "row",
    gap: 2,
    marginBottom: 5,
  },
});

