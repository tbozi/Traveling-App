// app/(reserve)/hotelData.ts
export const hotels = [
  {
    id: "1",
    name: "RedHome Dorm",
    rating: 9.5,
    reviews: 124,
    latitude: 10.762622,
    longitude: 106.660172,
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/565493917.jpg?k=a3e97e0e80",
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/565493918.jpg?k=45e97e0e70",
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/565493919.jpg?k=33e97e0e60"
    ],
    highlights: ["Chỗ đậu xe", "Tiện nghi nhà bếp"],
    description:
      "RedHome Dorm cung cấp chỗ nghỉ tiện nghi tại trung tâm thành phố với bãi đỗ xe miễn phí, bếp nhỏ, bàn ăn và không gian sinh hoạt chung ấm cúng.",
    checkIn: "Th 3, 28 thg 10",
    checkOut: "Th 4, 29 thg 10",
    searchInfo: "1 phòng · 2 người lớn · Không có trẻ em",
    discount: "Tiết kiệm 65%",
    promo: "Ưu Đãi Cuối Năm",
    freeCancel: "Bạn sẽ không bị trừ tiền ngay",
    reviewsData: [
      {
        user: "Nguyễn Minh",
        comment: "Phòng sạch, yên tĩnh và chủ nhà rất thân thiện.",
        score: 9.8,
      },
      {
        user: "Trần Lan",
        comment: "Vị trí thuận tiện, gần trung tâm và giá hợp lý.",
        score: 9.2,
      },
    ],
  },
  {
    id: "2",
    name: "BlueOcean Resort",
    rating: 8.9,
    reviews: 220,
    latitude: 11.9416,
    longitude: 108.4383,
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/123456789.jpg?k=123",
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/987654321.jpg?k=456"
    ],
    highlights: ["Bãi biển riêng", "Hồ bơi ngoài trời"],
    description:
      "BlueOcean Resort mang đến trải nghiệm sang trọng cùng hồ bơi vô cực hướng biển, bữa sáng tự chọn và spa thư giãn.",
    checkIn: "Th 3, 28 thg 10",
    checkOut: "Th 4, 29 thg 10",
    searchInfo: "1 phòng · 2 người lớn · 1 trẻ em",
    discount: "Tiết kiệm 30%",
    promo: "Ưu Đãi Đặc Biệt",
    freeCancel: "Hủy miễn phí trước 24h",
    reviewsData: [
      {
        user: "Hoàng Phúc",
        comment: "Khu nghỉ đẹp, bữa sáng ngon, nhân viên nhiệt tình.",
        score: 8.7,
      },
      {
        user: "Lê Mai",
        comment: "Phòng có view biển rất đẹp, giá hơi cao nhưng đáng tiền.",
        score: 9.1,
      },
    ],
  },
];
