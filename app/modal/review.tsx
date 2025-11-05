import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const YOUR_REVIEW_API_URL = "https://68d55f5ae29051d1c0ae6203.mockapi.io";

const StarRating = ({
  rating,
  setRating,
}: {
  rating: number;
  setRating: (rating: number) => void;
}) => {
  return (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable key={star} onPress={() => setRating(star)}>
          <Feather
            name="star"
            size={32}
            color={star <= rating ? "#FFD700" : "#ccc"}
            style={styles.star}
          />
        </Pressable>
      ))}
    </View>
  );
};

export default function ReviewModalScreen() {
  const router = useRouter();

  const { placeid, placeName } = useLocalSearchParams<{
    placeid: string;
    placeName: string;
  }>();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      Alert.alert("Lỗi", "Vui lòng chọn ít nhất 1 sao.");
      return;
    }
    if (!comment.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập bình luận của bạn.");
      return;
    }
    if (!placeid) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${YOUR_REVIEW_API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          author: "Người dùng Ẩn danh",
          rating: rating, // Gửi rating 1-5
          comment: comment,
          placeid: placeid,
          createdAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        Alert.alert("Thành công", "Cảm ơn bạn đã gửi đánh giá!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Lỗi", "Không thể gửi đánh giá. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi gửi review:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi kết nối.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Đánh giá của bạn về</Text>
          <Text style={styles.placeName}>{placeName || "Địa điểm"}</Text>

          <StarRating rating={rating} setRating={setRating} />

          <TextInput
            style={styles.textInput}
            placeholder="Viết bình luận của bạn tại đây..."
            multiline
            numberOfLines={5}
            value={comment}
            onChangeText={setComment}
            placeholderTextColor="#888"
          />

          <Pressable
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmitReview}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Gửi đánh giá</Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  placeName: {
    fontSize: 18,
    color: "#007AFF",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 4,
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  star: {
    marginHorizontal: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    textAlignVertical: "top",
    fontSize: 16,
    minHeight: 150,
    backgroundColor: "#f9f9f9",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#a9d0ff",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

