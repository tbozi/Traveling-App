import { Feather } from '@expo/vector-icons';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// 1. Thêm import useRouter
import { useRouter } from "expo-router";

// Một component con cho các mục trong menu
// (icon bên trái, chữ ở giữa, mũi tên bên phải)
type ProfileMenuItemProps = {
  icon: keyof typeof Feather.glyphMap; // Tên icon từ Feather
  title: string;
  onPress: () => void;
  isLogout?: boolean; // Tùy chọn để style khác cho nút Logout
};

const ProfileMenuItem = ({ icon, title, onPress, isLogout = false }: ProfileMenuItemProps) => (
  <Pressable style={styles.menuItem} onPress={onPress}>
    <Feather name={icon} size={22} color={isLogout ? '#E53935' : '#333'} />
    <Text style={[styles.menuTitle, isLogout && styles.logoutText]}>{title}</Text>
    {!isLogout && (
      <Feather name="chevron-right" size={22} color="#888" />
    )}
  </Pressable>
);

// Màn hình Profile chính
const ProfileScreen = () => {
  // 2. Thêm logic router và handleLogout từ file của bạn
  const router = useRouter();

  const handleLogout = () => {
    // Xoá token hoặc dữ liệu người dùng nếu có
    console.log("Đang đăng xuất và điều hướng về (auth)/login...");
    router.replace("/(auth)/login"); // ✅ quay lại login
  };

  return (
    // Dùng Edges để chỉ áp dụng safe area cho trên và dưới, bỏ qua 2 bên
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Thêm ScrollView để có thể cuộn nếu nội dung dài */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 1. Phần Header thông tin User */}
        <View style={styles.profileHeader}>
          <Image
            style={styles.avatar}
            source={{
              uri: 'https://placehold.co/100x100/007AFF/FFFFFF?text=User',
            }}
          />
          <Text style={styles.name}>Tên Của Bạn</Text>
          <Text style={styles.email}>your.email@example.com</Text>
          {/* CẬP NHẬT: Đã thêm onPress cho nút Chỉnh sửa */}
          <Pressable style={styles.editButton} onPress={() => router.push('/profile/edit')}>
            <Text style={styles.editButtonText}>Chỉnh sửa hồ sơ</Text>
          </Pressable>
        </View>

        {/* 2. Phần Menu Tùy chọn */}
        <View style={styles.menuContainer}>
          <ProfileMenuItem icon="settings" title="Cài đặt" onPress={() => console.log('Tới Cài đặt')} />
          {/* CẬP NHẬT: Đã thêm router.push() */}
          <ProfileMenuItem icon="bell" title="Thông báo" onPress={() => router.push('/notifications')} />
          <ProfileMenuItem icon="credit-card" title="Thanh toán" onPress={() => console.log('Tới Thanh toán')} />
          <ProfileMenuItem icon="help-circle" title="Trung tâm hỗ trợ" onPress={() => console.log('Tới Hỗ trợ')} />
        </View>

        {/* 3. Nút Đăng xuất - ĐÃ CẬP NHẬT */}
        <View style={styles.logoutContainer}>
          {/* 3. Gắn hàm handleLogout vào đây */}
          <ProfileMenuItem icon="log-out" title="Đăng xuất" onPress={handleLogout} isLogout />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f8', // Màu nền xám nhạt
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  // Header
  profileHeader: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  // Menu
  menuContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginHorizontal: 10,
    overflow: 'hidden', // Để bo góc hoạt động
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f8',
  },
  menuTitle: {
    flex: 1, // Đẩy mũi tên qua phải
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  // Logout
  logoutContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginHorizontal: 10,
    marginTop: 15,
    overflow: 'hidden',
  },
  logoutText: {
    color: '#E53935', // Màu đỏ
    fontWeight: '600',
  },
});

export default ProfileScreen;

